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
  FiUpload,
  FiFilePlus,
  FiHeart,
  FiCalendar
} from "react-icons/fi";
import {
  getAllDoctors,
  editDoctor,
  deleteDoctor,
  createDoctor
} from "../../apiRequest/dashboardApi";
import { DeleteAlert, ErrorToast, SuccessToast } from "@/helper/helper";
import Link from "next/link";
import { uploadProfileImage } from "@/app/apiRequest/authApi";
import { config } from "../../../config/config.js";

export default function DoctorsPage() {
  const baseURL = config.uploadURL;
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    education: "",
    experience: "",
    image: ""
  });
  const [fileToUpload, setFileToUpload] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDoctorData, setNewDoctorData] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    education: "",
    experience: "",
    image: ""
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await getAllDoctors();
      if (data) {
        setDoctors(data);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      ErrorToast("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.phone?.includes(searchTerm) ||
      doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (doctor) => {
    setEditingDoctorId(doctor._id);
    setEditFormData({
      name: doctor.name || "",
      email: doctor.email || "",
      phone: doctor.phone || "",
      specialty: doctor.specialty || "",
      education: doctor.education || "",
      experience: doctor.experience || "",
      image: doctor.image || ""
    });
  };

  const handleCancelEdit = () => {
    setEditingDoctorId(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewDoctorInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctorData((prev) => ({
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

  const handleEditSubmit = async (doctorId) => {
    if (!doctorId) {
      ErrorToast("Doctor ID is missing");
      return;
    }

    try {
      setProcessing(true);
      
      let imageName = editFormData.image;
      
      // Upload image if there's a file to upload
      if (fileToUpload) {
        setImageUploading(true);
        
        // Create FormData for image upload
        const formData = new FormData();
        formData.append("file", fileToUpload);
        
        const imageUploadResponse = await uploadProfileImage(formData);
        if (imageUploadResponse && imageUploadResponse.data && imageUploadResponse.data.file && imageUploadResponse.data.file.length > 0) {
          imageName = imageUploadResponse.data.file[0].filename;
        }
        
        setImageUploading(false);
      }

      const reqBody = {
        ...editFormData,
        image: imageName
      };
      
      // Update doctor profile
      const success = await editDoctor(doctorId, reqBody);

      if (success) {
        setEditingDoctorId(null);
        // Refresh doctors data
        fetchDoctors();
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
      ErrorToast("Failed to update doctor");
    } finally {
      setProcessing(false);
      setFileToUpload(null);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await DeleteAlert();
    if (isConfirmed) {
      try {
        setLoading(true);
        const success = await deleteDoctor(id);

        if (success) {
          fetchDoctors();
        }
      } catch (error) {
        console.error("Error deleting doctor:", error);
        ErrorToast("Failed to delete doctor");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddNewDoctor = async () => {
    if (!newDoctorData.name || !newDoctorData.email || !newDoctorData.specialty || !newDoctorData.education || !newDoctorData.experience) {
      ErrorToast("Name, email, specialty, education and experience are required");
      return;
    }

    try {
      setProcessing(true);
      
      let imageName = "";
      
      // Upload image if there's a file to upload
      if (fileToUpload) {
        setImageUploading(true);
        
        // Create FormData for image upload
        const formData = new FormData();
        formData.append("file", fileToUpload);
        
        const imageUploadResponse = await uploadProfileImage(formData);
        if (imageUploadResponse && imageUploadResponse.data && imageUploadResponse.data.file && imageUploadResponse.data.file.length > 0) {
          imageName = imageUploadResponse.data.file[0].filename;
        }
        
        setImageUploading(false);
      } else {
        ErrorToast("Image is required");
        setProcessing(false);
        return;
      }

      const reqBody = {
        ...newDoctorData,
        image: imageName
      };
      
      // Create doctor
      const success = await createDoctor(reqBody);

      if (success) {
        setIsAddModalOpen(false);
        setNewDoctorData({
          name: "",
          email: "",
          phone: "",
          specialty: "",
          education: "",
          experience: "",
          image: ""
        });
        // Refresh doctors data
        fetchDoctors();
      }
    } catch (error) {
      console.error("Error creating doctor:", error);
      ErrorToast("Failed to create doctor");
    } finally {
      setProcessing(false);
      setFileToUpload(null);
    }
  };

  return (
    <div className="container mx-auto mt-8 lg:mt-3">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 sm:gap-0">
        <h1 className="text-2xl font-bold text-gray-800">Manage Doctors</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/80 transition-colors shadow-md cursor-pointer w-full sm:w-auto justify-center"
        >
          <FiFilePlus className="mr-2" />
          Add New Doctor
        </button>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all bg-white shadow-sm"
          placeholder="Search doctors by name, email, phone or specialty"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-12">
            <FiUser className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-lg">No doctors found</p>
            <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
          </div>
        ) : (
            filteredDoctors.map((doctor, index) => (
            <div key={doctor._id || index} className="bg-white rounded-lg p-6 shadow-md transition-transform duration-300 h-full flex flex-col items-center text-center">
              <div className="mb-4 relative group">
                {editingDoctorId === doctor._id ? (
                  <div className="relative">
                    <img
                      className="h-32 w-32 rounded-full object-cover border-4 border-primary/50 group-hover:border-primary transition-all duration-300"
                      src={fileToUpload ? URL.createObjectURL(fileToUpload) : doctor.image ? baseURL + doctor.image : "/images/avatar.png"}
                      alt="Doctor"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/80?text=Doctor";
                      }}
                    />
                    <label 
                      htmlFor={`image-upload-${doctor._id}`}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <div className="text-white flex flex-col items-center">
                        <FiUpload size={24} />
                        <span className="text-xs mt-1">Upload Photo</span>
                      </div>
                    </label>
                    <input 
                      id={`image-upload-${doctor._id}`}
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
                    src={doctor?.image ? baseURL + doctor.image : "https://via.placeholder.com/80?text=Doctor"}
                    alt="Doctor"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/80?text=Doctor";
                    }}
                  />
                )}
                {!editingDoctorId && (
                  <div className="absolute bottom-0 right-0">
                    <button 
                      onClick={() => handleEdit(doctor)} 
                      className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full shadow-md transition-all transform hover:scale-110"
                    >
                      <FiEdit size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="w-full mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {doctor.name}
                  </h3>
                <p className="text-sm text-gray-500 flex items-center justify-center break-words whitespace-normal">
                  <FiMail className="mr-1 flex-shrink-0" />
                  <span className="break-all">{doctor.email}</span>
                </p>
              </div>
              
              <table className="w-full table-fixed border-collapse shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-50 text-center">
                    <th width="30%" className="p-4 text-sm font-normal leading-none text-slate-500">
                      Item
                    </th>
                    <th width="70%" className="p-4 text-sm font-normal leading-none text-slate-500">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 border-b border-slate-200 py-5">
                      <div className="w-full overflow-hidden">
                        <p className="text-center break-words">Name</p>
                      </div>
                    </td>
                    <td className="p-4 border-b border-slate-200 py-5">
                      {editingDoctorId === doctor._id ? (
                        <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditInputChange}
                        className="w-full text-center"
                        placeholder="Name"
                      />
                      ) : (
                        <div className="w-full overflow-hidden">
                          <p className="text-center break-words">{doctor.name || "Not provided"}</p>
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 border-b border-slate-200 py-5">
                      <div className="w-full overflow-hidden">
                        <p className="text-center break-words">Education</p>
                      </div>
                    </td>
                    <td className="p-4 border-b border-slate-200 py-5">
                      {editingDoctorId === doctor._id ? (
                        <input
                        type="text"
                        name="education"
                        value={editFormData.education}
                        onChange={handleEditInputChange}
                        className="w-full text-center"
                        placeholder="Education"
                      />
                      ) : (
                        <div className="w-full overflow-hidden">
                          <p className="text-center break-words">{doctor.education || "Not provided"}</p>
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 border-b border-slate-200 py-5">
                      <div className="w-full overflow-hidden">
                        <p className="text-center break-words">Specialty</p>
                      </div>
                    </td>
                    <td className="p-4 border-b border-slate-200 py-5">
                      {editingDoctorId === doctor._id ? (
                        <input
                          type="text"
                          name="specialty"
                          value={editFormData.specialty}
                          onChange={handleEditInputChange}
                          className="w-full text-center"
                          placeholder="Specialty"
                        />
                      ) : (
                        <div className="w-full overflow-hidden">
                          <p className="text-center break-words">{doctor.specialty || "Not provided"}</p>
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 border-b border-slate-200 py-5">
                      <div className="w-full overflow-hidden">
                        <p className="text-center break-words">Experience</p>
                      </div>
                    </td>
                    <td className="p-4 border-b border-slate-200 py-5">
                      {editingDoctorId === doctor._id ? (
                        <input
                          type="text"
                          name="experience"
                          value={editFormData.experience}
                          onChange={handleEditInputChange}
                          className="w-full text-center"
                          placeholder="Experience"
                        />
                      ) : (
                        <div className="w-full overflow-hidden">
                          <p className="text-center break-words">{doctor.experience || "Not provided"}</p>
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 border-b border-slate-200 py-5">
                      <div className="w-full overflow-hidden">
                        <p className="text-center break-words">Email</p>
                      </div>
                    </td>
                    <td className="p-4 border-b border-slate-200 py-5">
                      {editingDoctorId === doctor._id ? (
                        <input
                          type="text"
                          name="email"
                          value={editFormData.email}
                          onChange={handleEditInputChange}
                          className="w-full text-center"
                          placeholder="Email"
                        />
                      ) : (
                        <div className="w-full overflow-hidden">
                          <p className="text-center break-words">{doctor.email || "Not provided"}</p>
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-4 border-b border-slate-200 py-5">
                      <div className="w-full overflow-hidden">
                        <p className="text-center break-words">Phone</p>
                      </div>
                    </td>
                    <td className="p-4 border-b border-slate-200 py-5">
                      {editingDoctorId === doctor._id ? (
                        <input
                          type="text"
                          name="phone"
                          value={editFormData.phone}
                          onChange={handleEditInputChange}
                          className="w-full text-center"
                          placeholder="Phone"
                        />
                      ) : (
                        <div className="w-full overflow-hidden">
                          <p className="text-center break-words">{doctor.phone || "Not provided"}</p>
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-between w-full mt-4">
                {editingDoctorId === doctor._id ? (
                  <>
                    <button
                      onClick={() => handleEditSubmit(doctor._id)}
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
                      onClick={() => handleEdit(doctor)}
                      className="px-4 py-2 text-white bg-yellow-400 hover:bg-yellow-500 flex items-center rounded-full transition-colors cursor-pointer shadow-sm"
                    >
                      <FiEdit className="mr-1" />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDelete(doctor._id)}
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

      {/* Add New Doctor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Add New Doctor</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="mb-6 flex flex-col items-center">
              <div className="relative mb-4">
                <img
                  className="h-32 w-32 rounded-full object-cover border-4 border-primary"
                  src={fileToUpload ? URL.createObjectURL(fileToUpload) : "/images/avatar.png"}
                  alt="Doctor"
                />
                <label 
                  htmlFor="new-doctor-image"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                >
                  <div className="text-white flex flex-col items-center">
                    <FiUpload size={24} />
                    <span className="text-xs mt-1">Upload Photo</span>
                  </div>
                </label>
                <input 
                  id="new-doctor-image"
                  type="file" 
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
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
            Name
            </td>
            <td className="p-4 border-b border-slate-200 py-5">
                <input
                type="text"
                name="name"
                value={newDoctorData.name}
                onChange={handleNewDoctorInputChange}
                className="w-full text-center"
                placeholder="Name"
              />
            </td>
          </tr>
          <tr className="hover:bg-slate-50">
            <td className="p-4 border-b border-slate-200 py-5">
            Education
            </td>
            <td className="p-4 border-b border-slate-200 py-5">
                <input
                type="text"
                name="education"
                value={newDoctorData.education}
                onChange={handleNewDoctorInputChange}
                className="w-full text-center"
                placeholder="Education"
              />
            </td>
          </tr>
          <tr className="hover:bg-slate-50">
            <td className="p-4 border-b border-slate-200 py-5">
            Experience
            </td>
            <td className="p-4 border-b border-slate-200 py-5">
                <input
                  type="text"
                  name="experience"
                  value={newDoctorData.experience}
                  onChange={handleNewDoctorInputChange}
                  className="w-full text-center"
                  placeholder="Experience"
                />
            </td>
          </tr>
          <tr className="hover:bg-slate-50">
            <td className="p-4 border-b border-slate-200 py-5">
            Email
            </td>
            <td className="p-4 border-b border-slate-200 py-5">
                <input
                  type="text"
                  name="email"
                  value={newDoctorData.email}
                  onChange={handleNewDoctorInputChange}
                  className="w-full text-center"
                  placeholder="Email"
                />
            </td>
          </tr>
          <tr className="hover:bg-slate-50">
            <td className="p-4 border-b border-slate-200 py-5">
            Phone
            </td>
            <td className="p-4 border-b border-slate-200 py-5">
                <input
                  type="text"
                  name="phone"
                  value={newDoctorData.phone}
                  onChange={handleNewDoctorInputChange}
                  className="w-full text-center"
                  placeholder="Phone"
                />
            </td>
          </tr>
          <tr className="hover:bg-slate-50">
            <td className="p-4 border-b border-slate-200 py-5">
            Specialty
            </td>
            <td className="p-4 border-b border-slate-200 py-5">
                <input
                  type="text"
                  name="specialty"
                  value={newDoctorData.specialty}
                  onChange={handleNewDoctorInputChange}
                  className="w-full text-center"
                  placeholder="Specialty"
                />
            </td>
          </tr>
        </tbody>
      </table>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewDoctor}
                disabled={processing}
                className="px-4 py-2 text-white bg-primary hover:bg-primary/80 rounded-md transition-colors flex items-center"
              >
                {processing ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <FiFilePlus className="mr-1" />
                )}
                Add Doctor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}