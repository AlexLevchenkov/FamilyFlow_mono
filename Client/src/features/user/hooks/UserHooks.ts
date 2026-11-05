import { useMutation } from '@tanstack/react-query';
import { userApi } from '@features/user';

export function useMe() {
  return useMutation({
    mutationFn: () => userApi.me(),
  });
}
