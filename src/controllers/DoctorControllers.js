import { 
    createDoctorService, 
    getAllDoctorsService, 
    getDoctorByIdService, 
    updateDoctorService, 
    deleteDoctorService 
  } from "../service/DoctorServices.js";
  
  //! Create Doctor
  export const createDoctor = async (req, res) => {
    let result = await createDoctorService(req);
    return res.status(200).json(result);
  };
  
  //! Get All Doctors
  export const getAllDoctors = async (req, res) => {
    let result = await getAllDoctorsService();
    return res.status(200).json(result);
  };
  
  //! Get Doctor by ID
  export const getDoctorById = async (req, res) => {
    let result = await getDoctorByIdService(req);
    return res.status(200).json(result);
  };
  
  //! Update Doctor
  export const updateDoctor = async (req, res) => {
    let result = await updateDoctorService(req);
    return res.status(200).json(result);
  };
  
  //! Delete Doctor
  export const deleteDoctor = async (req, res) => {
    let result = await deleteDoctorService(req);
    return res.status(200).json(result);
  };