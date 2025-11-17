import {
  IsFile,
  MaxFileSize,
  HasMimeType,
  FileSystemStoredFile,
} from 'nestjs-form-data';
import { IsString, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { getSupportedMimeTypes } from '../utils/file-type-detector.util';

export class UpdateFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description:
      'New file to replace the old one. Type will be automatically detected from extension and MIME type.',
    example: 'new-file.png',
  })
  @IsFile()
  @MaxFileSize(50 * 1024 * 1024) // 50MB max
  @HasMimeType(getSupportedMimeTypes())
  file: FileSystemStoredFile;

  @ApiProperty({
    description: 'ID of the existing file to replace',
    example: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
  })
  @IsUUID()
  @IsNotEmpty()
  fileId: string;
}
