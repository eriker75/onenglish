export declare class PaginationDto {
    limit?: number;
    offset?: number;
}
export declare class PaginatedResponseDto<T> {
    data: T[];
    total: number;
    limit: number;
    offset: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    constructor(data: T[], total: number, limit: number, offset: number);
}
