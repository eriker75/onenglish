import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, ArrayMinSize, IsOptional } from 'class-validator';
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
  @IsArray()
  @ArrayMinSize(2)
  content: string[];

  @ApiProperty({
    type: [String],
    example: ["isn't he?", 'is not he?'],
    description: 'Acceptable answers for the tag',
  })
  @IsArray()
  @ArrayMinSize(1)
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
  media?: FileSystemStoredFile;
}

