import { api } from './client';
import { API_ENDPOINTS } from './endpoints';
import type {
  ApiResponse,
  UserDetail,
  GetUsersParams,
  PaginatedUsersResponse,
  RegisterUserRequest,
  RegisterUserResponse,
  UpdateUserRequest,
} from './contracts';

export type User = UserDetail;

export const userApi = {
  /**
   * Search and paginate users (GET /user)
   */
  async getUsers(params?: GetUsersParams) {
    return api.get<ApiResponse<PaginatedUsersResponse>>(
      API_ENDPOINTS.USER.ROOT,
      {
        params,
      }
    );
  },

  /**
   * Retrieve single user by ID (GET /user/:id)
   */
  async getUserById(id: number | string) {
    return api.get<ApiResponse<UserDetail>>(API_ENDPOINTS.USER.BY_ID(id));
  },

  /**
   * Register a new user (POST /user)
   */
  async register(dto: RegisterUserRequest) {
    return api.post<ApiResponse<RegisterUserResponse>>(
      API_ENDPOINTS.USER.ROOT,
      dto
    );
  },

  /**
   * Update profile information of authenticated user (PUT /user)
   */
  async updateUser(dto: UpdateUserRequest) {
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
};
