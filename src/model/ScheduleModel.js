import mongoose from "mongoose";

const DataSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorModel",
      required: true,
    },
    availableDays: [
      {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      },
    ],
    startTime: { type: String, required: true }, // e.g., "09:00 AM"
    endTime: { type: String, required: true }, // e.g., "05:00 PM"
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ScheduleModel = mongoose.model("schedule", DataSchema);
export default ScheduleModel;
