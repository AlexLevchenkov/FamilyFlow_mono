import { UserPublic } from "./user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginDataResponse {
  accessToken: string;
  refreshToken: string;
  user: UserPublic;
}

export type LoginResponse = Omit<LoginDataResponse, "refreshToken">;

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface VerifyEmailQuery {
  token: string;
}

export interface LogoutQuery {
  jti?: string;
}
