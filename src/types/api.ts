export interface SuccessResponse<T = Record<string, unknown>> {
  success: true;
  message: string;
  data: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors: Record<string, string | string[]>;
}

export type ApiResponse<T = Record<string, unknown>> = SuccessResponse<T> | ErrorResponse;

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
