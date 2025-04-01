"use client";
import { useState } from "react";
import Link from "next/link";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import { sendOtp, verifyOtp, resetPassword } from "../apiRequest/authApi";
import { validateEmail, validatePassword, ErrorToast } from "../../helper/helper";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const validatePasswordForm = () => {
    if (!validatePassword(passwords.password)) {
      ErrorToast("Password must be at least 6 characters long");
      return false;
    }
    
    if (passwords.password !== passwords.confirmPassword) {
      ErrorToast("Passwords do not match");
      return false;
    }
    
    return true;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setLoading(true);
    const success = await resetPassword({
      email,
      otp,
      password: passwords.password
    });
    setLoading(false);
    
    if (success) {
      // Redirect to login page
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">
          {step === 1 ? "Reset Your Password" : "Create New Password"}
        </h1>
        <p className="text-center text-gray-600 max-w-sm mx-auto mb-8">
          {step === 1
            ? "Enter your email to receive a verification code"
            : "Create a new password for your account"}
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
                      Verification Code (OTP)
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
                        className="text-primary hover:text-primary/80 text-sm font-medium transition-colors disabled:text-gray-400"
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
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:bg-primary/70"
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
            <form className="space-y-6" onSubmit={handleResetPassword}>
              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
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
                    value={passwords.password}
                    onChange={handlePasswordChange}
                    disabled={loading}
                    className="appearance-none block w-full pl-10 pr-10 px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Create a new password"
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
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
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
                    value={passwords.confirmPassword}
                    onChange={handlePasswordChange}
                    disabled={loading}
                    className="appearance-none block w-full pl-10 pr-10 px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Confirm your new password"
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
                {passwords.password && passwords.confirmPassword && passwords.password !== passwords.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">Passwords do not match</p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:bg-primary/70"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Resetting Password...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Login Link */}
          <div className="mt-6 text-center text-sm">
            <Link
              href="/login"
              className="inline-flex items-center font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <FiArrowLeft className="mr-1 h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 