import ProfileModel from "../model/ProfileModel.js";
import { EncodeToken } from "../utility/TokenUtility.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { deleteFile } from './../utility/fileUtils.js';
const ObjectId = mongoose.Types.ObjectId;

export const profileRegisterService = async (req) => {
  try {
    let reqBody = req.body;
    let email = reqBody.email;
    await ProfileModel.updateOne(
      { email: email},
      { $set: reqBody },
      { upsert: true }
    );
    return { status: true, message: "Register success." };
  } catch (e) {
    return { status: false, message: "There is problem to Register you.", details: e };
  }
};

export const ProfileLoginService = async (req, res) => {
  try {
    let reqBody = req.body;
    let email = reqBody.email;
    let password = reqBody.password;

    const user = await ProfileModel.findOne({ email: email });
    
    if (!user) {
      return { status: false, message: "User not found." };
    }
    let user_id = user._id;
    let role = user.role;
    

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { status: false, message: "Incorrect password." };
    }

    let token = EncodeToken(email, user_id, role);
    
    // Set cookie
    let options = {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: false, // Prevents client-side access to the cookie
      sameSite: "none", // Required for cross-site cookies
      secure: true, // true in production
    };

    res.cookie("token", token, options);
    return {
      status: true,
      token: token,
      data: user[0],
      message: "Login success.",
    };
  } catch (e) {
    return { status: false, message: "Login unsuccess.",details: e.message };
  }
};

export const getProfileService = async (req) => {
  try {
    let UserID = new ObjectId(req.params.id);

    let MatchStage = { $match: { _id: UserID } };

    let ProjectionStage = {
      $project: {
        password: 0,
        createdAt: 0,
        updatedAt: 0
      },
    };
    // Query
    let data = await ProfileModel.aggregate([
      MatchStage,
      ProjectionStage,
    ]);

    return { status: true, data: data[0] };
  } catch (e) {
    return { status: false, error: e.toString() };
  }
};
export const getAllProfileService = async () => {
  try {

    let ProjectionStage = {
      $project: {
        password: 0,
        createdAt: 0,
        updatedAt: 0
      },
    };
    let data = await ProfileModel.aggregate([
      ProjectionStage,
    ]);
    return { status: true, data: data };
  } catch (e) {
    return { status: false, error: e };
  }
};
export const updateProfileService = async (req) => {
  try {
    let user_id = req.params.id;
    let reqBody = req.body;
    
    // Check if profile image is being updated
    if (reqBody.img) {
      // Get the current user data to find the previous image
      const currentUser = await ProfileModel.findById(user_id);
      
      
      // If user exists and has a previous image that is different from the new one
      if (currentUser && currentUser.img && currentUser.img !== reqBody.img) {
        // Delete the previous image file
        const deleteResult = await deleteFile(currentUser.img);
        if (!deleteResult.status) {
          console.error("Failed to delete previous profile image:", deleteResult.error);
        }
      }
    }
    
    // Update the user profile
    await ProfileModel.findByIdAndUpdate(
      { _id: user_id },
      { $set: reqBody },
      { upsert: true }
    );
    return { status: true, message: "Profile update success." };
  } catch (e) {
    return { status: false, error: e };
  }
};

export const deleteProfileService = async (req) => {
  try {
    let user_id = req.params.id;
    
    // Get user data to find the image filename before deletion
    const user = await ProfileModel.findById(user_id);
    if (!user) {
      return { status: false, message: "User not found." };
    }

    if (user.img) {
      const fileName = user.img.split("/").pop();
       
      const fileDeletionResult = await deleteFile(fileName);
      if (!fileDeletionResult.status) {
        throw new Error(fileDeletionResult.error);
      }
    }
    
    // Delete the user from database
    let userData = await ProfileModel.deleteOne({ _id: user_id });
    if (userData.deletedCount === 0) {
      return { status: false, message: "Failed to delete user." };
    }
    return { status: true, message: "Profile deleted successfully." };
  } catch (e) {
    return { status: false, message: "Something went wrong", error: e.toString() };
  }
};

export const profileLogoutService = async (req, res) => {
  try {
    res.clearCookie("token");
    return { status: true, message: "Logout success." };
  } catch (e) {
    return { status: false, error: e };
  }
};

