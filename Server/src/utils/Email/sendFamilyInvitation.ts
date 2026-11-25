import { sendEmail } from "./sendEmail";
import { familyInvitationTemplate } from "./templates/familyInvitation";

export const sendFamilyInvitation = async (to: string, token: string) => {
  const invitationLink =
    `${process.env.CLIENT_URL}/register?invite=${encodeURIComponent(token)}&email=${encodeURIComponent(to)}`;

  await sendEmail({
    from: `"FamilyFlow" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Запрошення до сімейного простору FamilyFlow",
    html: familyInvitationTemplate(invitationLink),
  });
};
