import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import {
  FileSystemStoredFile,
  HasMimeType,
  IsFile,
  MaxFileSize,
} from 'nestjs-form-data';

export class CreateReadItDto extends BaseCreateQuestionWithoutStageDto {
  @ApiProperty({
    type: String,
    description: 'Reading passage text content',
    example: 'Emma travels to school by bus every weekday. On weekends, she enjoys hiking with her friends in the hills.',
  })
  @IsString()
  content: string;

  @ApiProperty({
    type: String,
    description: 'JSON string array of sub-questions. Each sub-question must have: content (string), options ([true, false]), answer (boolean), points (number)',
    example: JSON.stringify([
      {
        content: 'Emma travels to school by bus every day.',
        options: [true, false],
        answer: true,
        points: 5,
      },
      {
        content: 'She hikes alone on weekends.',
        options: [true, false],
        answer: false,
        points: 5,
      },
    ]),
  })
  @IsString()
  subQuestions: string;

  @ApiPropertyOptional({
    description: 'Parent question ID for sub-questions',
    example: '507f1f77-bcf8-6cd7-9943-9101abcd5678',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return value;
  })
  parentQuestionId?: string;

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

