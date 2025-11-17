export interface RowError {
  row: number;
  error: string;
  data: Record<string, any>;
}

export interface ImportResult {
  success: boolean;
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: RowError[];
  message: string;
  processingTime: number;
}

