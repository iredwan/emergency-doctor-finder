import nodemailer from "nodemailer";
import {EMAIL_HOST, EMAIL_PASS, EMAIL_PORT, EMAIL_SECURITY, EMAIL_USER} from "../config/config.js";

const SendEmail=async(EmailTo,EmailText,EmailSubject)=>{


    let transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port:EMAIL_PORT,
        secure: EMAIL_SECURITY,
        auth:{
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    })

    let mailOptions = {
        from:'Emergency Doctor Finder <siratuljannat83@gmail.com>',
        to:EmailTo,
        subject:EmailSubject,
        text:EmailText
    }


    return await transporter.sendMail(mailOptions)
}

export default SendEmail;