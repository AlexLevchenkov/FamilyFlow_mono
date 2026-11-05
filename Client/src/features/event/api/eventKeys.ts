import type { GetEventsParams } from '@types';

export const eventKeys = {
  all: ['event'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (params?: GetEventsParams) => [...eventKeys.lists(), params] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: number) => [...eventKeys.details(), id] as const,
};

