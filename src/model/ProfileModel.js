import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const DataSchema = new mongoose.Schema(
  {
    //Personal Information
    email: { type: String, unique: true, required: true, lowercase: true },
    role: { 
      type: String, 
      enum: ["admin", "user"], 
      default: "user"
    },
    firstName: { type: String, required: true},
    lastName: { type: String },
    img: { type: String, default: "Image" },
    phone: { type: String,required: true },
    password: { 
      type: String, 
      required: true,
      set: (password) => {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      }
    },

  },
  {
    timestamps: true,
    versionKey: false
  }
);

const ProfileModel = mongoose.model('profiles', DataSchema);

export default ProfileModel;