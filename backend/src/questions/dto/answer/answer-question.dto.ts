import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsObject,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  IsFile,
  MaxFileSize,
  HasMimeType,
  FileSystemStoredFile,
} from 'nestjs-form-data';

/**
 * Base DTO for answering any question
 */
export class AnswerQuestionDto {
  @ApiProperty({
    description: "The student's answer to the question",
    example: 'cat',
    oneOf: [
      { type: 'string', example: 'cat' },
      { type: 'array', items: { type: 'string' }, example: ['going', 'to'] },
      {
        type: 'object',
        example: { 'sub-question-id-1': 'true', 'sub-question-id-2': 'false' },
      },
    ],
  })
  @IsNotEmpty()
  userAnswer: string | string[] | object;
}

/**
 * DTO for answering questions that require audio upload (speaking questions)
 */
export class AnswerAudioQuestionDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Audio file (mp3, wav, ogg, flac, m4a)',
  })
  @IsFile()
  @MaxFileSize(10 * 1024 * 1024) // 10MB max
  @HasMimeType([
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/flac',
    'audio/mp4',
  ])
  audio: FileSystemStoredFile;

  @ApiPropertyOptional({
    description: 'Time spent on the question in seconds',
    example: 120,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  timeSpent?: number;
}

/**
 * DTO for answering multiple choice questions
 */
export class AnswerMultipleChoiceDto {
  @ApiProperty({
    description: 'The selected option',
    example: 'cat',
  })
  @IsString()
  @IsNotEmpty()
  userAnswer: string;
}

/**
 * DTO for answering questions with multiple selections (e.g., tag_it)
 */
export class AnswerMultipleSelectionDto {
  @ApiProperty({
    description: 'Array of selected options',
    example: ['option1', 'option2'],
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  userAnswer: string[];
}

/**
 * DTO for answering text-based questions
 */
export class AnswerTextDto {
  @ApiProperty({
    description: 'Text answer from the student',
    example: 'The cat is on the table',
  })
  @IsString()
  @IsNotEmpty()
  userAnswer: string;
}

/**
 * DTO for answering questions with sub-questions (read_it, topic_based_audio)
 */
export class AnswerWithSubQuestionsDto {
  @ApiProperty({
    description: 'Object mapping sub-question IDs to their answers',
    example: {
      'sub-question-id-1': 'true',
      'sub-question-id-2': 'false',
      'sub-question-id-3': 'option_a',
    },
  })
  @IsObject()
  @IsNotEmpty()
  userAnswer: Record<string, string>;
}

/**
 * DTO for answering wordbox questions
 */
export class AnswerWordboxDto {
  @ApiProperty({
    description: 'Array of words formed by the student',
    example: ['cat', 'hat', 'bat'],
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  userAnswer: string[];

  @ApiPropertyOptional({
    description: 'Time spent on the question in seconds',
    example: 120,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  timeSpent?: number;
}

/**
 * DTO for answering word associations questions
 */
export class AnswerWordAssociationsDto {
  @ApiProperty({
    description: 'Array of associated words provided by the student',
    example: ['ocean', 'waves', 'sand', 'vacation'],
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  userAnswer: string[];

  @ApiPropertyOptional({
    description: 'Time spent on the question in seconds',
    example: 90,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  timeSpent?: number;
}
