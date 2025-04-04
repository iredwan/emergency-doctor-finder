"use client";
import { useState, useEffect } from "react";
import {
  FiSearch,
  FiUser,
  FiPhone,
  FiMail,
  FiCalendar,
  FiHeart
} from "react-icons/fi";
import { getAllDoctors } from "../apiRequest/dashboardApi";
import { ErrorToast } from "@/helper/helper";
import Link from "next/link";
import { config } from "../../config/config.js";

export default function DoctorsPage() {
  const baseURL = config.uploadURL;
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
      doctor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.phone?.includes(searchTerm) ||
      doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10 px-3">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Our Doctors</h1>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all bg-white shadow-sm"
          placeholder="Search doctors by name, specialty or location"
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
            <div key={doctor._id || index} className="bg-primary rounded-lg p-6 shadow-md transition-transform duration-300 h-full flex flex-col items-center text-center text-white">
              <div className="mb-4 relative group">
                  <img
                  className="h-32 w-32 rounded-full object-cover hover:border-primary transition-all duration-300"
                    src={baseURL + doctor.image}
                    alt="Doctor"
                  />
              </div>
              
              <div className="w-full mb-4">
                  <h3 className="text-xl font-bold mb-1">
                    {doctor.name}
                  </h3>
                <p className="text-sm flex items-center justify-center break-words whitespace-normal">
                  <FiMail className="mr-1 flex-shrink-0" /> 
                  <span className="break-all">{doctor.email}</span>
                </p>
              </div>
              
              <table className="w-full table-fixed border-collapse shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-50 text-center">
                    <th className="p-4 text-sm font-normal leading-none text-slate-500" colSpan="2">
                      Doctor Details
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  <tr className="transition-all duration-300 transform hover:scale-105">
                    <td width="30%" className="p-4 border-b border-slate-200 py-5">Education</td>
                    <td width="70%" className="p-4 border-b border-slate-200 py-5">
                      <div className="w-full overflow-hidden">
                        <p className="text-center break-words">{doctor.education || "Not provided"}</p>
                      </div>
                    </td>
                  </tr>
                  <tr className="transition-all duration-300 transform hover:scale-105">
                    <td width="30%" className="p-4 border-b border-slate-200 py-5">Experience</td>
                    <td width="70%" className="p-4 border-b border-slate-200 py-5">
                      <div className="w-full overflow-hidden">
                        <p className="text-center break-words">{doctor.experience || "Not provided"}</p>
                      </div>
                    </td>
                  </tr>
                  <tr className="transition-all duration-300 transform hover:scale-105">
                    <td width="30%" className="p-4 border-b border-slate-200 py-5">Specialty</td>
                    <td width="70%" className="p-4 border-b border-slate-200 py-5">
                      <div className="w-full overflow-hidden">
                        <p className="text-center break-words">{doctor.specialty || "Not provided"}</p>
                      </div>
                    </td>
                  </tr>
                  <tr className="transition-all duration-300 transform hover:scale-105">
                    <td width="30%" className="p-4 border-slate-200 py-5">Phone</td>
                    <td width="70%" className="p-4 border-slate-200 py-5">
                      <div className="w-full overflow-hidden">
                        <p className="text-center break-words">{doctor.phone || "Not provided"}</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <button 
                className="mt-6 bg-transparent hover:bg-secondary text-white font-medium py-2 px-2 rounded-full border-2 border-white transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-[#13C5DD] flex items-center justify-center cursor-pointer"
              >
                <FiCalendar className="mr-2" />
                Book Appointment
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}