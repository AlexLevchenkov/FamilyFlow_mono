import { useQuery } from '@tanstack/react-query';
import { eventApi, eventKeys } from '@features/event';
import type { GetEventsParams } from '@types';

export function useEventsQuery(params?: GetEventsParams) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: eventKeys.list(params),
    queryFn: () => eventApi.getEvents(params),
    staleTime: 5 * 60 * 1000,
  });

  return {
    events: data?.data,
    pagination: data?.pagination,
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}

