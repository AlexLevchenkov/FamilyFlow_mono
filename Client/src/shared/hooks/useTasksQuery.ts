import { useQuery } from '@tanstack/react-query';
import { tasksApi, taskKeys } from '@features/tasks';
import type { GetUserTasksParams } from '@types';

export function useTasksQuery(params?: GetUserTasksParams) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: taskKeys.list(params),
    queryFn: () => tasksApi.getTasks(params),
    staleTime: 5 * 60 * 1000,
  });

  return {
    tasks: data?.data,
    pagination: data?.pagination,
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}

