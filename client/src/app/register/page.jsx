"use client";
import { useState } from "react";
import Link from "next/link";
import { FiMail, FiUser, FiPhone, FiLock, FiEye, FiEyeOff, FiUpload, FiCheckCircle } from "react-icons/fi";
import { sendOtp, verifyOtp, register, uploadProfileImage } from "../apiRequest/authApi";
import { validateEmail, validatePassword, validatePhone, ErrorToast } from "../../helper/helper";

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        ErrorToast("Image size should be less than 2MB");
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        ErrorToast("Please upload a valid image file");
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      ErrorToast("Please enter a valid email address");
      return;
    }

    setLoading(true);
    const success = await sendOtp(email);
    setLoading(false);
    
    if (success) {
      setOtpSent(true);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      ErrorToast("Please enter the verification code");
      return;
    }
    
    setLoading(true);
    const success = await verifyOtp(email, otp);
    setLoading(false);
    
    if (success) {
      setStep(2);
    }
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      ErrorToast("First name is required");
      return false;
    }
    
    if (!formData.lastName.trim()) {
      ErrorToast("Last name is required");
      return false;
    }
    
    if (!validatePhone(formData.phone)) {
      ErrorToast("Please enter a valid phone number");
      return false;
    }
    
    if (!validatePassword(formData.password)) {
      ErrorToast("Password must be at least 6 characters long");
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      ErrorToast("Passwords do not match");
      return false;
    }
    
    if (!imageFile) {
      ErrorToast("Please upload your profile image");
      return false;
    }
    
    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // First upload the image
    const formDataImage = new FormData();
    formDataImage.append("file", imageFile);
    const imageUrl = await uploadProfileImage(formDataImage);
    const imgName = imageUrl?.data?.file?.[0]?.filename
    
    if (!imageUrl) {
      setLoading(false);
      return; // Image upload failed, message already shown by the API
    }

    const reqBody = {
      email: email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      password: formData.password,
      img: imgName
    }
    // Then register the user
    const success = await register(reqBody);
    
    setLoading(false);
    
    if (success) {
      // Redirect to login page
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000); // Redirect after 2 seconds to allow user to see success message
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">
          {step === 1 ? "Create Your Account" : "Complete Your Profile"}
        </h1>
        <p className="text-center text-gray-600 max-w-sm mx-auto mb-8">
          {step === 1
            ? "Please enter your email to receive a verification code"
            : "Please provide your personal information to complete registration"}
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md rounded-xl sm:px-10">
          {step === 1 ? (
            <div>
              <form className="space-y-6" onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={handleEmailChange}
                      disabled={otpSent || loading}
                      className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors disabled:bg-gray-100 disabled:text-gray-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* OTP Input (Shown after OTP is sent) */}
                {otpSent && (
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Code (OTP). It's will be expired in 2 minutes.
                    </label>
                    <div className="relative">
                      <input
                        id="otp"
                        name="otp"
                        type="text"
                        required
                        value={otp}
                        onChange={handleOtpChange}
                        disabled={loading}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        placeholder="Enter 6-digit code"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      We've sent a verification code to your email.
                    </p>
                    <div className="mt-4 text-right">
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="text-primary cursor-pointer hover:text-primary/80 text-sm font-medium transition-colors disabled:text-gray-400"
                      >
                        Resend Code
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary cursor-pointer hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:bg-primary/70"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {otpSent ? "Verifying..." : "Sending..."}
                      </span>
                    ) : (
                      otpSent ? "Verify Code" : "Send Verification Code"
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <form className="space-y-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-primary">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile Preview" className="h-full w-full object-cover" />
                    ) : (
                      <FiUser className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                </div>
                <label className="cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <span className="flex items-center">
                    <FiUpload className="mr-2" />
                    Upload Photo
                  </span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    disabled={loading}
                  />
                </label>
                <p className="mt-2 text-xs text-gray-500">Max file size: 2MB</p>
              </div>

              {/* Name Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Enter phone number"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Format: 10-15 digits</p>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="appearance-none block w-full pl-10 pr-10 px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="appearance-none block w-full pl-10 pr-10 px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                </div>
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">Passwords do not match</p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary cursor-pointer hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:bg-primary/70"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Completing Registration...
                    </span>
                  ) : (
                    "Complete Registration"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Login Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account?</span>{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
