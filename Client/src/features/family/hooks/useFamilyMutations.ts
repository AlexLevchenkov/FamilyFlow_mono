import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiErrorMessage } from '@api';
import { familyApi, familyKeys } from '../api';
import type {
  AddMemberBody,
  CreateFamilyBody,
  UpdateFamilyBody,
  UpdateMemberRoleBody,
} from '@types';
import { toast } from '@ui';

export function useCreateFamilyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateFamilyBody) => familyApi.createFamily(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyKeys.all });
      toast.success('Родину успішно створено!');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'Не вдалося створити родину');
      toast.error(message);
    },
  });
}

export function useUpdateFamilyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateFamilyBody }) =>
      familyApi.updateFamily(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyKeys.all });
      toast.success('Назву родини оновлено!');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'Не вдалося оновити родину');
      toast.error(message);
    },
  });
}

export function useDeleteFamilyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => familyApi.deleteFamily(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyKeys.all });
      toast.success('Родину видалено');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'Не вдалося видалити родину');
      toast.error(message);
    },
  });
}

export function useAddMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ familyId, dto }: { familyId: number; dto: AddMemberBody }) =>
      familyApi.addMember(familyId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyKeys.all });
      toast.success('Запрошення надіслано або учасника успішно додано!');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'Не вдалося додати учасника');
      toast.error(message);
    },
  });
}

export function useUpdateMemberRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      familyId,
      memberId,
      dto,
    }: {
      familyId: number;
      memberId: number;
      dto: UpdateMemberRoleBody;
    }) => familyApi.updateMemberRole(familyId, memberId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyKeys.all });
      toast.success('Роль учасника оновлено!');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'Не вдалося змінити роль');
      toast.error(message);
    },
  });
}

export function useRemoveMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      familyId,
      memberId,
    }: {
      familyId: number;
      memberId: number;
    }) => familyApi.removeMember(familyId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyKeys.all });
      toast.success('Учасника вилучено з родини');
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'Не вдалося вилучити учасника');
      toast.error(message);
    },
  });
}
