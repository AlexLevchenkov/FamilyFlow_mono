import { useQuery } from '@tanstack/react-query';
import { goalsApi, goalKeys } from '@features/goals';
import type { GetGoalsParams } from '@types';

export function useGoalsQuery(params?: GetGoalsParams) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: goalKeys.list(params),
    queryFn: () => goalsApi.getGoals(params),
    staleTime: 5 * 60 * 1000,
  });

  return {
    goals: data?.data,
    pagination: data?.pagination,
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}

