import type {
  AddFamilyMemberRequest,
  ApiResponse,
  FamilyMemberModel,
  FamilyModel,
} from '@api/contracts';
import { API_ENDPOINTS } from './endpoints';
import { api } from './client';

export const familyApi = {
  async getFamily() {
    return api.get<ApiResponse<FamilyModel>>(API_ENDPOINTS.FAMILY.ROOT);
  },

  async addMember(dto: AddFamilyMemberRequest) {
    return api.post<ApiResponse<FamilyMemberModel>>(
      API_ENDPOINTS.FAMILY.MEMBERS,
      dto
    );
  },
};
