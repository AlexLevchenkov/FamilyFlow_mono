import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiErrorMessage } from '@api';
import { tasksApi, taskKeys } from '@features/tasks';
import type {
  CreateTaskBody,
  PaginatedTasksResponse,
  TaskModel,
  UpdateTaskBody,
} from '@types';
import { toast } from '@ui';

type TaskQueryData = TaskModel | PaginatedTasksResponse;

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateTaskBody) => tasksApi.createTask(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success('Справу успішно додано!');
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Не вдалося створити справу'));
    },
  });
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateTaskBody }) =>
      tasksApi.updateTask(id, dto),
    onMutate: async ({ id, dto }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all });

      const previousQueries = queryClient.getQueriesData<TaskQueryData>({
        queryKey: taskKeys.all,
      });

      queryClient.setQueriesData<TaskQueryData>(
        { queryKey: taskKeys.all },
        oldData => {
          if (!oldData) return oldData;
          if ('data' in oldData) {
            return {
              ...oldData,
              data: oldData.data.map(item =>
                item.id === id ? { ...item, ...dto } : item
              ),
            };
          }
          return oldData.id === id ? { ...oldData, ...dto } : oldData;
        }
      );

      return { previousQueries };
    },
    onError: (error: unknown, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(getApiErrorMessage(error, 'Не вдалося оновити справу'));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tasksApi.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success('Справу видалено');
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'Не вдалося видалити справу'));
    },
  });
}
