import { API_ENDPOINTS, api } from '@api';
import type { ApiResponse, FamilyModel } from '@types';

export * from './familyKeys';

export const familyApi = {
  async myFamily() {
    const { data } = await api.get<ApiResponse<FamilyModel | null>>(
      API_ENDPOINTS.FAMILY.MY
    );

    return data.data;
  },
};
