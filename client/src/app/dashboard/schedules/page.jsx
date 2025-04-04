"use client";
import { useState, useEffect } from "react";
import {
  FiSearch,
  FiEdit,
  FiTrash,
  FiCalendar,
  FiClock,
  FiUser,
  FiX,
  FiSave,
  FiPlus,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiCoffee,
  FiSun
} from "react-icons/fi";
import {
  getAllSchedules,
  updateSchedule,
  deleteSchedule,
  createSchedule,
  getAllDoctors
} from "../../apiRequest/dashboardApi";
import { DeleteAlert, ErrorToast } from "@/helper/helper";
import moment from "moment";
import { config } from "../../../config/config.js";

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterDoctor, setFilterDoctor] = useState("all");
  const [filterDay, setFilterDay] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const [editFormData, setEditFormData] = useState({
    doctorId: "",
    availableDays: [],
    startTime: "",
    endTime: ""
  });
  
  const [newScheduleData, setNewScheduleData] = useState({
    doctorId: "",
    availableDays: [],
    startTime: "",
    endTime: ""
  });

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
      console.error("Error fetching data:", error);
      ErrorToast("Failed to fetch data");
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
    return doctor && doctor.image ? `${config.uploadURL}${doctor.image}` : null;
  };

  // Filter schedules based on search term and filters
  const filteredSchedules = schedules.filter(schedule => {
    const doctorName = getDoctorName(schedule.doctorId);
    const matchesSearch = doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (schedule.startTime && schedule.startTime.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (schedule.endTime && schedule.endTime.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDoctor = filterDoctor === "all" || schedule.doctorId === filterDoctor;
    const matchesDay = filterDay === "all" || (schedule.availableDays && schedule.availableDays.includes(filterDay));
    
    return matchesSearch && matchesDoctor && matchesDay;
  });
  

  const handleEdit = (schedule) => {
    if (!schedule || !schedule._id) {
      ErrorToast("Cannot edit schedule: Invalid schedule data");
      return;
    }
    setEditingScheduleId(schedule._id);
    setEditFormData({
      doctorId: schedule.doctorId || "",
      availableDays: schedule.availableDays || [],
      startTime: schedule.startTime || "",
      endTime: schedule.endTime || ""
    });
  };

  const handleCancelEdit = () => {
    setEditingScheduleId(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditDayToggle = (day) => {
    setEditFormData(prev => {
      const days = [...prev.availableDays];
      if (days.includes(day)) {
        return { ...prev, availableDays: days.filter(d => d !== day) };
      } else {
        return { ...prev, availableDays: [...days, day] };
      }
    });
  };

  const handleNewScheduleInputChange = (e) => {
    const { name, value } = e.target;
    setNewScheduleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewScheduleDayToggle = (day) => {
    setNewScheduleData(prev => {
      const days = [...prev.availableDays];
      if (days.includes(day)) {
        return { ...prev, availableDays: days.filter(d => d !== day) };
      } else {
        return { ...prev, availableDays: [...days, day] };
      }
    });
  };

  const handleEditSubmit = async (scheduleId) => {
    if (!scheduleId) {
      ErrorToast("Schedule ID is missing");
      return;
    }

    if (!editFormData.doctorId) {
      ErrorToast("Please select a doctor");
      return;
    }

    if (editFormData.availableDays.length === 0) {
      ErrorToast("Please select at least one day");
      return;
    }

    if (!editFormData.startTime || !editFormData.endTime) {
      ErrorToast("Please provide start and end times");
      return;
    }

    try {
      setProcessing(true);
      const success = await updateSchedule(scheduleId, editFormData);

      if (success) {
        setEditingScheduleId(null);
        await fetchData();
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      ErrorToast("Failed to update schedule");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      ErrorToast("Cannot delete schedule: Invalid ID");
      return;
    }
    
    const isConfirmed = await DeleteAlert();
    if (isConfirmed) {
      try {
        setProcessing(true);
        const success = await deleteSchedule(id);

        if (success) {
          await fetchData();
        } else {
          ErrorToast("Failed to delete schedule");
        }
      } catch (error) {
        console.error("Error deleting schedule:", error);
        ErrorToast(error.message || "Failed to delete schedule");
      } finally {
        setProcessing(false);
      }
    }
  };

  const handleAddNewSchedule = async () => {
    if (!newScheduleData.doctorId) {
      ErrorToast("Please select a doctor");
      return;
    }

    if (newScheduleData.availableDays.length === 0) {
      ErrorToast("Please select at least one day");
      return;
    }

    if (!newScheduleData.startTime || !newScheduleData.endTime) {
      ErrorToast("Please provide start and end times");
      return;
    }

    try {
      setProcessing(true);
      const success = await createSchedule(newScheduleData);

      if (success) {
        setIsAddModalOpen(false);
        setNewScheduleData({
          doctorId: "",
          availableDays: [],
          startTime: "",
          endTime: ""
        });
        await fetchData();
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
      ErrorToast("Failed to create schedule");
    } finally {
      setProcessing(false);
    }
  };

  // Helper to format time from 24-hour to 12-hour format
  const formatTime = (time) => {
    if (!time) return "";
    return moment(time, "HH:mm").format("h:mm A");
  };

  // Colorize day badges
  const getDayColor = (day) => {
    const colors = {
      "Monday": "bg-blue-100 text-blue-800",
      "Tuesday": "bg-purple-100 text-purple-800",
      "Wednesday": "bg-green-100 text-green-800",
      "Thursday": "bg-yellow-100 text-yellow-800",
      "Friday": "bg-pink-100 text-pink-800",
      "Saturday": "bg-red-100 text-red-800",
      "Sunday": "bg-indigo-100 text-indigo-800"
    };
    return colors[day] || "bg-gray-100 text-gray-800";
  };


  return (
    <div className="container mx-auto mt-8 lg:mt-3">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Manage Doctor Schedules</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md cursor-pointer"
          >
            <FiFilter className="mr-2" />
            Filter
            {isFilterOpen ? <FiChevronUp className="ml-2" /> : <FiChevronDown className="ml-2" />}
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-full hover:bg-primary/80 transition-colors shadow-md cursor-pointer"
          >
            <FiPlus className="mr-2" />
            Add Schedule
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Doctor</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={filterDoctor}
                onChange={(e) => setFilterDoctor(e.target.value)}
              >
                <option value="all">All Doctors</option>
                {doctors.map((doctor, idx) => (
                  <option key={doctor._id || `dr-option-${idx}`} value={doctor._id}>
                    {doctor.name}{doctor.specialty ? `, ${doctor.specialty} Specialist` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Day</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
              >
                <option value="all">All Days</option>
                {daysOfWeek.map((day, idx) => (
                  <option key={`day-${day}-${idx}`} value={day}>{day}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all bg-white shadow-sm"
          placeholder="Search schedules by doctor name or time"
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
            <p className="text-sm text-gray-400">Try adjusting your search criteria or create a new schedule</p>
          </div>
        ) : (
          filteredSchedules.map((schedule, index) => (
            <div 
              key={schedule._id || `schedule-${index}`} 
              className="bg-white rounded-lg p-6 shadow-md transition-transform duration-300 h-full flex flex-col items-center text-center"
            >
              {editingScheduleId === schedule._id ? (
                // Edit mode
                <div className="w-full">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                    <select
                      name="doctorId"
                      value={editFormData.doctorId}
                      onChange={handleEditInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map((doctor, idx) => (
                        <option key={doctor._id || `edit-dr-option-${idx}`} value={doctor._id}>
                          {doctor.name}{doctor.specialty ? `, ${doctor.specialty} Specialist` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Days</label>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {daysOfWeek.map((day, idx) => (
                        <button
                          key={`edit-day-${day}-${idx}`}
                          type="button"
                          onClick={() => handleEditDayToggle(day)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            editFormData.availableDays.includes(day)
                              ? getDayColor(day)
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {day.substring(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                      <input
                        type="time"
                        name="startTime"
                        value={editFormData.startTime}
                        onChange={handleEditInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                      <input
                        type="time"
                        name="endTime"
                        value={editFormData.endTime}
                        onChange={handleEditInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between w-full mt-4">
                    <button
                      onClick={() => handleEditSubmit(schedule._id)}
                      disabled={processing}
                      className="px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-full transition-colors shadow-sm flex items-center"
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
                      className="px-4 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-full transition-colors shadow-sm flex items-center"
                    >
                      <FiX className="mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display mode
                <>
                  <div className="mb-4 relative group">
                    <div className="h-32 w-32 rounded-full flex items-center justify-center bg-primary/10 border-4 border-gray-200 group-hover:border-primary transition-all duration-300">
                      {getDoctorImage(schedule.doctorId) ? (
                        <img 
                          src={getDoctorImage(schedule.doctorId)} 
                          alt={getDoctorName(schedule.doctorId)} 
                          className="h-full w-full rounded-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/80?text=Dr";
                          }}
                        />
                      ) : (
                        <span className="text-primary text-3xl font-bold">
                          {getDoctorName(schedule.doctorId).split(' ').map(n => n && n[0]).join('')}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0">
                      <button 
                        onClick={() => handleEdit(schedule)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full shadow-md transition-all transform hover:scale-110"
                      >
                        <FiEdit size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="w-full mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{getDoctorName(schedule.doctorId)}</h3>
                    <p className="text-sm text-gray-500 flex items-center justify-center break-words whitespace-normal">{(schedule.specialty)}</p>
                    <p className="text-sm text-gray-500 flex items-center justify-center break-words whitespace-normal">{(schedule.phone)}</p>
                    <p className="text-sm text-gray-500 flex items-center justify-center break-words whitespace-normal">
                      <FiClock className="mr-1 flex-shrink-0" />
                      <span className="break-all">{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</span>
                    </p>
                  </div>
                  
                  <table className="w-full table-fixed border-collapse shadow-md rounded-lg overflow-hidden">
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
                          <div className="w-full overflow-hidden">
                            <p className="text-center break-words">Doctor</p>
                          </div>
                        </td>
                        <td className="p-4 border-b border-slate-200 py-5">
                          <div className="w-full overflow-hidden">
                            <p className="text-center break-words">{getDoctorName(schedule.doctorId)}</p>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-4 border-b border-slate-200 py-5">
                          <div className="w-full overflow-hidden">
                            <p className="text-center break-words">Time Slot</p>
                          </div>
                        </td>
                        <td className="p-4 border-b border-slate-200 py-5">
                          <div className="w-full overflow-hidden">
                            <p className="text-center break-words">{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</p>
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-4 border-b border-slate-200 py-5">
                          <div className="w-full overflow-hidden">
                            <p className="text-center break-words">Available Days</p>
                          </div>
                        </td>
                        <td className="p-4 border-b border-slate-200 py-5">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {schedule.availableDays && schedule.availableDays.map((day, idx) => (
                              <span
                                key={`card-day-${day}-${idx}`}
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getDayColor(day)}`}
                              >
                                {day.substring(0, 3)}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <div className="flex justify-between w-full mt-4">
                    <button
                      onClick={() => handleEdit(schedule)}
                      className="px-4 py-2 text-white bg-yellow-400 hover:bg-yellow-500 flex items-center rounded-full transition-colors shadow-sm"
                    >
                      <FiEdit className="mr-1" />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleDelete(schedule._id)}
                      className="px-4 py-2 text-white bg-red-400 hover:bg-red-500 flex items-center rounded-full transition-colors shadow-sm"
                    >
                      <FiTrash className="mr-1" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add New Schedule Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h2 className="text-xl font-bold text-gray-800">Add New Schedule</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor*</label>
                <select
                  name="doctorId"
                  value={newScheduleData.doctorId}
                  onChange={handleNewScheduleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doctor, idx) => (
                    <option key={doctor._id || `new-dr-${idx}`} value={doctor._id}>
                      {doctor.name}{doctor.specialty ? `, ${doctor.specialty} Specialist` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Days*</label>
                <div className="flex flex-wrap gap-2 justify-center">
                  {daysOfWeek.map((day, idx) => (
                    <button
                      key={`new-day-${day}-${idx}`}
                      type="button"
                      onClick={() => handleNewScheduleDayToggle(day)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        newScheduleData.availableDays.includes(day)
                          ? getDayColor(day)
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiClock className="text-gray-400" />
                    </div>
                    <input
                      type="time"
                      name="startTime"
                      value={newScheduleData.startTime}
                      onChange={handleNewScheduleInputChange}
                      className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiClock className="text-gray-400" />
                    </div>
                    <input
                      type="time"
                      name="endTime"
                      value={newScheduleData.endTime}
                      onChange={handleNewScheduleInputChange}
                      className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-8 pt-4 border-t">
              <button
                onClick={() => setIsAddModalOpen(false)}
                type="button"
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewSchedule}
                type="button"
                disabled={processing}
                className="px-4 py-2 text-white bg-primary hover:bg-primary/90 rounded-full transition-colors flex items-center"
              >
                {processing ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <FiPlus className="mr-1" />
                )}
                Add Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}