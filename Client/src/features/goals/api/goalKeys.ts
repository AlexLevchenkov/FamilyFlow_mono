import type { GetGoalsParams } from '@types';

export const goalKeys = {
  all: ['goal'] as const,
  lists: () => [...goalKeys.all, 'list'] as const,
  list: (params?: GetGoalsParams) => [...goalKeys.lists(), params] as const,
  details: () => [...goalKeys.all, 'detail'] as const,
  detail: (id: number) => [...goalKeys.details(), id] as const,
};

