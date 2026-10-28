import type {
  LoginBody,
  LoginResponse,
  RefreshTokenResponse,
  ForgotPasswordBody,
  ResetPasswordBody,
  VerifyEmailQuery,
} from "@familyflow/contracts";
import { interfaceToOpenAPI } from "@utils";

export const authSchemas = {
  LoginBody: interfaceToOpenAPI<LoginBody>({
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
  ForgotPasswordBody: interfaceToOpenAPI<ForgotPasswordBody>({
    email: "seed.owner@familyflow.test",
  }),
  ResetPasswordBody: interfaceToOpenAPI<ResetPasswordBody>({
    token: "secretToken",
    newPassword: "SeedPass1!",
  }),
  EmailVerifyQuery: interfaceToOpenAPI<VerifyEmailQuery>({
    token: "secretToken",
  }),
};
