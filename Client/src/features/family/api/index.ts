import { API_ENDPOINTS, api } from '@api';
import type {
  AddMemberBody,
  ApiResponse,
  CreateFamilyBody,
  FamilyMemberModel,
  FamilyModel,
  UpdateFamilyBody,
  UpdateMemberRoleBody,
} from '@types';

export * from './familyKeys';

export const familyApi = {
  async myFamily() {
    const { data } = await api.get<ApiResponse<FamilyModel | null>>(
      API_ENDPOINTS.FAMILY.MY
    );
    return data.data;
  },

  async getFamilyById(id: number) {
    const { data } = await api.get<ApiResponse<FamilyModel>>(
      API_ENDPOINTS.FAMILY.BY_ID(id)
    );
    return data.data;
  },

  async createFamily(dto: CreateFamilyBody) {
    const { data } = await api.post<ApiResponse<FamilyModel>>(
      API_ENDPOINTS.FAMILY.ROOT,
      dto
    );
    return data.data;
  },

  async updateFamily(id: number, dto: UpdateFamilyBody) {
    const { data } = await api.put<ApiResponse<FamilyModel>>(
      API_ENDPOINTS.FAMILY.BY_ID(id),
      dto
    );
    return data.data;
  },

  async deleteFamily(id: number) {
    const { data } = await api.delete<ApiResponse<void>>(
      API_ENDPOINTS.FAMILY.BY_ID(id)
    );
    return data.data;
  },

  async getMembers(familyId: number) {
    const { data } = await api.get<ApiResponse<FamilyMemberModel[]>>(
      API_ENDPOINTS.FAMILY.MEMBERS.ROOT(familyId)
    );
    return data.data;
  },

  async addMember(familyId: number, dto: AddMemberBody) {
    const { data } = await api.post<ApiResponse<FamilyMemberModel>>(
      API_ENDPOINTS.FAMILY.MEMBERS.ROOT(familyId),
      dto
    );
    return data.data;
  },

  async updateMemberRole(
    familyId: number,
    memberId: number,
    dto: UpdateMemberRoleBody
  ) {
    const { data } = await api.put<ApiResponse<FamilyMemberModel>>(
      API_ENDPOINTS.FAMILY.MEMBERS.BY_ID(familyId, memberId),
      dto
    );
    return data.data;
  },

  async removeMember(familyId: number, memberId: number) {
    const { data } = await api.delete<ApiResponse<{ message: string }>>(
      API_ENDPOINTS.FAMILY.MEMBERS.BY_ID(familyId, memberId)
    );
    return data.data;
  },
};
