import { apiRequest } from "./client";
import { API_CONFIG } from "./config";

export interface User {
  id: string;
  email: string;
}

export const userApi = {
  me(token: string) {
    return apiRequest<User>(
      `${API_CONFIG.baseUrl}/users/me`,
      {
        token,
      }
    );
  },
};
