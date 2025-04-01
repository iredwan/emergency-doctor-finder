import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    education: { type: String, required: true },
    experience: { type: String, required: true },
    image: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    specialty: { type: String, required: true },
  },
  { timestamps: true,
    versionKey: false,
   } // Adds createdAt & updatedAt automatically
);

const DoctorModel = mongoose.model("doctors", doctorSchema);
export default DoctorModel;
