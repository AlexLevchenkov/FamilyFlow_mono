import {
  ChangePasswordResponse,
  LoginResponse,
  RefreshResponse,
  SetPasswordResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  EmailVerifyResponse,
} from "@appTypes/auth.types";
import { LoginInput } from "@middleware/schemas/auth";
import { interfaceToOpenAPI } from "@utils/interfaceToOpenAPI";

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
  ChangePasswordRequest: interfaceToOpenAPI<ChangePasswordResponse>({
    oldPassword: "Password123!@#",
    newPassword: "Password456!@#",
  }),
  SetPasswordRequest: interfaceToOpenAPI<SetPasswordResponse>({
    newPassword: "Password456!@#",
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
