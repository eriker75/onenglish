import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, ValidateNested, ArrayMinSize, IsString, IsBoolean, IsOptional, IsInt, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import {
  FileSystemStoredFile,
  HasMimeType,
  IsFile,
  MaxFileSize,
} from 'nestjs-form-data';

export class PassageDto {
  @ApiProperty({
    required: false,
    example: 'image-url-or-id',
    description: 'Optional image ID or URL'
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    required: false,
    example:
      'Emma travels to school by bus every weekday. On weekends, she enjoys hiking with her friends in the hills.',
    description: 'Passage text content'
  })
  @IsOptional()
  @IsString()
  text?: string;
}

export class SubQuestionDto {
  @ApiProperty({
    example: 'Emma travels to school by bus every day.',
    description: 'Sub-question statement',
  })
  @IsString()
  content: string;

  @ApiProperty({
    type: [Boolean],
    example: [true, false],
    description: 'True/False options',
  })
  @IsArray()
  @IsBoolean({ each: true })
  options: [boolean, boolean];

  @ApiProperty({
    example: true,
    description: 'Correct answer (true or false)',
  })
  @IsBoolean()
  answer: boolean;

  @ApiProperty({
    example: 5,
    description: 'Points awarded for this sub-question',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  points: number;
}

export class CreateReadItDto extends BaseCreateQuestionWithoutStageDto {
  @ApiProperty({
    type: [PassageDto],
    description: 'Reading passages (can include images and/or text)',
    example: [
      {
        text: 'Emma travels to school by bus every weekday. On weekends, she enjoys hiking with her friends in the hills.',
      },
    ],
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PassageDto)
  content: PassageDto[];

  @ApiProperty({
    type: [SubQuestionDto],
    description: 'True/False sub-questions about the passage (parent points will be auto-calculated as sum of sub-question points)',
    example: [
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
    ],
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SubQuestionDto)
  subQuestions: SubQuestionDto[];

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
  media?: FileSystemStoredFile;
}

