import { ApiProperty } from '@nestjs/swagger';

export class RowErrorDto {
  @ApiProperty({
    description: 'Row number where the error occurred',
    example: 5,
  })
  row: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Invalid email format',
  })
  error: string;

  @ApiProperty({
    description: 'Row data that caused the error',
    example: { firstName: 'John', email: 'invalid-email' },
  })
  data: Record<string, any>;
}

export class ImportResponseDto {
  @ApiProperty({
    description: 'Whether the import was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Total number of rows processed',
    example: 100,
  })
  totalRows: number;

  @ApiProperty({
    description: 'Number of rows successfully imported',
    example: 95,
  })
  successCount: number;

  @ApiProperty({
    description: 'Number of rows that failed to import',
    example: 5,
  })
  errorCount: number;

  @ApiProperty({
    description: 'List of errors encountered during import',
    type: [RowErrorDto],
  })
  errors: RowErrorDto[];

  @ApiProperty({
    description: 'Additional message about the import',
    example: 'Import completed with 5 errors',
  })
  message: string;

  @ApiProperty({
    description: 'Processing time in milliseconds',
    example: 1234,
  })
  processingTime: number;
}

