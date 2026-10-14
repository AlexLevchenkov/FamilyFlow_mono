import type { PaginatedResponse } from './common.contract';

/**
 * Public profile data of a user
 */
export interface UserPublic {
  name: string | null;
  avatar: string | null;
}

/** Alias for backward compatibility */
export type IUser = UserPublic;

/**
 * Complete user record returned by server /user/:id and update endpoints
 */
export interface UserDetail {
  id: number;
  email: string;
  name: string | null;
  avatar: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Query parameters for GET /user
 */
export interface GetUsersParams {
  page?: number | string;
  partName?: string;
  partEmail?: string;
}

/**
 * Paginated users response from GET /user
 */
export type PaginatedUsersResponse = PaginatedResponse<UserPublic>;

/**
 * Body payload for POST /user (User Registration)
 */
export interface RegisterUserRequest {
  email: string;
  password: string;
  name: string;
}

/**
 * Response payload for POST /user
 */
export type RegisterUserResponse = UserPublic;

/**
 * Body payload for PUT /user
 */
export interface UpdateUserRequest {
  email?: string;
  name?: string;
  avatar?: string;
  userId?: number;
}

/**
 * Query parameter for DELETE /user
 */
export interface DeleteUserParams {
  userId: number;
}
