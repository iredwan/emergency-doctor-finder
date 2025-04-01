import axios from "axios";
import { ErrorToast, SuccessToast } from "../../helper/helper.js";
import { config } from "../../config/config.js";

let baseURL = config.baseURL;

class AuthApi {
  // Send OTP for email verification
  async sendOtp(email) {
    try {
      let result = await axios.post(`${baseURL}/sent-otp`,  {email} );
      if (result.data.status === true) {
        SuccessToast(result.data.message);
        return true;
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Failed to send OTP");
      return false;
    }
  }

  // Verify OTP
  async verifyOtp(email, otp) {
    try {
      let result = await axios.post(`${baseURL}/verify-otp`, { email, otp });
      if (result.data.status === true) {
        // Set token in browser cookie
        document.cookie = `token=${result.data.token}; path=/; max-age=${30 * 24 * 60 * 60}; secure; samesite=none`;
        SuccessToast(result.data.message);
        return true;
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "OTP verification failed");
      return false;
    }
  }

  // Register a new user
  async register(reqBody) {
    try {
      let result = await axios.post(`${baseURL}/profile-register`, reqBody);
      if (result.data.status === true) {
        // Delete cookies from browser
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=none";
        SuccessToast(result.data.message);
        return true;
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Registration failed1");
      return false;
    }
  }

  // Login user
  async login(reqBody) {
    try {
      let result = await axios.post(`${baseURL}/profile-login`, reqBody, { withCredentials: true });
      if (result.data.status === true) {
        SuccessToast(result.data.message);
        return result;
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Login failed");
      return false;
    }
  }

  // Logout user
  async logout() {
    try {
      let result = await axios.get(`${baseURL}/profile-logout`, {
        withCredentials: true,
      });
      if (result.data.status === true) {
        SuccessToast(result.data.message);
        return true;
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Logout failed");
      return false;
    }
  }

  // Upload profile image
  async uploadProfileImage(reqBody) {
    try {
      let result = await axios.post(`${baseURL}/file-upload`, reqBody, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (result.data.status === true) {
        return result; // Return the image URL
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Image upload failed");
      return false;
    }
  }

  // Get current user profile
  async getProfile(id) {
    try {
      let result = await axios.get(`${baseURL}/single-profile/${id}`, {
        withCredentials: true,
      });
      if (result.data.status === true) {
        return result.data;
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Failed to get profile");
      return false;
    }
  }

  // Update user profile
  async updateProfile(reqBody) {
    try {
      let result = await axios.post(`${baseURL}/update-profile`, reqBody, {
        withCredentials: true,
      });
      if (result.data.status === true) {
        SuccessToast(result.data.message);
        return true;
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Profile update failed");
      return false;
    }
  }

  // Reset password request (forgot password)
  async forgotPassword(email) {
    try {
      let result = await axios.post(`${baseURL}/forgot-password`, { email });
      if (result.data.status === true) {
        SuccessToast(result.data.message);
        return true;
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Failed to process request");
      return false;
    }
  }

  // Reset password with OTP
  async resetPassword(reqBody) {
    try {
      let result = await axios.post(`${baseURL}/reset-password`, reqBody);
      if (result.data.status === true) {
        SuccessToast(result.data.message);
        return true;
      } else {
        ErrorToast(result.data.message);
        return false;
      }
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Password reset failed");
      return false;
    }
  }
}

export const { 
  sendOtp, 
  verifyOtp, 
  register, 
  login, 
  logout, 
  uploadProfileImage, 
  getProfile, 
  updateProfile,
  forgotPassword,
  resetPassword
} = new AuthApi(); 