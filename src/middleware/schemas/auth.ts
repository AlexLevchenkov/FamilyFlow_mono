import z from "zod";
import { makeValidator } from "@utils/validation";

const changePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  deviceId: z.string().optional(),
  ipAddress: z.ipv4().optional(),
});

const logoutSchema = z.object({
  deviceId: z.string().optional(),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

export const validateLogin = makeValidator(loginSchema);
export const validateLogout = makeValidator(logoutSchema);
export const validateChangePassword = makeValidator(changePasswordSchema);
