import express from "express";
import * as UsersController from "../controllers/UsersController.js";
import * as ProfileController from "../controllers/ProfileControllers.js";
import * as DoctorController from "../controllers/DoctorControllers.js";
import * as ScheduleController from "../controllers/ScheduleController.js";
import * as FileUploadController from "../controllers/FileUploadController.js";
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import upload from "../middlewares/FileUploads.js";
import { checkRole } from './../middlewares/roleMiddleware.js';

const router = express.Router();

// user routes
router.post("/sent-otp", UsersController.sentOTP);
router.post("/update-password", UsersController.sentUpdatePassOTP);
router.post('/verify-otp',UsersController.VerifyLogin)

// Profile routes
router.post('/profile-register', ProfileController.profileRegister); // Create Profile

router.post('/profile-login',ProfileController.profileLogin); // Login Profile

router.get('/single-profile/:id',AuthMiddleware,checkRole(["admin","user"]), ProfileController.getProfile); // Get single Profile by ID

router.get('/all-profiles',AuthMiddleware,checkRole(["admin"]), ProfileController.getAllProfiles); // Get all Profiles

router.put('/update-profile/:id',AuthMiddleware,checkRole(["admin", "user"]), ProfileController.updateProfile); // Update Profile

router.delete('/delete-profile/:id',AuthMiddleware,checkRole(["admin"]), ProfileController.deleteProfile); // Delete Profile

router.get('/profile-logout',AuthMiddleware,checkRole(["admin","user"]), ProfileController.profileLogout); 



// Doctor routes
router.post("/create-doctor", AuthMiddleware, checkRole(["admin"]), DoctorController.createDoctor); // Create Doctor

router.get("/all-doctors", AuthMiddleware, checkRole(["admin", "user"]), DoctorController.getAllDoctors); // Get all Doctors

router.get("/single-doctor/:id", AuthMiddleware, checkRole(["admin", "user"]), DoctorController.getDoctorById); // Get single Doctor by ID

router.put("/update-doctor/:id", AuthMiddleware, checkRole(["admin"]), DoctorController.updateDoctor); // Update Doctor

router.delete("/delete-doctor/:id", AuthMiddleware, checkRole(["admin"]), DoctorController.deleteDoctor); // Delete Doctor



//Schedule routes

router.get('/schedule-detail/:id',AuthMiddleware,checkRole(["admin", "user"]), ScheduleController.getScheduleById); // Get Schedule Detail by ID

router.get('/schedule-list',AuthMiddleware,checkRole(["admin", "user"]), ScheduleController.getAllSchedules); // Get Schedule List

router.post('/schedule-create',AuthMiddleware,checkRole(["admin"]), ScheduleController.createSchedule); // Create Schedule

router.put('/schedule-update/:id',AuthMiddleware,checkRole(["admin"]), ScheduleController.updateSchedule); // Update Schedule

router.delete('/schedule-delete/:id',AuthMiddleware,checkRole(["admin"]), ScheduleController.deleteSchedule); // Delete Schedule

router.get('/get-schedule-by-date',AuthMiddleware,checkRole(["admin", "user"]), ScheduleController.getScheduleByDate); // Get Schedule by Date

router.get('/schedule-by-search/:nameorspecialty',AuthMiddleware,checkRole(["admin", "user"]), ScheduleController.getScheduleByNameOrSpecialty); 


// file routes
router.post(
  "/file-upload",
  AuthMiddleware,
  upload.array("file", 20),
  FileUploadController.fileUpload
);

export default router;
