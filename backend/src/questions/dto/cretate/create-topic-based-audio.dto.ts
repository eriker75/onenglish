import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  ArrayMinSize,
  IsInt,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import {
  FileSystemStoredFile,
  HasMimeType,
  IsFile,
  MaxFileSize,
} from 'nestjs-form-data';

export class AudioSubQuestionDto {
  @ApiProperty({
    example: 'What is the main topic discussed in the audio?',
    description: 'Sub-question text',
  })
  @IsString()
  text: string;

  @ApiProperty({
    example: 8,
    minimum: 0,
    description: 'Points for this sub-question',
  })
  @IsInt()
  @Min(0)
  points: number;

  @ApiProperty({
    type: [String],
    description: 'Answer options for this sub-question',
    example: [
      'Travel plans',
      'Business meeting',
      'Weather forecast',
      'Sports event',
    ],
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
  options: string[];

  @ApiProperty({
    example: 'Business meeting',
    description: 'Correct answer (must match one of the options)',
  })
  @IsString()
  answer: string;
}

export class CreateTopicBasedAudioDto extends OmitType(BaseCreateQuestionWithoutStageDto, [
  'points',
] as const) {
  @ApiPropertyOptional({
    description:
      'Points value - Auto-calculated from sub-questions sum. If provided, it will be overwritten.',
    example: 0,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => (value === '' ? undefined : value))
  points?: number;

  @IsFile()
  @MaxFileSize(10e6) // 10MB
  @HasMimeType(['audio/mpeg', 'audio/wav', 'audio/ogg'])
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Audio file for the topic',
  })
  audio: FileSystemStoredFile;

  @ApiProperty({
    type: String,
    description: 'JSON string array of sub-questions',
    example: JSON.stringify([
      {
        text: 'What is the main topic discussed in the audio?',
        points: 8,
        options: [
          'Travel plans',
          'Business meeting',
          'Weather forecast',
          'Sports event',
        ],
        answer: 'Business meeting',
      },
      {
        text: 'When will the meeting take place?',
        points: 8,
        options: [
          'Monday morning',
          'Tuesday afternoon',
          'Wednesday evening',
          'Thursday night',
        ],
        answer: 'Monday morning',
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
}
