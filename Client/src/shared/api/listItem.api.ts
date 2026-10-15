import { api } from './client';
import { API_ENDPOINTS } from './endpoints';
import type {
  ApiResponse,
  ListItemModel,
  GetListItemsParams,
  PaginatedListItemsResponse,
  CreateListItemRequest,
  UpdateListItemRequest,
} from './contracts';

export const listItemApi = {
  /**
   * Get all items belonging to a list with pagination (GET /listItem?listId=...&page=...)
   */
  async getListItems(params: GetListItemsParams) {
    return api.get<ApiResponse<PaginatedListItemsResponse>>(
      API_ENDPOINTS.LIST_ITEM.ROOT,
      {
        params,
      }
    );
  },

  /**
   * Get a single list item by ID (GET /listItem/:id)
   */
  async getListItemById(id: number | string) {
    return api.get<ApiResponse<ListItemModel>>(
      API_ENDPOINTS.LIST_ITEM.BY_ID(id)
    );
  },

  /**
   * Create a new item in a list (POST /listItem)
   */
  async createListItem(dto: CreateListItemRequest) {
    return api.post<ApiResponse<ListItemModel>>(
      API_ENDPOINTS.LIST_ITEM.ROOT,
      dto
    );
  },

  /**
   * Update an existing list item (PUT /listItem/:id)
   */
  async updateListItem(id: number | string, dto: UpdateListItemRequest) {
    return api.put<ApiResponse<ListItemModel>>(
      API_ENDPOINTS.LIST_ITEM.BY_ID(id),
      dto
    );
  },

  /**
   * Delete a list item by ID (DELETE /listItem/:id)
   */
  async deleteListItem(id: number | string) {
    return api.delete<ApiResponse<void>>(API_ENDPOINTS.LIST_ITEM.BY_ID(id));
  },
};
