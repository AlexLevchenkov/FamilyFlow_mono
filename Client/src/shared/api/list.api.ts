import { api } from './client';
import { API_ENDPOINTS } from './endpoints';
import type {
  ApiResponse,
  ListModel,
  SharedListModel,
  GetUserListsParams,
  PaginatedListsResponse,
  CreateListRequest,
  UpdateListRequest,
  ShareListRequest,
  RemoveSharingListParams,
} from './contracts';

export const listApi = {
  /**
   * Get all lists for the authenticated user with pagination (GET /list)
   */
  async getUserLists(params?: GetUserListsParams) {
    return api.get<ApiResponse<PaginatedListsResponse>>(API_ENDPOINTS.LIST.ROOT, {
      params,
    });
  },

  /**
   * Get a specific list by ID (GET /list/:id)
   */
  async getListById(id: number | string) {
    return api.get<ApiResponse<ListModel>>(API_ENDPOINTS.LIST.BY_ID(id));
  },

  /**
   * Create a new list (POST /list)
   */
  async createList(dto: CreateListRequest) {
    return api.post<ApiResponse<ListModel>>(API_ENDPOINTS.LIST.ROOT, dto);
  },

  /**
   * Update list title, type, color or icon (PUT /list/:id)
   */
  async updateList(id: number | string, dto: UpdateListRequest) {
    return api.put<ApiResponse<ListModel>>(API_ENDPOINTS.LIST.BY_ID(id), dto);
  },

  /**
   * Delete a list by ID (DELETE /list/:id)
   */
  async deleteList(id: number | string) {
    return api.delete<ApiResponse<void>>(API_ENDPOINTS.LIST.BY_ID(id));
  },

  /**
   * Share a list with another user (POST /list/share)
   */
  async shareList(dto: ShareListRequest) {
    return api.post<ApiResponse<SharedListModel>>(API_ENDPOINTS.LIST.SHARE, dto);
  },

  /**
   * Remove shared access from a list (DELETE /list/share?listId=...&ownerId=...&recipientId=...)
   */
  async removeSharingList(params: RemoveSharingListParams) {
    return api.delete<ApiResponse<void>>(API_ENDPOINTS.LIST.SHARE, {
      params,
    });
  },
};
