import type {
  ForgotPasswordRequest,
  LoginResponse,
  RefreshResponse,
  ResetPasswordRequest,
  VerifyEmailQuery,
  LoginRequest,
} from '@familyflow/contracts';
import { interfaceToOpenAPI } from '@/utils';

export const authSchemas = {
  LoginRequest: interfaceToOpenAPI<LoginRequest>({
    email: 'super@gmail.com',
    password: 'Password123!@#',
  }),
  LoginResponse: interfaceToOpenAPI<LoginResponse>({
    accessToken: 'jwt-token',
    user: {
      name: 'John Doe',
      avatar: 'https://example.com/jone-doe-avatar',
    },
  }),
  RefreshResponse: interfaceToOpenAPI<RefreshResponse>({
    accessToken: 'jwt-token',
  }),
  ForgotPasswordRequest: interfaceToOpenAPI<ForgotPasswordRequest>({
    email: 'super@gmail.com',
  }),
  ResetPasswordRequest: interfaceToOpenAPI<ResetPasswordRequest>({
    token: 'secretToken',
    newPassword: 'Password456!@#',
  }),
  EmailVerifyRequest: interfaceToOpenAPI<VerifyEmailQuery>({
    token: 'secretToken',
  }),
};
