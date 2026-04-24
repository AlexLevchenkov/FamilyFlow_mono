import {
  ChangePasswordResponse,
  LoginResponse,
  RefreshResponse,
  SetPasswordResponse,
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
      id: 1,
      email: "user@example.com",
      name: "John Doe",
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: "https/example.com/jone-doe-avatar",
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
};
