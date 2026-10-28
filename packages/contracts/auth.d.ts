import { UserPublic } from "./user";

export interface LoginBody {
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

export interface ForgotPasswordBody {
  email: string;
}

export interface ResetPasswordBody {
  token: string;
  newPassword: string;
}

export interface VerifyEmailQuery {
  token: string;
}

export interface JTI {
  jti?: string;
}
