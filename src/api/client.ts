import axios from 'axios';
import { useAuthStore } from '@/store/auth';
import { API_CONFIG } from './config';
import { toast } from '@/ui';
import { authApi } from '@/api';

export const api = axios.create({ baseURL: API_CONFIG.baseUrl });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !!useAuthStore.getState().accessToken) {
      originalRequest._retry = true;
      await authApi.refreshToken();
      const newToken = useAuthStore.getState().accessToken;
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }

    if (error.response?.status === 500) {
      toast.error("Сталася помилка на сервері. Спробуйте пізніше");
    }

    return Promise.reject(error);
  }
);
