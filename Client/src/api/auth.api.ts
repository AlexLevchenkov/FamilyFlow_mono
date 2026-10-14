import { api } from './client';
import { API_ENDPOINTS } from './endpoints';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  LogoutQuery,
} from './contracts';
import type {
  ForgotPasswordData,
  RegistrationData,
} from '@schemas/loginSchema';

// Re-exports for backward compatibility
export type { LoginDto, ResetPasswordDto, AuthResponse } from './contracts';

export const authApi = {
  async login(dto: LoginRequest) {
    return api.post<ApiResponse<LoginResponse>>(API_ENDPOINTS.AUTH.LOGIN, dto);
  },

  async logout(params?: LogoutQuery) {
    return api.get<ApiResponse<null>>(API_ENDPOINTS.AUTH.LOGOUT, { params });
  },

  async refreshToken() {
    return api.post<ApiResponse<RefreshTokenResponse>>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN
    );
  },

  async forgotPassword(dto: ForgotPasswordRequest | ForgotPasswordData) {
    return api.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, dto);
  },

  async resetPassword(dto: ResetPasswordRequest) {
    return api.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.RESET_PASSWORD, dto);
  },

  async registration(dto: RegistrationData) {
    return api.post<ApiResponse<LoginResponse['user']>>(
      API_ENDPOINTS.USER.ROOT,
      dto
    );
  },

  async verifyEmail(token: string) {
    return api.get<ApiResponse<null>>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
      params: { token },
    });
  },
};
