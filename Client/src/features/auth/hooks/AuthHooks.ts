import { isAxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  ForgotPasswordBody,
  LoginBody,
  RegisterUserBody,
  ResetPasswordBody,
} from '@types';
import { authApi, useAuthStore } from '@features/auth';

export function useLogin() {
  return useMutation({
    mutationFn: (dto: LoginBody) => authApi.login(dto),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const clearSession = useAuthStore(state => state.logout);

  return useMutation({
    mutationFn: async () => {
      try {
        return await authApi.logout();
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 401) {
          return undefined;
        }
        throw error;
      }
    },
    onSuccess: () => {
      clearSession();
      queryClient.clear();
    },
  });
}

export function useAuth() {
  return useAuthStore(state => state.isAuthenticated);
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (dto: ForgotPasswordBody) => authApi.forgotPassword(dto),
  });
}

export function useRegistration() {
  return useMutation({
    mutationFn: (dto: RegisterUserBody) => authApi.registration(dto),
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (dto: ResetPasswordBody) => authApi.resetPassword(dto),
  });
}
