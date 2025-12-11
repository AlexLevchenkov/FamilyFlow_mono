import { ChangePasswordResponse, LoginResponse, RefreshResponse, SetPasswordResponse } from "@appTypes/auth.types";
import { LoginInput } from '@middleware/auth';
import { interfaceToOpenAPI } from "@utils/interfaceToOpenAPI";

export const authSchemas = {
  LoginRequest: interfaceToOpenAPI<LoginInput>({
    email: 'user@example.com',
    password: 'password123',
    deviceId: '123456789',
    ipAddress: '192.0.0.1'
  }),
  LoginResponse: interfaceToOpenAPI<LoginResponse>({
    accessToken: 'jwt-token',
    user: {
      id: 1,
      email: 'user@example.com',
      password: '',
      name: 'John Doe',
      createdAt: new Date(),
      updatedAt: new Date(),
      avatar: 'https/example.com/jone-doe-avatar'
    },
  }),
  RefreshResponse: interfaceToOpenAPI<RefreshResponse>({
    accessToken: 'jwt-token',
  }),
  ChangePasswordRequest: interfaceToOpenAPI<ChangePasswordResponse>({
    oldPassword: 'password123',
    newPassword: 'password456'
  }),
  SetPasswordRequest: interfaceToOpenAPI<SetPasswordResponse>({
    newPassword: 'password456'
  }),
}