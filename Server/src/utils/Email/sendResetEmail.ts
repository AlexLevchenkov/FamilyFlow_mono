import { sendEmail } from './sendEmail';
import { resetPasswordTemplate } from './templates/resetPassword';

export const sendResetEmail = async (to: string, token: string) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const mailOptions = {
    from: `"FamilyFlow Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Password Reset Request',
    html: resetPasswordTemplate(resetLink),
  };

  await sendEmail(mailOptions);
};
