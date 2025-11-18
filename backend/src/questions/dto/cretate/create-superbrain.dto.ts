import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import {
  HasMimeType,
  IsFile,
  FileSystemStoredFile,
  MaxFileSize,
} from 'nestjs-form-data';
import { BaseCreateQuestionDto } from './base-question.dto';

export class CreateSuperbrainDto extends BaseCreateQuestionDto {
  @ApiProperty({
    example: 'What do bees make?',
    description: 'Question prompt for audio response',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description:
      'Optional reference image for the question (image/jpeg, image/png, image/webp)',
  })
  @IsOptional()
  @IsFile()
  @MaxFileSize(5e6) // 5MB
  @HasMimeType([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'image/avif',
  ])
  media?: FileSystemStoredFile;
}
