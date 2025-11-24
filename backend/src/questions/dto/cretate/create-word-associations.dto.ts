import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  FileSystemStoredFile,
  HasMimeType,
  IsFile,
  MaxFileSize,
} from 'nestjs-form-data';
import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';

export class CreateWordAssociationsDto extends BaseCreateQuestionWithoutStageDto {
  @ApiProperty({
    example: 'Journey',
    description: 'Target word for associations',
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: 10,
    default: 10,
    description: 'Maximum number of word associations the student needs to provide (used for scoring)',
    minimum: 1,
    maximum: 50,
    required: true,
  })
  @IsInt()
  @Min(1, { message: 'Max associations must be at least 1' })
  @Max(50, { message: 'Max associations cannot exceed 50' })
  @Type(() => Number)
  maxAssociations: number;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    required: false,
    description:
      'Optional reference image for the associations (image/jpeg, image/png, image/webp, image/svg+xml, image/gif, image/avif)',
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

