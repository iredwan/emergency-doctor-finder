import ScheduleModel from "../model/ScheduleModel.js";
import DoctorModel from "../model/DoctorModel.js";
import moment from "moment";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

// Create Schedule
export const createScheduleService = async (req) => {
  try {
    let { doctorId, availableDays, startTime, endTime } = req.body;

    // Convert times to 24-hour format for accurate comparison
    let start = moment(startTime, "h A").format("HH:mm");
    let end = moment(endTime, "h A").format("HH:mm");

    // Check for existing schedule conflicts
    const existingSchedule = await ScheduleModel.findOne({
      doctorId: doctorId,
      availableDays: { $in: availableDays }, // Check for overlapping days
      $or: [
        {
          $and: [
            { startTime: { $lte: end } }, // Existing startTime is before or during the requested time
            { endTime: { $gte: start } }, // Existing endTime is after or during the requested time
          ],
        },
      ],
    });

    if (existingSchedule) {
      return { status: false, message: "Doctor is already scheduled at this time." };
    }

    // If no conflict, create a new schedule
    let newSchedule = new ScheduleModel({
      doctorId,
      availableDays,
      startTime: start,
      endTime: end,
    });

    await newSchedule.save();

    return { status: true, message: "Schedule created successfully." };
  } catch (e) {
    return { status: false, error: e.toString() };
  }
};

// Update Schedule
export const updateScheduleService = async (req) => {
  try {
    let scheduleID = req.params.id;
    let reqBody = req.body;
    let updatedSchedule = await ScheduleModel.findByIdAndUpdate(
      scheduleID,
      { $set: reqBody },
      { new: true, upsert: true }
    );
    return { status: true, message: "Schedule updated successfully.", data: updatedSchedule };
  } catch (e) {
    return { status: false, error: e.toString() };
  }
};

// Delete Schedule
export const deleteScheduleService = async (req) => {
  try {
    let scheduleID = req.params.id;
    
    let deleteResult = await ScheduleModel.findByIdAndDelete(scheduleID);
    if (!deleteResult) {
      return { status: false, message: "Schedule not found." };
    }
    return { status: true, message: "Schedule deleted successfully." };
  } catch (e) {
    return { status: false, error: e.toString() };
  }
};

// Get Schedule Detail by ID
export const getScheduleByIdService = async (req) => {
    try {
        let scheduleID = new ObjectId(req.params.id);
        let MatchStage = {$match: {_id: scheduleID}};

        let JoinWithDoctorStage = {
            $lookup: {
                from: "doctors",
                localField: "doctorId",
                foreignField: "_id",
                as: "doctor",
            },
        };
        let UnwindUserStage = {
            $unwind: "$doctor",
        };
        let ProjectionStage = {
            $project: {
                _id: 0,
                doctorId: 1,
                startTime: 1,
                endTime: 1,
                availableDays:1,
                name: "$doctor.name",
                education: "$doctor.education",
                experience: "$doctor.experience",
                image: "$doctor.image",
                email: "$doctor.email",
                phone: "$doctor.phone",
                specialty: "$doctor.specialty",

            },
        }
        let data = await ScheduleModel.aggregate([
        MatchStage,
        JoinWithDoctorStage,
        UnwindUserStage,
        ProjectionStage])
        return { status: true, data: data };
      } catch (e) {
      return { status: false, error: e.toString() };
    }
  };

// Get Schedule List
export const getAllSchedulesService = async () => {
  try {
    let JoinWithDoctorStage = {
        $lookup: {
            from: "doctors",
            localField: "doctorId",
            foreignField: "_id",
            as: "doctor",
        },
    };
    let UnwindUserStage = {
        $unwind: "$doctor",
    };
    let ProjectionStage = {
        $project: {
            doctorId: 1,
            startTime: 1,
            endTime: 1,
            availableDays:1,
            name: "$doctor.name",
            education: "$doctor.education",
            experience: "$doctor.experience",
            image: "$doctor.image",
            email: "$doctor.email",
            phone: "$doctor.phone",
            specialty: "$doctor.specialty",

        },
    }
    let data = await ScheduleModel.aggregate([
    JoinWithDoctorStage,
    UnwindUserStage,
    ProjectionStage])
    return { status: true, data: data };
  } catch (e) {
    return { status: false, error: e.toString() };
  }
};

// Get Schedule By Date
export const getScheduleByDateService = async (req) => {
  try {
    let { date } = req.body;

    if (!date) return { status: false, error: "Date is required" };

    // Convert input date to a JavaScript Date object
    const inputDate = new Date(date);

    // Check if the input date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates

    if (inputDate < today) {
      return { status: false, message: "You cannot search for past dates." };
    }

    // Function to get the day of the week
    const getDayOfWeek = (date) => {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return days[new Date(date).getDay()];
    };

    // Convert date to the day of the week
    const dayOfWeek = getDayOfWeek(date);

    let MatchStage = { $match: { availableDays: dayOfWeek } };

    let JoinWithDoctorStage = {
      $lookup: {
        from: "doctors",
        localField: "doctorId",
        foreignField: "_id",
        as: "doctor",
      },
    };

    let UnwindUserStage = { $unwind: "$doctor" };

    let ProjectionStage = {
      $project: {
        _id: 0,
        doctorId: 1,
        startTime: 1,
        endTime: 1,
        availableDays: 1,
        name: "$doctor.name",
        education: "$doctor.education",
        experience: "$doctor.experience",
        image: "$doctor.image",
        email: "$doctor.email",
        phone: "$doctor.phone",
        specialty: "$doctor.specialty",
      },
    };

    let data = await ScheduleModel.aggregate([
      MatchStage,
      JoinWithDoctorStage,
      UnwindUserStage,
      ProjectionStage,
    ]);

    // Check if data is empty
    if (data.length === 0) {
      return { status: true, message: `No schedules available on ${dayOfWeek}` };
    }

    return { status: true, data: data };
  } catch (e) {
    return { status: false, error: e.toString() };
  }
};

// Get Schedule By Search
export const getScheduleBySearch = async (req) => {
  try {
    let { name, specialty } = req.params;

    // Create a match condition for the search query
    let matchCondition = {};
    
    if (name) {
      matchCondition["doctor.name"] = { $regex: new RegExp(name, "i") }; // Case-insensitive search for doctor's name
    }
    if (specialty) {
      matchCondition["doctor.specialty"] = { $regex: new RegExp(specialty, "i") }; // Case-insensitive search for specialty
    }

    let JoinWithDoctorStage = {
      $lookup: {
        from: "doctors",
        localField: "doctorId",
        foreignField: "_id",
        as: "doctor",
      },
    };

    let UnwindDoctorStage = { $unwind: "$doctor" };

    let MatchStage = { $match: matchCondition };

    let ProjectionStage = {
      $project: {
        _id: 0,
        doctorId: 1,
        startTime: 1,
        endTime: 1,
        availableDays: 1,
        name: "$doctor.name",
        education: "$doctor.education",
        experience: "$doctor.experience",
        image: "$doctor.image",
        phone: "$doctor.phone",
        specialty: "$doctor.specialty",
      },
    };

    let data = await ScheduleModel.aggregate([
      JoinWithDoctorStage,
      UnwindDoctorStage,
      MatchStage,
      ProjectionStage,
    ]);

    if (data.length === 0) {
      return { status: true, message: "No schedule found for the given search criteria." };
    }

    return { status: true, data: data };
  } catch (e) {
    return { status: false, error: e.toString() };
  }
};

 
