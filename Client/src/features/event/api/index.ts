import { API_ENDPOINTS, api } from '@api';
import type {
  ApiResponse,
  CreateEventBody,
  EventModel,
  GetEventsParams,
  PaginatedEventsResponse,
  UpdateEventBody,
} from '@types';

export * from './eventKeys';

export const eventApi = {
  /**
   * Search and paginate user events (GET /event)
   */
  async getEvents(params?: GetEventsParams) {
    const { data } = await api.get<ApiResponse<PaginatedEventsResponse>>(
      API_ENDPOINTS.EVENT.ROOT,
      { params }
    );

    return data.data;
  },

  /**
   * Retrieve single event by ID (GET /event/:id)
   */
  async getEventById(id: number) {
    const { data } = await api.get<ApiResponse<EventModel>>(
      API_ENDPOINTS.EVENT.BY_ID(id)
    );

    return data.data;
  },

  /**
   * Create a new event (POST /event)
   */
  async createEvent(dto: CreateEventBody) {
    const { data } = await api.post<ApiResponse<EventModel>>(
      API_ENDPOINTS.EVENT.ROOT,
      dto
    );

    return data.data;
  },

  /**
   * Update event by ID (PUT /event/:id)
   */
  async updateEvent(id: number, dto: UpdateEventBody) {
    const { data } = await api.put<ApiResponse<EventModel>>(
      API_ENDPOINTS.EVENT.BY_ID(id),
      dto
    );

    return data.data;
  },

  /**
   * Delete event by ID (DELETE /event/:id)
   */
  async deleteEvent(id: number) {
    const { data } = await api.delete<ApiResponse<void>>(
      API_ENDPOINTS.EVENT.BY_ID(id)
    );

    return data.data;
  },
};
