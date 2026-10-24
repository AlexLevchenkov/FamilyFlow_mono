export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  error?: string;
}

export interface PaginationMeta {
  total: number;
  page: number | string;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export type WithUserId<T> = T & { userId: number };

export interface GetById {
  id: number;
}

export interface DeleteById {
  id: number;
}
