import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const sendMail = async (to, subject, message) => {
  try {
    const info = await transporter.sendMail({
      from: `TuneStream <${process.env.EMAIL}>`, 
      to: to,
      subject: subject,
      html: message,
    });
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
};


export default sendMail;
