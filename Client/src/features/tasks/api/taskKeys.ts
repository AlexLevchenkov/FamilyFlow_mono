import type { GetUserTasksParams } from '@types';

export const taskKeys = {
  all: ['task'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (params?: GetUserTasksParams) => [...taskKeys.lists(), params] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: number) => [...taskKeys.details(), id] as const,
};

