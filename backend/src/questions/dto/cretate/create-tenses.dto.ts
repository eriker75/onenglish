import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsArray, IsEnum, ArrayMinSize, IsOptional } from 'class-validator';
import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import {
  FileSystemStoredFile,
  HasMimeType,
  IsFile,
  MaxFileSize,
} from 'nestjs-form-data';

enum ValidTenses {
  PRESENT_SIMPLE = 'present_simple',
  PAST_SIMPLE = 'past_simple',
  FUTURE_SIMPLE = 'future_simple',
  PRESENT_CONTINUOUS = 'present_continuous',
  PAST_CONTINUOUS = 'past_continuous',
  FUTURE_CONTINUOUS = 'future_continuous',
  PRESENT_PERFECT = 'present_perfect',
  PAST_PERFECT = 'past_perfect',
  FUTURE_PERFECT = 'future_perfect',
}

export class CreateTensesDto extends BaseCreateQuestionWithoutStageDto {
  @ApiProperty({
    example: 'She does her homework before dinner every day.',
    description: 'Sentence to identify tense from',
  })
  @IsString()
  content: string;

  @ApiProperty({
    enum: ValidTenses,
    isArray: true,
    example: [
      ValidTenses.FUTURE_CONTINUOUS,
      ValidTenses.PAST_CONTINUOUS,
      ValidTenses.PAST_PERFECT,
      ValidTenses.PRESENT_CONTINUOUS,
    ],
    description: 'Tense options for multiple choice',
  })
  @IsArray()
  @ArrayMinSize(2)
  @IsEnum(ValidTenses, { each: true })
  options: ValidTenses[];

  @ApiProperty({
    enum: ValidTenses,
    example: ValidTenses.PRESENT_SIMPLE,
    description: 'Correct tense',
  })
  @IsEnum(ValidTenses)
  answer: ValidTenses;

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

