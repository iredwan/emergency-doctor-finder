import jwt from "jsonwebtoken";
import { JWT_EXPIRE_TIME, JWT_KEY } from "../config/config.js";
export const EncodeToken = (email,user_id, role) => {
  let key = JWT_KEY;
  let expire = JWT_EXPIRE_TIME;
  let payload = { email,user_id:user_id, role };
  return jwt.sign(payload, key, { expiresIn: expire });
};

export const DecodeToken = (token) => {
  try {
    let key = JWT_KEY;
    let decoded = jwt.verify(token, key);
    return decoded; 
  } catch (err) {
    return null;
  }
};
