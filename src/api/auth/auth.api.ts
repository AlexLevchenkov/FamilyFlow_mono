import { apiRequest } from '@/api/client';
import { API_CONFIG } from '@/api/config';
import { authStorage } from '@/store/auth';

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

export const authApi = {
  login(dto: LoginDto) {
    return apiRequest<AuthResponse>(
      `${API_CONFIG.baseUrl}/auth/login`,
      {
        method: 'POST',
        body: dto,
      },
    );
  },
  async logout() {
    return apiRequest<AuthResponse>(
      `${API_CONFIG.baseUrl}/auth/logout`,
      {
        token: (await authStorage.getAccessToken()) || "",
      },
    );
  },
};
