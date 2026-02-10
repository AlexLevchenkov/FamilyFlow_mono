export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IMode {
  mode: TMode
}
export type TMode = 'WEB' | 'MOBILE'