import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsEnum, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionStage } from '@prisma/client';

/**
 * Base DTO for question creation without stage field
 * Used for question types that have a fixed stage (e.g., VOCABULARY)
 */
export class BaseCreateQuestionWithoutStageDto {
  @ApiProperty({
    description: 'Challenge ID',
    example: '507f1f77-bcf8-6cd7-9943-9101abcd1234',
  })
  @IsString()
  challengeId: string;

  @ApiProperty({
    description: 'Points value for correct answer',
    example: 10,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  points: number;

  @ApiPropertyOptional({
    description: 'Time limit in seconds',
    example: 60,
    default: 60,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  timeLimit: number = 60;

  @ApiPropertyOptional({
    description: 'Maximum attempts allowed',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  maxAttempts: number = 1;

  @ApiPropertyOptional({
    description:
      'Question text/prompt. If not provided, a default text will be assigned based on question type.',
    example: 'Match the image to the correct English word.',
  })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional({
    description:
      'Instructions for answering the question. If not provided, default instructions will be assigned based on question type.',
    example: 'Select the correct option that represents the image.',
  })
  @IsOptional()
  @IsString()
  instructions?: string;
}

/**
 * Base DTO for question creation with stage field
 * Used for question types that can have different stages
 */
export class BaseCreateQuestionDto extends BaseCreateQuestionWithoutStageDto {
  @ApiProperty({
    enum: QuestionStage,
    example: 'VOCABULARY',
    description: 'Question stage/category',
  })
  @IsEnum(QuestionStage)
  stage: QuestionStage;
}
