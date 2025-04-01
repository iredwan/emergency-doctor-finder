import ProfileModel from "../model/ProfileModel.js";
import SendEmail from "../utility/emailUtility.js";
import { EncodeToken } from "../utility/TokenUtility.js";
import UserModel from './../model/UserModel.js';




export const userOTPService = async(req) =>{
  try {
      let email = req.body.email;
      let role =req.body.role;
      let user

      const existingUser = await ProfileModel.find({ email: email });

      if (existingUser.length > 0) {
          return { status: false, message: "User exists" };
      }
      
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Set OTP expiry (current time + 2 minutes)
      let otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 2); // Expires in 2 mins

    
      user = await UserModel.findOneAndUpdate(
          { email: email },
          { otp, role: role, otpExpiry: otpExpiry},
          { upsert: true, new: true }
        );
        
        
        await SendEmail(email.trim(), `Your OTP: ${otp}`, "OTP Verification");
      
  
      return { status: true, message: `OTP Send to ${email}` };
    } catch (error) {
      return { status: false, message: "Failed to send OTP", details: error.message };
    }
}

export const userPassUpdateOTPService = async(req) =>{
  try {
      let email = req.body.email;
      let role =req.body.role;
      let user

      const existingUser = await ProfileModel.findOne({ email: email });

      if (!existingUser) {
          return { status: false, message: "User not found" };
      }
      console.log(existingUser);
      
      
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Set OTP expiry (current time + 2 minutes)
      let otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 2); // Expires in 2 mins

    
      user = await UserModel.findOneAndUpdate(
          { email: email },
          { otp, role: role, otpExpiry: otpExpiry},
          { upsert: true, new: true }
        );
        
        
        await SendEmail(email.trim(), `Your OTP: ${otp}`, "OTP Verification");
      
  
      return { status: true, message: `OTP Send to ${email}` };
    } catch (error) {
      return { status:false, message:"Failed to send OTP", details: error.message};
    }
}

export const VerifyOTPService = async(req, res) =>{

  try {
    let { email, otp } = req.body;

    if (!email || !otp) {
        return { status: "false", message: "Email and OTP are required" };
    }

    // Find the user
    let user = await UserModel.findOne({ email: email.trim() });
 
  
    if (!user || !user.otp) {
        return { status: "false", message: "Invalid OTP" };
    }

    // Check if OTP is expired
    let currentTime = new Date();
    if (user.otpExpiry && user.otpExpiry < currentTime) {
        return { status: "false", message: "OTP has expired. Please request a new one." };
    }

    // Check if OTP matches
    if (user.otp !== otp) {
        return { status: "false", message: "Incorrect OTP" };
    }

    let token = EncodeToken(email, user._id.toString(), user.role);
    
    
    // OTP is correct → Clear OTP fields after successful verification
    await UserModel.updateOne(
        { email: email.trim() },
        { $unset: { otp: "", otpExpiry: "" } }
    );
    
    return {
      status: true,
      token: token,
      data: user[0],
      message: "OTP verified successfully.",
    };

  } catch (e) {
      return {status: false, message: "Invalid OTP1", details: e.message}
  }
}
