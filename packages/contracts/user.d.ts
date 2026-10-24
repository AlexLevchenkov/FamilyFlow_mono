import { PaginatedResponse } from "./base";

export interface UserPublic {
  name: string | null;
  avatar: string | null;
}

export interface UserDetail {
  id: number;
  email: string;
  name: string | null;
  avatar: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetUsersParams {
  page?: number | string;
  partName?: string;
  partEmail?: string;
}

export type PaginatedUsersResponse = PaginatedResponse<UserPublic>;

export interface RegisterUserRequest {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  avatar?: string;
  userId: number;
}

export interface DeleteUserParams {
  userId: number;
}
