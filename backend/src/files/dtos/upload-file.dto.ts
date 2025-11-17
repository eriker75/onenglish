import {
  IsFile,
  MaxFileSize,
  HasMimeType,
  FileSystemStoredFile,
} from 'nestjs-form-data';
import { ApiProperty } from '@nestjs/swagger';
import { getSupportedMimeTypes } from '../utils/file-type-detector.util';

export class UploadFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description:
      'File to upload. Type will be automatically detected from extension and MIME type. Supported types: image, voice, document, video',
    example: 'file.png',
  })
  @IsFile()
  @MaxFileSize(50 * 1024 * 1024) // 50MB max
  @HasMimeType(getSupportedMimeTypes())
  file: FileSystemStoredFile;
}
