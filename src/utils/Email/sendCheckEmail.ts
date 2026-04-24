import dotenv from "dotenv";
dotenv.config();
import { sendEmail } from "./sendEmail";
import { verifyEmailTemplate } from "./templates/verifyEmail";

export const sendCheckEmail = async (to: string, token: string) => {
  const verifyLink = `${process.env.CLIENT_URL}/verify-email/${token}`;

  const mailOptions = {
    from: `"FamilyFlow Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Email Verify",
    html: verifyEmailTemplate(verifyLink),
  };

  await sendEmail(mailOptions);
};
