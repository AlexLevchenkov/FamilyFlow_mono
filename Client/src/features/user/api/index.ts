import { API_ENDPOINTS } from '@api/endpoints';
import { api } from '@api/client';
import type {
  ApiResponse,
  UserDetail,
  GetUsersParams,
  PaginatedUsersResponse,
  RegisterUserBody,
  UserPublic,
  UpdateUserBody,
} from '@types';

export * from './userKeys';

export const userApi = {
  /**
   * Search and paginate users (GET /user)
   */
  async getUsers(params?: GetUsersParams) {
    return api.get<ApiResponse<PaginatedUsersResponse>>(
      API_ENDPOINTS.USER.ROOT,
      { params }
    );
  },

  /**
   * Retrieve single user by ID (GET /user/:id)
   */
  async getUserById(id: number) {
    return api.get<ApiResponse<UserDetail>>(API_ENDPOINTS.USER.BY_ID(id));
  },

  /**
   * Register a new user (POST /user)
   */
  async register(dto: RegisterUserBody) {
    return api.post<ApiResponse<UserPublic>>(API_ENDPOINTS.USER.ROOT, dto);
  },

  /**
   * Update profile information of authenticated user (PUT /user)
   */
  async updateUser(dto: UpdateUserBody) {
    return api.put<ApiResponse<UserDetail>>(API_ENDPOINTS.USER.ROOT, dto);
  },

  /**
   * Delete user by ID (DELETE /user?userId=...)
   */
  async deleteUser(userId: number) {
    return api.delete<ApiResponse<void>>(API_ENDPOINTS.USER.ROOT, {
      params: { userId },
    });
  },

  /**
   * Get current user (GET /user/me)
   */
  async me() {
    const { data } = await api.get<ApiResponse<UserPublic>>(
      API_ENDPOINTS.USER.ME
    );

    return data.data;
  },
};
