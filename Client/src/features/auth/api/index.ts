import { API_ENDPOINTS, api } from '@api';
import type {
  ApiResponse,
  LoginBody,
  LoginResponse,
  RefreshTokenResponse,
  ForgotPasswordBody,
  ResetPasswordBody,
  RegisterUserBody,
} from '@types';

export const authApi = {
  /**
   * Login user (POST /auth/login)
   */
  async login(dto: LoginBody) {
    const { data } = await api.post<ApiResponse<LoginResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      dto
    );

    return data.data;
  },

  /**
   * Logout user (GET /auth/logout)
   */
  async logout() {
    await api.get(API_ENDPOINTS.AUTH.LOGOUT);
  },

  /**
   * Refresh access token (POST /auth/refresh-token)
   */
  async refreshToken() {
    const { data } = await api.post<ApiResponse<RefreshTokenResponse>>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN
    );

    return data.data;
  },

  /**
   * Forgot password (POST /auth/forgot-password)
   */
  async forgotPassword(dto: ForgotPasswordBody) {
    await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, dto);
  },

  /**
   * Reset password (POST /auth/reset-password)
   */
  async resetPassword(dto: ResetPasswordBody) {
    await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, dto);
  },

  /**
   * Register new user (POST /auth/registration)
   */
  async registration(dto: RegisterUserBody) {
    const { data } = await api.post<ApiResponse<LoginResponse['user']>>(
      API_ENDPOINTS.USER.ROOT,
      dto
    );

    return data.data;
  },

  /**
   * Verify email (GET /auth/verify-email)
   */
  async verifyEmail(token: string) {
    await api.get(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
      params: { token },
    });
  },
};
