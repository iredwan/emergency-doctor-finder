import mongoose from "mongoose";

const DataSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true, lowercase: true },
    otp: { type: String, required: false }, // OTP as string
    otpExpiry: { 
      type: Date, 
      required: true, // Must be required for TTL to work
      index: { expires: 120 } // TTL index - Deletes document after 120 seconds
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Ensure TTL index is created
DataSchema.index({ expireAfterSeconds: 120, expires: 120 });

const UserModel = mongoose.model("users", DataSchema);

export default UserModel;
