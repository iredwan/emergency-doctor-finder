"use client";
import { useState, useEffect } from "react";
import {
  FiSearch,
  FiEdit,
  FiTrash,
  FiPhone,
  FiMail,
  FiUser,
  FiX,
  FiSave,
  FiUpload
} from "react-icons/fi";
import {
  getAllProfiles,
  editProfile,
  deleteProfile
} from "../../apiRequest/dashboardApi";
import { DeleteAlert, ErrorToast, SuccessToast } from "@/helper/helper";
import Link from "next/link";
import { uploadProfileImage } from "@/app/apiRequest/authApi";
import { config } from "../../../config/config.js";

export default function UsersPage() {
  const baseURL = config.uploadURL;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    role: "user",
    img: ""
  });
  const [fileToUpload, setFileToUpload] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllProfiles();
      if (data) {
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      ErrorToast("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm)
  );

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setEditFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
      role: user.role || "user",
      img: user.img || ""
    });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size and type
    if (file.size > 10 * 1024 * 1024) {
      ErrorToast("Image size should be less than 10MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      ErrorToast("Only JPG, JPEG, and PNG images are allowed");
      return;
    }

    // Store the file in state for later upload
    setFileToUpload(file);
  };

  const handleEditSubmit = async (userId) => {
    if (!userId) {
      ErrorToast("User ID is missing");
      return;
    }

    try {
      setProcessing(true);
      
      // Upload image if there's a file to upload
      
        setImageUploading(true);
        
        // Create FormData for image upload
        const formData = new FormData();
        formData.append("file", fileToUpload);
        
        const imageUploadResponse = await uploadProfileImage(formData);
        const imgName = imageUploadResponse?.data?.file?.[0]?.filename;
      
        setImageUploading(false);
      


      const reqBody = ({...editFormData, img: imgName})
      
      
      // Update user profile
      const success = await editProfile(userId, reqBody);

      if (success) {
        setEditingUserId(null);
        fetchUsers(); 
      }
    } catch (error) {
      console.error("Error updating user:", error);
      ErrorToast("Failed to update user");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await DeleteAlert();
    if (isConfirmed) {
      try {
        setLoading(true);
        const success = await deleteProfile(id);

        if (success) {
          const updatedUsers = await getAllProfiles();
          setUsers(updatedUsers);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        ErrorToast("Failed to delete user");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto mt-8 lg-3">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all bg-white shadow-sm"
          placeholder="Search users by name, email or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-12">
            <FiUser className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-lg">No users found</p>
            <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
          </div>
        ) : (
          filteredUsers.map((user, index) => (
            <div key={user._id || index} className="bg-white rounded-lg p-6 shadow-md transition-transform duration-300 h-full flex flex-col items-center text-center">
              <div className="mb-4 relative group">
                {editingUserId === user._id ? (
                  <div className="relative">
                    
                    <img
                      type="file"
                      className="h-32 w-32 rounded-full object-cover border-4 border-primary/50 group-hover:border-primary transition-all duration-300"
                      src={fileToUpload ? URL.createObjectURL(fileToUpload) : editFormData.img ? baseURL + editFormData.img : "/images/avatar.png"}
                      alt="User"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/80?text=User";
                      }}
                    />
                    <label 
                      htmlFor={`image-upload-${user._id}`}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <div className="text-white flex flex-col items-center">
                        <FiUpload size={24} />
                        <span className="text-xs mt-1">Upload Photo</span>
                      </div>
                    </label>
                    <input 
                      id={`image-upload-${user._id}`}
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, user._id)}
                    />
                    {imageUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                  
                ) : (
                  <img
                    className="h-32 w-32 rounded-full object-cover border-4 border-gray-200 group-hover:border-primary transition-all duration-300"
                    src={user?.img ? baseURL + user.img : "https://via.placeholder.com/80?text=User"}
                    alt="User"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/80?text=User";
                    }}
                  />
                )}
                {!editingUserId && (
                  <div className="absolute bottom-0 right-0">
                    <button 
                      onClick={() => handleEdit(user)} 
                      className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full shadow-md transition-all transform hover:scale-110"
                    >
                      <FiEdit size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="w-full mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {user.firstName} {user.lastName}
                  </h3>
                <p className="text-sm text-gray-500 flex items-center justify-center">
                  <FiMail className="mr-1" />
                  {user.email?.length > 25 ? user.email.slice(0, 25) + '...' : user.email}
                </p>
              </div>
              
              <table className="w-full text-left table-auto min-w-max shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-50 text-center">
                    <th className="p-4 text-sm font-normal leading-none text-slate-500">
                      Item
                    </th>
                    <th className="p-4 text-sm font-normal leading-none text-slate-500">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 border-b border-slate-200 py-5">
                    First Name
                    </td>
                    <td className="p-4 border-b border-slate-200 py-5">
                      {editingUserId === user._id ? (
                        <input
                        type="text"
                        name="firstName"
                        value={editFormData.firstName}
                        onChange={handleEditInputChange}
                        className="w-full text-center"
                        placeholder="First Name"
                      />
                      ) : (
                        <span>{user.firstName || "Not provided"}</span>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 border-b border-slate-200 py-5">
                    Last Name
                    </td>
                    <td className="p-4 border-b border-slate-200 py-5">
                      {editingUserId === user._id ? (
                        <input
                        type="text"
                        name="lastName"
                        value={editFormData.lastName}
                        onChange={handleEditInputChange}
                        className="w-full text-center"
                        placeholder="Last Name"
                      />
                      ) : (
                        <span>{user.lastName || "Not provided"}</span>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 border-b border-slate-200 py-5">
                      Phone
                    </td>
                    <td className="p-4 border-b border-slate-200 py-5">
                      {editingUserId === user._id ? (
                        <input
                          type="text"
                          name="phone"
                          value={editFormData.phone}
                          onChange={handleEditInputChange}
                          className="w-full text-center"
                          placeholder="Phone Number"
                        />
                      ) : (
                        <span>{user.phone || "Not provided"}</span>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 border-b border-slate-200 py-5">Role</td>
                    <td className="p-4 border-b border-slate-200 py-5">
                      {editingUserId === user._id ? (
                        <select
                          name="role"
                          value={editFormData.role}
                          onChange={handleEditInputChange}
                          className="w-full text-center"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role || "user"}
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-between w-full mt-4">
                {editingUserId === user._id ? (
                  <>
                    <button
                      onClick={() => handleEditSubmit(user._id)}
                      disabled={processing}
                      className="px-4 py-2 text-white bg-green-500 hover:bg-green-600 flex items-center rounded-full transition-colors cursor-pointer shadow-sm"
                    >
                      {processing ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      ) : (
                        <FiSave className="mr-1" />
                      )}
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 text-white bg-gray-500 hover:bg-gray-600 flex items-center rounded-full transition-colors cursor-pointer shadow-sm"
                    >
                      <FiX className="mr-1" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-4 py-2 text-white bg-yellow-400 hover:bg-yellow-500 flex items-center rounded-full transition-colors cursor-pointer shadow-sm"
                    >
                      <FiEdit className="mr-1" />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-4 py-2 text-white bg-red-400 hover:bg-red-500 flex items-center rounded-full transition-colors cursor-pointer shadow-sm"
                    >
                      <FiTrash className="mr-1" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
