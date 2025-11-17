import { ApiProperty } from '@nestjs/swagger';
import {
  IsFile,
  MaxFileSize,
  HasMimeType,
  FileSystemStoredFile,
} from 'nestjs-form-data';

export class ImportFileDto {
  @ApiProperty({
    description: 'CSV or Excel file to import (max 100MB). Supported formats: .csv, .xlsx, .xls',
    type: 'string',
    format: 'binary',
    required: true,
    example: 'file.csv or file.xlsx',
  })
  @IsFile()
  @MaxFileSize(100 * 1024 * 1024) // 100MB
  @HasMimeType([
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ])
  file: FileSystemStoredFile;
}

