import { User } from "@prisma/client";

export interface LoginResponse {
  accessToken: string;
  user: Omit<User, "password">;
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
