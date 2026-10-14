/**
 * Standard server response wrapper returned by apiResponse utility on the server
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  error?: string;
}

/**
 * Standard server pagination metadata
 */
export interface PaginationMeta {
  total: number;
  page: number | string;
  limit: number;
  totalPages: number;
}

/**
 * Standard paginated response structure
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
