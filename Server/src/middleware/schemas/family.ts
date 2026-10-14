import { makeValidator } from "@utils/validation";
import z from "zod";

const addFamilyMemberSchema = z.object({
  email: z.string().trim().email(),
});

export type AddFamilyMemberInput = z.infer<typeof addFamilyMemberSchema>;

export const validateAddFamilyMember = makeValidator(addFamilyMemberSchema, {
  body: true,
});
