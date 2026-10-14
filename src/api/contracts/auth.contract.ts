/**
 * Auth Contracts & DTOs
 * Corresponds to /auth routes and Server/src/types/auth.types.ts
 */

export interface AuthUser {
  name: string | null;
  avatar: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/** Alias for backward compatibility */
export type LoginDto = LoginRequest;

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

/** Alias for backward compatibility */
export type AuthResponse = LoginResponse;

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

/** Alias for backward compatibility */
export type ForgotPasswordDto = ForgotPasswordRequest;

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

/** Alias for backward compatibility */
export type ResetPasswordDto = ResetPasswordRequest;

export interface VerifyEmailQuery {
  token: string;
}

export interface LogoutQuery {
  jti?: string;
}
