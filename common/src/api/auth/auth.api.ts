import { apiRequest } from '@familyflow/common/api/client';
import { API_CONFIG } from '@familyflow/common/api/config';
import { TMode } from '@familyflow/common/types/auth';
import { authStorage } from '../../../dist/store/auth';

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
  login(dto: LoginDto, mode: TMode) {
    return apiRequest<AuthResponse>(
      `${API_CONFIG.baseUrl}/auth/login`,
      {
        method: 'POST',
        body: dto,
        mode,
      },
    );
  },
  async logout(mode: TMode) {
    return apiRequest<AuthResponse>(
      `${API_CONFIG.baseUrl}/auth/logout`,
      {
        token: (await authStorage.getAccessToken()) || '',
        mode,
      },
    );
  },
};
