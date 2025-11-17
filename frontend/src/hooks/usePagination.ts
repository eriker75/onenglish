import { useState, useMemo } from 'react';
import { PaginatedResponse } from '@/src/definitions/dtos/responses';
import { getOffsetFromPage, getPaginationRange } from '@/src/utils/pagination';

interface UsePaginationProps {
  initialPage?: number;
  initialLimit?: number;
}

interface UsePaginationReturn {
  page: number;
  limit: number;
  offset: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: (totalPages: number) => void;
  canGoPrevious: boolean;
  canGoNext: (totalPages: number) => boolean;
  getQueryParams: () => { limit: number; offset: number };
  getPaginationInfo: <T>(data: PaginatedResponse<T> | undefined) => {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    total: number;
    showing: string;
  } | null;
}

export const usePagination = ({
  initialPage = 1,
  initialLimit = 10,
}: UsePaginationProps = {}): UsePaginationReturn => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const offset = useMemo(() => getOffsetFromPage(page, limit), [page, limit]);

  const canGoPrevious = page > 1;

  const canGoNext = (totalPages: number) => page < totalPages;

  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const goToFirstPage = () => {
    setPage(1);
  };

  const goToLastPage = (totalPages: number) => {
    setPage(totalPages);
  };

  const getQueryParams = () => ({
    limit,
    offset,
  });

  const getPaginationInfo = <T,>(data: PaginatedResponse<T> | undefined) => {
    if (!data) return null;

    const start = data.offset + 1;
    const end = Math.min(data.offset + data.limit, data.total);

    return {
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      hasNextPage: data.hasNextPage,
      hasPreviousPage: data.hasPreviousPage,
      total: data.total,
      showing: `${start}-${end} of ${data.total}`,
    };
  };

  return {
    page,
    limit,
    offset,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    canGoPrevious,
    canGoNext,
    getQueryParams,
    getPaginationInfo,
  };
};
