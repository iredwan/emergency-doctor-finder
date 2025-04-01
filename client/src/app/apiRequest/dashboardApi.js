import axios from "axios";
import { ErrorToast, SuccessToast } from "../../helper/helper.js";
import { config } from "../../config/config.js";

let baseURL = config.baseURL;

class DashboardApi {
  // Get all profiles
  async getAllProfiles() {
    try {
      let result = await axios.get(`${baseURL}/all-profiles`, {
        withCredentials: true,
      });
      if (result.data.status === true) {
        return result.data.data;
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Failed to fetch profiles");
      return false;
    }
  }

  // Edit profile
  async editProfile(id, data) {
    try {
      let result = await axios.put(`${baseURL}/update-profile/${id}`, data, {
        withCredentials: true,
      });
      if (result.data.status === true) {
        SuccessToast(result.data.message || "Profile updated successfully");
        return true;
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Failed to edit profile");
      return false;
    }
  }

  // Delete profile
  async deleteProfile(id) {
    try {
      let result = await axios.delete(`${baseURL}/delete-profile/${id}`, {
        withCredentials: true,
      }); 
      if (result.data.status === true) {
        SuccessToast(result.data.message || "Profile deleted successfully");
        return true;
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Failed to delete profile");
      return false;
    }
  }

  // Get all doctors
  async getAllDoctors() {
    try {
      let result = await axios.get(`${baseURL}/all-doctors`, {
        withCredentials: true,
      });
      if (result.data.status === true) {
        return result.data.data;
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Failed to fetch doctors");
      return false;
    }
  }

  // Get doctor by ID
  async getDoctorById(id) {
    try {
      let result = await axios.get(`${baseURL}/doctor/${id}`, {
        withCredentials: true,
      });
      if (result.data.status === true) {
        return result.data.data;
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Failed to fetch doctor");
      return false;
    }
  }

  // Create doctor
  async createDoctor(data) {
    try {
      let result = await axios.post(`${baseURL}/create-doctor`, data, {
        withCredentials: true,
      });
      if (result.data.status === true) {
        SuccessToast(result.data.message || "Doctor created successfully");
        return true;
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Failed to create doctor");
      return false;
    }
  }

  // Edit doctor
  async editDoctor(id, data) {
    try {
      let result = await axios.put(`${baseURL}/update-doctor/${id}`, data, {
        withCredentials: true,
      });
      if (result.data.status === true) {
        SuccessToast(result.data.message || "Doctor updated successfully");
        return true;
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Failed to edit doctor");
      return false;
    }
  }

  // Delete doctor
  async deleteDoctor(id) {
    try {
      let result = await axios.delete(`${baseURL}/delete-doctor/${id}`, {
        withCredentials: true,
      }); 
      if (result.data.status === true) {
        SuccessToast(result.data.message || "Doctor deleted successfully");
        return true;
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Failed to delete doctor");
      return false;
    }
  }

  // Get all schedules
  async getAllSchedules() {
    try {
      let result = await axios.get(`${baseURL}/schedule-list`, {
        withCredentials: true,
      });
      if (result.data.status === true) {
        return result.data.data;
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Failed to fetch schedules");
      return false;
    }
  }

  // Get schedule by date
  async getScheduleByDate(date) {
    try {
      let result = await axios.get(`${baseURL}/get-schedule-by-date?date=${date}`, {
        withCredentials: true,
      });
      if (result.data.status === true) {
        return result.data.data;
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Failed to fetch schedule for date");
      return false;
    }
  }

  // Create schedule
  async createSchedule(data) {
    try {
      let result = await axios.post(`${baseURL}/schedule-create`, data, {
        withCredentials: true,
      });
      if (result.data.status === true) {
        SuccessToast(result.data.message || "Schedule created successfully");
        return true;
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Failed to create schedule");
      return false;
    }
  }

  // Update schedule
  async updateSchedule(id, data) {
    try {
      let result = await axios.put(`${baseURL}/schedule-update/${id}`, data, {
        withCredentials: true,
      });
      if (result.data.status === true) {
        SuccessToast(result.data.message || "Schedule updated successfully");
        return true;
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Failed to update schedule");
      return false;
    }
  }

  // Delete schedule
  async deleteSchedule(id) {
    try {
      let result = await axios.delete(`${baseURL}/schedule-delete/${id}`, {
        withCredentials: true,
      }); 
      if (result.data.status === true) {
        SuccessToast(result.data.message || "Schedule deleted successfully");
        return true;
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Failed to delete schedule");
      return false;
    }
  }
}

export const{
  getDashboardStats,
  getAllProfiles,
  editProfile,
  deleteProfile,
  getAllDoctors,
  getDoctorById,
  createDoctor,
  editDoctor,
  deleteDoctor,
  getAllSchedules,
  getScheduleByDate,
  createSchedule,
  updateSchedule,
  deleteSchedule
} = new DashboardApi();