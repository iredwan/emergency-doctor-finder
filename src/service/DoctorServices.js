import DoctorModel from "../model/DoctorModel.js";
import mongoose from "mongoose";
import { deleteFile } from "../utility/fileUtils.js";
import ScheduleModel from './../model/ScheduleModel.js';
const ObjectId = mongoose.Types.ObjectId;


export const createDoctorService = async (req) => {
  try {
    let { name, email } = req.body;

    // Check if a doctor with the same name and Gmail ID already exists
    let existingDoctor = await DoctorModel.findOne({ name: name, email: email });

    if (existingDoctor) {
      return {
        status: false,
        message: "A doctor with the same name and Gmail ID already exists. Profile creation is not allowed.",
      };
    }

    // Create a new doctor profile
    let newDoctor = new DoctorModel(req.body);
    await newDoctor.save();

    return { status: true, message: "Doctor created successfully." };
  } catch (e) {
    return { status: false, error: e.toString() };
  }
};

// Get all doctors
export const getAllDoctorsService = async () => {
  try {
    let doctors = await DoctorModel.find({}, { createdAt: 0, updatedAt: 0 });
    return { status: true, data: doctors };
  } catch (e) {
    return { status: false, error: e.toString() };
  }
};

// Get a doctor by ID
export const getDoctorByIdService = async (req) => {
  try {
    let doctorID = new ObjectId(req.params.id);
    let doctor = await DoctorModel.findById(doctorID, { createdAt: 0, updatedAt: 0 });
    if (!doctor) {
      return { status: false, message: "Doctor not found." };
    }
    return { status: true, data: doctor };
  } catch (e) {
    return { status: false, error: e.toString() };
  }
};

// Update a doctor
export const updateDoctorService = async (req) => {
  try {
    let doctorID = req.params.id;
    let reqBody = req.body;

    // Check if profile image is being updated
    if (reqBody.image) {
      // Get the current user data to find the previous image
      const currentUser = await DoctorModel.findById(doctorID);
      
      
      // If user exists and has a previous image that is different from the new one
      if (currentUser && currentUser.image && currentUser.image !== reqBody.image) {
        // Delete the previous image file
        const deleteResult = await deleteFile(currentUser.image);
        if (!deleteResult.status) {
          console.error("Failed to delete previous profile image:", deleteResult.error);
        }
      }
    }

    let updatedDoctor = await DoctorModel.findByIdAndUpdate(
      doctorID,
      { $set: reqBody },
      { new: true, upsert: true }
    );
    return { status: true, message: "Doctor updated successfully.", data: updatedDoctor };
  } catch (e) {
    return { status: false, error: e.toString() };
  }
};

// Delete a doctor
export const deleteDoctorService = async (req) => {
  try {
    let doctorID = req.params.id;
    // Get user data to find the image filename before deletion
    const doctor = await DoctorModel.findById(doctorID);
    if (!doctor) {
      return { status: false, message: "Doctor not found." };
    }

    // Delete doctor's profile image if exists
    if (doctor.image) {
      const fileName = doctor.image.split("/").pop();
       
      const fileDeletionResult = await deleteFile(fileName);
      if (!fileDeletionResult.status) {
        throw new Error(fileDeletionResult.error);
      }
    }
    
    // Delete all schedules associated with this doctor
    await ScheduleModel.deleteMany({ doctorId: doctorID });
    
    // Delete the doctor
    let deleteResult = await DoctorModel.findByIdAndDelete(doctorID);
    if (!deleteResult) {
      return { status: false, message: "Doctor not found." };
    }
    return { status: true, message: "Doctor and associated schedules deleted successfully." };
  } catch (e) {
    return { status: false, error: e.toString() };
  }
};
