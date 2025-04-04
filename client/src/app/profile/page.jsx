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
  editProfile
} from "../../app/apiRequest/dashboardApi";
import {  ErrorToast, SuccessToast } from "@/helper/helper";
import Link from "next/link";
import { getProfile, uploadProfileImage } from "../apiRequest/authApi";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { config } from "../../config/config.js";

const ProfilePage = () => {
  const baseURL = config.uploadURL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    img: ""
  });
  const [fileToUpload, setFileToUpload] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // Get user ID from JWT token
      const token = Cookies.get("token");
      if (!token) {
        ErrorToast("You need to login first");
        // Redirect to login page if needed
        window.location.href = "/login";
        return;
      }

      const decoded = jwtDecode(token);
      if (!decoded?.user_id) {
        ErrorToast("Invalid token");
        return;
      }

      const data = await getProfile(decoded.user_id);
      if (data) {
        setUser(data.data);
        
        // Initialize edit form data with user data
        setEditFormData({
          firstName: data.data.firstName || "",
          lastName: data.data.lastName || "",
          phone: data.data.phone || "",
          role: data.data.role || "user",
          img: data.data.img || ""
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      ErrorToast("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Initialize form data with current user data
    if (user) {
      setEditFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        role: user.role || "user",
        img: user.img || ""
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to current user data
    if (user) {
      setEditFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        role: user.role || "user",
        img: user.img || ""
      });
    }
    setFileToUpload(null);
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
    if (file.size > 2 * 1024 * 1024) {
      ErrorToast("Image size should be less than 2MB");
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

  const handleEditSubmit = async () => {
    if (!user?._id) {
      ErrorToast("User ID is missing");
      return;
    }

    try {
      setProcessing(true);
      
      let imgName = editFormData.img;
      
      // Upload image if there's a file to upload
      if (fileToUpload) {
        setImageUploading(true);
        
        // Create FormData for image upload
        const formData = new FormData();
        formData.append("file", fileToUpload);
        
        const imageUploadResponse = await uploadProfileImage(formData);
        if (imageUploadResponse && imageUploadResponse.data && imageUploadResponse.data.file && imageUploadResponse.data.file.length > 0) {
          imgName = imageUploadResponse.data.file[0].filename;
        }
        
        setImageUploading(false);
      }

      const reqBody = {
        ...editFormData,
        img: imgName
      };
      
      // Update user profile
      const success = await editProfile(user._id, reqBody);

      if (success) {
        setIsEditing(false);
        // Refresh user profile data
        fetchUserProfile();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      ErrorToast("Failed to update profile");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto text-center py-12">
        <FiUser className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
        <p className="text-gray-500">Please login to view your profile</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : (
            <div className="col-span-full">
              <div className="bg-white rounded-lg p-6 shadow-md transition-transform duration-300 h-full flex flex-col items-center text-center">
                <div className="mb-4 relative group">
                  {isEditing ? (
                    <div className="relative">
                      <img
                        className="h-32 w-32 rounded-full object-cover border-4 border-primary/50 group-hover:border-primary transition-all duration-300"
                        src={fileToUpload ? URL.createObjectURL(fileToUpload) : user.img ? baseURL + user.img : "https://via.placeholder.com/80?text=User"}
                        alt="User"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/80?text=User";
                        }}
                      />
                      <label 
                        htmlFor="image-upload"
                        className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <div className="text-white flex flex-col items-center">
                          <FiUpload size={24} />
                          <span className="text-xs mt-1">Upload Photo</span>
                        </div>
                      </label>
                      <input 
                        id="image-upload"
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
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
                  {!isEditing && (
                    <div className="absolute bottom-0 right-0">
                      <button 
                        onClick={handleEdit} 
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
                        {isEditing ? (
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
                        {isEditing ? (
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
                        {isEditing ? (
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
                        
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role || "user"}
                          </span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-center w-full mt-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleEditSubmit}
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
                        className="px-4 py-2 text-white bg-gray-500 hover:bg-gray-600 flex items-center rounded-full transition-colors cursor-pointer shadow-sm ml-2"
                      >
                        <FiX className="mr-1" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEdit}
                      className="px-4 py-2 text-white bg-yellow-400 hover:bg-yellow-500 flex items-center rounded-full transition-colors cursor-pointer shadow-sm"
                    >
                      <FiEdit className="mr-1" />
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
