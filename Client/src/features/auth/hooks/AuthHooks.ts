import { isAxiosError } from 'axios';
import { useMutation } from '@tanstack/react-query';
import { authApi, type LoginDto, type ResetPasswordDto } from '@api';
import type { ForgotPasswordData, RegistrationData } from '@schemas';
import { useAuthStore } from '@store/auth';

export function useLogin() {
  return useMutation({
    mutationFn: (dto: LoginDto) => authApi.login(dto),
  });
}

export function useLogout() {
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
    onSuccess: clearSession,
  });
}

export function useAuth() {
  return useAuthStore(state => state.isAuthenticated);
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (dto: ForgotPasswordData) => authApi.forgotPassword(dto),
  });
}

export function useRegistration() {
  return useMutation({
    mutationFn: (dto: RegistrationData) => authApi.registration(dto),
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (dto: ResetPasswordDto) => authApi.resetPassword(dto),
  });
}
