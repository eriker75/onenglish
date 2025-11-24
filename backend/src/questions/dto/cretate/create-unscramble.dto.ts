import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString, ArrayMinSize, IsOptional } from 'class-validator';
import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import {
  FileSystemStoredFile,
  HasMimeType,
  IsFile,
  MaxFileSize,
} from 'nestjs-form-data';

export class CreateUnscrambleDto extends BaseCreateQuestionWithoutStageDto {
  @ApiProperty({
    type: [String],
    example: ['book', 'read', 'I', 'every', 'night'],
    description: 'Scrambled words to reorder',
  })
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  content: string[];

  @ApiProperty({
    type: [String],
    example: ['I', 'read', 'book', 'every', 'night'],
    description: 'Correct word order',
  })
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  answer: string[];

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    required: false,
    description:
      'Optional reference image (image/jpeg, image/png, image/webp, image/svg+xml, image/gif, image/avif)',
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

