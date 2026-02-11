import { useMutation } from '@tanstack/react-query';
import { authApi, LoginDto } from '@familyflow/common/api/index';
import { authStorage } from '@familyflow/common/store/auth';
import { TMode } from '@familyflow/common/types/auth';

export function useLogin(mode: TMode) {
  return useMutation({
    mutationFn: (dto: LoginDto) => authApi.login(dto, mode),
  });
}

export function useLogout(mode: TMode) {
  return useMutation({
    mutationFn: () => authApi.logout(mode),
  });
}

export function useAuth() {
  return authStorage && !!authStorage.getAccessToken();
}
