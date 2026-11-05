import { API_ENDPOINTS, api } from '@api';
import type { ApiResponse, EventModel, GetEventsParams } from '@types';

export const eventApi = {
  /**
   * Get events (GET /event)
   */
  async getEvents({ page = 1 }: GetEventsParams) {
    const { data } = await api.get<ApiResponse<EventModel[]>>(
      API_ENDPOINTS.EVENT.ROOT,
      {
        params: { page },
      }
    );

    return data.data;
  },
};
