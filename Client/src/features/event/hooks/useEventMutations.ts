import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eventApi, eventKeys } from '@features/event/api';
import type { CreateEventBody, UpdateEventBody } from '@types';
import { toast } from '@ui';

export function useCreateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateEventBody) => eventApi.createEvent(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      toast.success('Подію успішно створено!');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        'Не вдалося створити подію';
      toast.error(message);
    },
  });
}

export function useUpdateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateEventBody }) =>
      eventApi.updateEvent(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      toast.success('Подію успішно оновлено!');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        'Не вдалося оновити подію';
      toast.error(message);
    },
  });
}

export function useDeleteEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eventApi.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.all });
      toast.success('Подію успішно видалено!');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        'Не вдалося видалити подію';
      toast.error(message);
    },
  });
}

