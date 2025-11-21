import { PaginatedResponse } from "@/src/definitions/dtos/responses";

/**
 * Calculate pagination offset from page number
 */
export const getOffsetFromPage = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

/**
 * Calculate page number from offset
 */
export const getPageFromOffset = (offset: number, limit: number): number => {
  return Math.floor(offset / limit) + 1;
};

/**
 * Check if pagination data is empty
 */
export const isPaginationEmpty = <T>(
  data: PaginatedResponse<T> | undefined
): boolean => {
  return !data || data.data.length === 0;
};

/**
 * Get pagination info as text
 */
export const getPaginationText = <T>(
  data: PaginatedResponse<T> | undefined
): string => {
  if (!data) return "No data";
  
  const start = data.offset + 1;
  const end = Math.min(data.offset + data.limit, data.total);
  
  return `Showing ${start}-${end} of ${data.total}`;
};

/**
 * Get pagination range for display
 */
export const getPaginationRange = (
  currentPage: number,
  totalPages: number,
  maxPages: number = 5
): number[] => {
  const pages: number[] = [];
  
  let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
  let endPage = Math.min(totalPages, startPage + maxPages - 1);
  
  if (endPage - startPage + 1 < maxPages) {
    startPage = Math.max(1, endPage - maxPages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return pages;
};

/**
 * Create pagination query params
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export const createPaginationParams = (
  params: PaginationParams
): { limit: number; offset: number } => {
  const page = params.page || 1;
  const limit = params.limit || 10;
  
  return {
    limit,
    offset: getOffsetFromPage(page, limit),
  };
};
