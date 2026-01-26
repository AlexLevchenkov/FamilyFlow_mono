import { apiRequest } from "../client";
import { API_CONFIG } from "../config";

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
        method: "POST",
        body: dto,
      }
    );
  },
};
