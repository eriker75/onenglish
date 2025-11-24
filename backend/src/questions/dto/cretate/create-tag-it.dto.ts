import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, ArrayMinSize, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import {
  FileSystemStoredFile,
  HasMimeType,
  IsFile,
  MaxFileSize,
} from 'nestjs-form-data';

export class CreateTagItDto extends BaseCreateQuestionWithoutStageDto {
  @ApiProperty({
    type: [String],
    example: ['He is responsible for the project,', '?'],
    description: 'Sentence parts with missing tag',
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        // Try parsing as JSON array first
        return JSON.parse(value);
      } catch {
        // Fall back to comma-separated string
        return value.split(',').map((item) => item.trim());
      }
    }
    return value;
  })
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  content: string[];

  @ApiProperty({
    type: [String],
    example: ["isn't he?", 'is not he?'],
    description: 'Acceptable answers for the tag',
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        // Try parsing as JSON array first
        return JSON.parse(value);
      } catch {
        // Fall back to comma-separated string
        return value.split(',').map((item) => item.trim());
      }
    }
    return value;
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  answer: string[];

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    required: false,
    description:
      'Optional reference image (PNG with transparency recommended) (image/jpeg, image/png, image/webp, image/svg+xml, image/gif, image/avif)',
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
  image?: FileSystemStoredFile;
}

