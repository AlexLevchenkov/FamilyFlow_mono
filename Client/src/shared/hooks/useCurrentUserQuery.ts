import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth';
import { userApi } from '@features/user';
import { userKeys } from '@features/user/api/userKeys';

export function useCurrentUserQuery() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: userKeys.me(),
    queryFn: () => userApi.me(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    user: data,
    isLoading,
    isError,
    error,
    refetch,
  };
}
