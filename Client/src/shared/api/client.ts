import axios from 'axios';
import { useAuthStore } from '@store/auth';
import { API_CONFIG } from './config';
import { toast } from '@ui';
import { authApi } from './auth.api';

import { setupMockAdapter } from '@mocks';

export const api = axios.create({
  baseURL: API_CONFIG.baseUrl,
  withCredentials: true,
});

setupMockAdapter(api);

let refreshPromise: Promise<string> | null = null;

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = authApi
      .refreshToken()
      .then(response => {
        const accessToken = response.data.data.accessToken;
        if (!accessToken) {
          throw new Error('Refresh response did not include an access token');
        }
        useAuthStore.getState().refreshTokens({ access: accessToken });
        return accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const isAuthRequest = originalRequest.url?.startsWith('/auth/');

    if (
      error.response?.status === 401 &&
      !isAuthRequest &&
      !originalRequest._retry &&
      !!useAuthStore.getState().accessToken
    ) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    if (!error.response) {
      toast.error('Сталася помилка на сервері. Спробуйте пізніше');
    }

    return Promise.reject(error);
  }
);
