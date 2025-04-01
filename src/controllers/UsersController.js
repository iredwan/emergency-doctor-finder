import {
  userOTPService,
  userPassUpdateOTPService,
  VerifyOTPService
} from "../service/UsersService.js";

//! SENT OTP
export const sentOTP = async (req, res) => {
  let result = await userOTPService(req);
  return res.json(result);
};
//! SENT OTP FOR UPDATE PASSWORD
export const sentUpdatePassOTP = async (req, res) => {
  let result = await userPassUpdateOTPService(req);
  return res.json(result);
};

export const VerifyLogin = async(req, res)=>{
  let result=await VerifyOTPService(req, res)
  return res.status(200).json(result)
}

