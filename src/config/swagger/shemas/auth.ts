import {
  LoginResponse,
  RefreshResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  EmailVerifyResponse,
} from "@appTypes/auth.types";
import { LoginInput } from "@/middleware";
import { interfaceToOpenAPI } from "@/utils";

export const authSchemas = {
  LoginRequest: interfaceToOpenAPI<LoginInput>({
    email: "super@gmail.com",
    password: "Password123!@#",
  }),
  LoginResponse: interfaceToOpenAPI<LoginResponse>({
    accessToken: "jwt-token",
    user: {
      name: "John Doe",
      avatar: "https://example.com/jone-doe-avatar",
    },
  }),
  RefreshResponse: interfaceToOpenAPI<RefreshResponse>({
    accessToken: "jwt-token",
  }),
  ForgotPasswordRequest: interfaceToOpenAPI<ForgotPasswordResponse>({
    email: "super@gmail.com",
  }),
  ResetPasswordRequest: interfaceToOpenAPI<ResetPasswordResponse>({
    token: "secretToken",
    newPassword: "Password456!@#",
  }),
  EmailVerifyRequest: interfaceToOpenAPI<EmailVerifyResponse>({
    token: "secretToken",
  }),
};
