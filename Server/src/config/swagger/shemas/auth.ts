import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailQuery,
} from "@familyflow/contracts";
import { interfaceToOpenAPI } from "@utils";

export const authSchemas = {
  LoginRequest: interfaceToOpenAPI<LoginRequest>({
    email: "seed.owner@familyflow.test",
    password: "SeedPass1!",
  }),
  LoginResponse: interfaceToOpenAPI<LoginResponse>({
    accessToken: "jwt-token",
    user: {
      name: "Seed Owner",
      avatar: "https://example.com/avatars/seed-owner.png",
    },
  }),
  RefreshResponse: interfaceToOpenAPI<RefreshTokenResponse>({
    accessToken: "jwt-token",
    refreshToken: "jwt-refresh-token",
  }),
  ForgotPasswordRequest: interfaceToOpenAPI<ForgotPasswordRequest>({
    email: "seed.owner@familyflow.test",
  }),
  ResetPasswordRequest: interfaceToOpenAPI<ResetPasswordRequest>({
    token: "secretToken",
    newPassword: "SeedPass1!",
  }),
  EmailVerifyRequest: interfaceToOpenAPI<VerifyEmailQuery>({
    token: "secretToken",
  }),
};
