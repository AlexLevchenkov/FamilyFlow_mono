import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi, taskKeys } from '@features/tasks';
import type { CreateTaskBody, UpdateTaskBody } from '@types';
import { toast } from '@ui';

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateTaskBody) => tasksApi.createTask(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      toast.success('Справу успішно додано!');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        'Не вдалося створити справу';
      toast.error(message);
    },
  });
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateTaskBody }) =>
      tasksApi.updateTask(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        'Не вдалося оновити справу';
      toast.error(message);
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
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        'Не вдалося видалити справу';
      toast.error(message);
    },
  });
}
