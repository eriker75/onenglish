export declare class RowErrorDto {
    row: number;
    error: string;
    data: Record<string, any>;
}
export declare class ImportResponseDto {
    success: boolean;
    totalRows: number;
    successCount: number;
    errorCount: number;
    errors: RowErrorDto[];
    message: string;
    processingTime: number;
}
