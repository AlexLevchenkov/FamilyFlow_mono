import z from "zod";
import { makeValidator } from "@utils/validation";

export const passwordSchema = z
  .string()
  .min(8)
  .max(20)
  .refine(password => /[A-Z]/.test(password), {
    message: "Password must contain uppercase letters",
  })
  .refine(password => /[a-z]/.test(password), {
    message: "Password must contain lowercase letters",
  })
  .refine(password => /[0-9]/.test(password), {
    message: "Password must contain numbers",
  })
  .refine(password => /[!@#$%^&*]/.test(password), {
    message: "Password must contain special characters (!@#$%^&*)",
  });

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .refine(value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
    message: "Invalid email",
  });

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(20),
});

const requestPasswordResetSchema = z.object({
  email: z.email(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: passwordSchema,
});

const verifyEmailSchema = z.object({
  token: z.string(),
});

export const validateLogin = makeValidator(loginSchema);
export const validateRequestPasswordReset = makeValidator(
  requestPasswordResetSchema
);
export const validateResetPassword = makeValidator(resetPasswordSchema);
export const validateVerifyEmail = makeValidator(verifyEmailSchema, {
  query: true,
});
