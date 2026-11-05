import { useQuery } from '@tanstack/react-query';
import { familyApi, familyKeys } from '@features/family';

export function useFamilyQuery() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: familyKeys.my(),
    queryFn: () => familyApi.myFamily(),
    staleTime: 5 * 60 * 1000,
  });

  return {
    family: data,
    isLoading,
    isError,
    error,
    refetch,
  };
}
