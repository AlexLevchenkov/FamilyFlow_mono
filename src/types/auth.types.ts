import { User } from "@prisma/client";

export interface LoginResponse {
  accessToken: string;
  user: Pick<User, "name" | "avatar">;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface ChangePasswordResponse {
  oldPassword: string;
  newPassword: string;
}

export interface SetPasswordResponse {
  newPassword: string;
}

export interface ForgotPasswordResponse {
  email: string;
}

export interface ResetPasswordResponse {
  token: string;
  newPassword: string;
}

export interface EmailVerifyResponse {
  token: string;
}