import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import {
  HasMimeType,
  IsFile,
  FileSystemStoredFile,
  MaxFileSize,
} from 'nestjs-form-data';
import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';

export class CreateTellMeAboutItDto extends BaseCreateQuestionWithoutStageDto {
  @ApiProperty({
    example: 'your first toy',
    description: 'Story prompt topic',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description:
      'Optional reference image for the story (image/jpeg, image/png, image/webp)',
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
