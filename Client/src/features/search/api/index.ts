import { API_ENDPOINTS, api } from '@api';
import type {
  ApiResponse,
  GlobalSearchParams,
  GlobalSearchResponse,
} from '@types';

export * from './searchKeys';

export const searchApi = {
  async search(params: GlobalSearchParams, signal?: AbortSignal) {
    const { data } = await api.get<ApiResponse<GlobalSearchResponse>>(
      API_ENDPOINTS.SEARCH.ROOT,
      { params, signal }
    );

    return data.data;
  },
};
