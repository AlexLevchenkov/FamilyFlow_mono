import { useMutation } from '@tanstack/react-query';
import { authApi, type LoginDto } from '@/api';
import type { ForgotPasswordData, RegistrationData } from '@/schemas';
import { useAuthStore } from '@store/auth';

export function useLogin() {
  return useMutation({
    mutationFn: (dto: LoginDto) => authApi.login(dto),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => authApi.logout(),
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
  })
}