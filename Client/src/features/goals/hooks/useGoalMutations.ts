import { useMutation, useQueryClient } from '@tanstack/react-query';
import { goalsApi, goalKeys } from '@features/goals/api';
import type { CreateGoalBody, UpdateGoalBody } from '@types';
import { toast } from '@ui';

export function useCreateGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateGoalBody) => goalsApi.createGoal(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
      toast.success('Ціль успішно створено!');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        'Не вдалося створити ціль';
      toast.error(message);
    },
  });
}

export function useUpdateGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateGoalBody }) =>
      goalsApi.updateGoal(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
      toast.success('Зміни успішно збережено!');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        'Не вдалося зберегти зміни';
      toast.error(message);
    },
  });
}

export function useDeleteGoalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => goalsApi.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all });
      toast.success('Ціль успішно видалено!');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        'Не вдалося видалити ціль';
      toast.error(message);
    },
  });
}
