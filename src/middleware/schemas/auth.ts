import z from "zod";
import { makeValidator } from "@utils/validation";

export const passwordSchema = z
  .string()
  .min(8)
  .max(20)
  .refine((password) => /[A-Z]/.test(password), {message: "Password must contain uppercase letters"})
  .refine((password) => /[a-z]/.test(password), {message: "Password must contain lowercase letters"})
  .refine((password) => /[0-9]/.test(password), {message: "Password must contain numbers"})
  .refine((password) => /[!@#$%^&*]/.test(password), {message: "Password must contain special characters (!@#$%^&*)"});

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .refine(
    (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    { message: "Invalid email" }
  );

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  password: passwordSchema,
  confirmPassword: z.string().optional(),
})
.refine((data) => data.password === data.confirmPassword);

const setPasswordSchema = z.object({
  password: passwordSchema,
})

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(20),
});

const logoutSchema = z.object({
  jti: z.string().optional(),
});

const refreshTokenSchema = z.object({
  jti: z.string(),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

export const validateLogin = makeValidator(loginSchema);
export const validateLogout = makeValidator(logoutSchema);
export const validateChangePassword = makeValidator(changePasswordSchema);
export const validateSetPassword = makeValidator(setPasswordSchema);
