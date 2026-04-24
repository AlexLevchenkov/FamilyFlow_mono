import nodemailer from "nodemailer";
import dotenv from "dotenv";

export const sendEmail = async (mailOptions: {
  from: string;
  to: string;
  subject: string;
  html: string;
}) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail(mailOptions);
};
