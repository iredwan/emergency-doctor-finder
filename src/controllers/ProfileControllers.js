import { deleteProfileService, getAllProfileService, getProfileService, ProfileLoginService, profileLogoutService, profileRegisterService, updateProfileService } from "../service/ProfileServices.js";



//! Profile Register
export const profileRegister = async(req, res)=>{
  let result = await profileRegisterService(req);
  return res.status(200).json(result);
}
export const profileLogin = async(req, res)=>{
  let result = await ProfileLoginService(req, res);
  return res.status(200).json(result);
}
export const getProfile = async(req, res)=>{
  let result = await getProfileService(req);
  return res.status(200).json(result);
}
export const getAllProfiles = async(req, res)=>{
  let result = await getAllProfileService(req);
  return res.status(200).json(result);
}
export const updateProfile = async(req, res)=>{
  let result = await updateProfileService(req);
  return res.status(200).json(result);
}
export const deleteProfile = async(req, res)=>{
  let result = await deleteProfileService(req);
  return res.status(200).json(result);
}
export const profileLogout = async(req, res)=>{
  let result = await profileLogoutService(req, res);
  return res.status(200).json(result);
}