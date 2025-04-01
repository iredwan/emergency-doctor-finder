"use client";
import { useState, useEffect } from "react";
import {
  FiSearch,
  FiPhone,
  FiMail,
  FiCalendar,
  FiClock,
  FiFilter,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";
import { getAllSchedules, getAllDoctors } from "../apiRequest/dashboardApi";
import { ErrorToast } from "@/helper/helper";
import Link from "next/link";
import moment from "moment";
import { config } from "../../config/config.js";

export default function SchedulePage() {
  const baseURL = config.uploadURL;
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [schedulesData, doctorsData] = await Promise.all([
        getAllSchedules(),
        getAllDoctors()
      ]);
      
      if (schedulesData) {
        setSchedules(schedulesData);
      }
      
      if (doctorsData) {
        setDoctors(doctorsData);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      ErrorToast("Failed to fetch schedules");
    } finally {
      setLoading(false);
    }
  };

  // Helper to get doctor name from ID
  const getDoctorName = (doctorId) => {
    if (!doctorId) return "Unknown Doctor";
    const doctor = doctors.find(doc => doc._id === doctorId);
    return doctor ? doctor.name : "Unknown Doctor";
  };

  // Helper to get doctor image from ID
  const getDoctorImage = (doctorId) => {
    if (!doctorId) return null;
    const doctor = doctors.find(doc => doc._id === doctorId);
    return doctor && doctor.image ? baseURL + doctor.image : null;
  };

  // Helper to get doctor specialty from ID
  const getDoctorSpecialty = (doctorId) => {
    if (!doctorId) return "";
    const doctor = doctors.find(doc => doc._id === doctorId);
    return doctor ? doctor.specialty : "";
  };

  // Format time 
  const formatTime = (time) => {
    if (!time) return "";
    return moment(time, "HH:mm").format("h:mm A");
  };

  // Get day of week from date string
  const getDayOfWeek = (dateString) => {
    if (!dateString) return null;
    const date = moment(dateString);
    return date.format('dddd'); // Returns day name (Monday, Tuesday, etc.)
  };

  // Filter schedules based on search term and date
  const filteredSchedules = schedules.filter(schedule => {
    const doctorName = getDoctorName(schedule.doctorId);
    const doctorSpecialty = getDoctorSpecialty(schedule.doctorId);
    
    // Text search match
    const matchesSearch = 
      doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doctorSpecialty && doctorSpecialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (schedule.startTime && schedule.startTime.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (schedule.endTime && schedule.endTime.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (schedule.availableDays && schedule.availableDays.some(day => 
        day.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    
    // Date filter match
    let matchesDate = true;
    if (selectedDate) {
      const dayName = getDayOfWeek(selectedDate);
      matchesDate = schedule.availableDays && schedule.availableDays.includes(dayName);
    }
    
    // Day filter match
    let matchesDay = true;
    if (selectedDay !== "all") {
      matchesDay = schedule.availableDays && schedule.availableDays.includes(selectedDay);
    }
    
    return matchesSearch && matchesDate && matchesDay;
  });

  const getDayColor = (day) => {
    const colors = {
      "Monday": "bg-blue-100 text-blue-800",
      "Tuesday": "bg-purple-100 text-purple-800",
      "Wednesday": "bg-green-100 text-green-800",
      "Thursday": "bg-yellow-100 text-yellow-800",
      "Friday": "bg-pink-100 text-pink-800",
      "Saturday": "bg-purple-200 text-purple-800",
      "Sunday": "bg-indigo-100 text-indigo-800"
    };
    return colors[day] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Available Doctor Schedules</h1>
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/80 transition-colors shadow-md cursor-pointer"
        >
          <FiFilter className="mr-2" />
          Filters
          {isFilterOpen ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
        </button>
      </div>

      {isFilterOpen && (
        <div className="bg-white p-3 rounded-lg shadow-sm mb-4 transition-all duration-300">
          <div className="flex flex-wrap justify-center gap-3">
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400 text-sm" />
                </div>
                <input
                  type="date"
                  className="pl-8 pr-3 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {selectedDate && `Showing schedules for ${getDayOfWeek(selectedDate)}`}
              </p>
            </div>
            
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Day</label>
              <select
                className="w-full text-sm py-1 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                <option value="all">All Days</option>
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          </div>
          
          {(selectedDate || selectedDay !== "all") && (
            <div className="flex justify-center mt-2">
              <button
                onClick={() => {
                  setSelectedDate("");
                  setSelectedDay("all");
                }}
                className="text-primary text-xs hover:underline flex items-center cursor-pointer"
              >
                <FiFilter className="mr-1 text-xs" /> Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all bg-white shadow-sm"
          placeholder="Search schedules by doctor name, specialty or day"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-12">
            <FiCalendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-lg">No schedules found</p>
            <p className="text-sm text-gray-400">
              {selectedDate || selectedDay !== "all" 
                ? "Try adjusting your date filter or day selection" 
                : "Try adjusting your search criteria"}
            </p>
          </div>
        ) : (
          filteredSchedules.map((schedule, index) => (
            <div key={schedule._id || index} className="bg-primary rounded-lg p-6 shadow-md transition-transform duration-300 h-full flex flex-col items-center text-center text-white">
              <div className="mb-4 relative group">
                <img
                  className="h-32 w-32 rounded-full object-cover hover:border-primary transition-all duration-300"
                  src={getDoctorImage(schedule.doctorId) || "https://via.placeholder.com/128?text=Doctor"}
                  alt="Doctor"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/128?text=Doctor";
                  }}
                />
              </div>
              
              <div className=" mb-4">
                <h3 className="text-xl font-bold mb-1">
                  {getDoctorName(schedule.doctorId)}
                </h3>
                <p className="px-2 py-1 rounded-full text-sm font-bold bg-teal-100 text-teal-800 ">
                   {schedule.specialty} 
                </p>
              </div>
              
              <table className="w-full text-left table-auto min-w-max shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-50 text-center">
                    <th className="p-4 text-sm font-normal leading-none text-slate-500" colSpan="2">
                      Schedule Details
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                <tr className="transition-all duration-300 transform hover:scale-105">
                    <td className="p-4 border-b border-slate-200 py-5">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {schedule.availableDays && schedule.availableDays.map((day, idx) => (
                          <span
                            key={`day-${day}-${idx}`}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getDayColor(day)} ${selectedDay === day ? 'ring-2 ring-teal-500' : ''}`}
                          >
                            {day}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                  

                  <tr className="transition-all duration-300 transform hover:scale-105">
                    <td className="flex items-center justify-center p-4 border-b border-slate-200 py-5">
                      <FiClock className="mr-2" />
                      <span>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</span>
                    </td>
                  </tr>
                    
                  <tr className="transition-all duration-300 transform hover:scale-105">
                    <td className="flex items-center justify-center p-4 border-b border-slate-200 py-5">
                        <FiPhone className="mr-2" />
                      <span>
                        {schedule.phone}</span>
                    </td>
                  </tr>

                  <tr className="transition-all duration-300 transform hover:scale-105">
                    <td className="flex items-center justify-center p-4 py-5">
                      <FiMail className="mr-2" />
                      <span>{(schedule.email) }</span>
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