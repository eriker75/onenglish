import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsArray, IsEnum, ArrayMinSize, IsOptional } from 'class-validator';
import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import {
  FileSystemStoredFile,
  HasMimeType,
  IsFile,
  MaxFileSize,
} from 'nestjs-form-data';
import { VERB_TENSES } from '../../definitions/constants';

export class CreateTensesDto extends BaseCreateQuestionWithoutStageDto {
  @ApiProperty({
    example: 'She does her homework before dinner every day.',
    description: 'Sentence to identify tense from',
  })
  @IsString()
  content: string;

  @ApiProperty({
    enum: VERB_TENSES,
    isArray: true,
    example: [
      VERB_TENSES.FUTURE_CONTINUOUS,
      VERB_TENSES.PAST_CONTINUOUS,
      VERB_TENSES.PAST_PERFECT,
      VERB_TENSES.PRESENT_CONTINUOUS,
    ],
    description: 'Tense options for multiple choice',
  })
  @IsArray()
  @ArrayMinSize(2)
  @IsEnum(VERB_TENSES, { each: true })
  options: VERB_TENSES[];

  @ApiProperty({
    enum: VERB_TENSES,
    example: VERB_TENSES.PRESENT_SIMPLE,
    description: 'Correct tense',
  })
  @IsEnum(VERB_TENSES)
  answer: VERB_TENSES;

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

