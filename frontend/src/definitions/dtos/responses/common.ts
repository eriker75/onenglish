/**
 * Generic paginated response structure matching backend PaginatedResponseDto
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Generic API response structure
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

/**
 * Error response structure
 */
export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode: number;
}
