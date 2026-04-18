import { useMutation } from '@tanstack/react-query';
import { authApi, type LoginDto } from '@api/index';
import { authStorage } from '@store/auth';

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
  return authStorage && !!authStorage.getAccessToken();
}
