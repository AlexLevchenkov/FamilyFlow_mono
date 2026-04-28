import { api } from '@/api/client';
import type {
  ForgotPasswordData,
  RegistrationData,
} from '@/schemas/loginSchema';

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
  };
}

export interface RegistrationDto {
  email: string;
  password: string;
}

export const authApi = {
  async login(dto: LoginDto) {
    return api.post('/auth/login', dto);
  },
  async logout() {
    return api.get('/auth/logout');
  },
  async refreshToken() {
    return api.post('/auth/refresh-token');
  },
  async forgotPassword(dto: ForgotPasswordData) {
    return api.post('/auth/forgot-password', dto);
  },
  async registration(dto: RegistrationData) {
    return api.post('/user', dto);
  },
};
