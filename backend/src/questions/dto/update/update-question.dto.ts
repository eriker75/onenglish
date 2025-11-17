import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsEnum,
  Matches,
  IsArray,
} from 'class-validator';
import { QuestionStage } from '@prisma/client';

export class UpdateQuestionDto {
  @ApiPropertyOptional({
    description: 'Question text',
    example: 'What is the name of this animal?',
  })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiPropertyOptional({
    description: 'Instructions for answering the question',
    example: 'Select the correct option that matches the image',
  })
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiPropertyOptional({
    description: 'Time limit in seconds',
    example: 60,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  timeLimit?: number;

  @ApiPropertyOptional({
    description: 'Maximum number of attempts allowed',
    example: 3,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxAttempts?: number;

  @ApiPropertyOptional({
    description:
      'Points awarded for correct answer (auto-calculated for questions with sub-questions)',
    example: 10,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  points?: number;

  @ApiPropertyOptional({
    description: 'Question stage',
    enum: QuestionStage,
    example: QuestionStage.VOCABULARY,
  })
  @IsOptional()
  @IsEnum(QuestionStage)
  stage?: QuestionStage;

  @ApiPropertyOptional({
    description: 'Phase identifier (e.g., "phase_1", "phase_2")',
    example: 'phase_1',
    pattern: '^phase_\\d+$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^phase_\d+$/, {
    message: 'Phase must follow format: phase_1, phase_2, etc.',
  })
  phase?: string;

  @ApiPropertyOptional({
    description: 'Position within the phase',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  position?: number;

  @ApiPropertyOptional({
    description: 'Question content (flexible JSON field)',
    example: {
      grid: [
        ['a', 'b'],
        ['c', 'd'],
      ],
    },
  })
  @IsOptional()
  content?: any;

  @ApiPropertyOptional({
    description: 'Answer options (for multiple choice questions)',
    example: ['cat', 'dog', 'bird', 'fish'],
  })
  @IsOptional()
  options?: any;

  @ApiPropertyOptional({
    description: 'Correct answer(s)',
    example: 'cat',
  })
  @IsOptional()
  answer?: any;
}

export class UpdateQuestionTextDto {
  @ApiPropertyOptional({
    description: 'New question text',
    example: 'What is the name of this animal?',
  })
  @IsString()
  text: string;
}

export class UpdateQuestionInstructionsDto {
  @ApiPropertyOptional({
    description: 'New instructions',
    example: 'Select the correct option',
  })
  @IsString()
  instructions: string;
}

export class UpdateQuestionTimeLimitDto {
  @ApiPropertyOptional({
    description: 'New time limit in seconds',
    example: 90,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  timeLimit: number;
}

export class UpdateQuestionPointsDto {
  @ApiPropertyOptional({
    description: 'New points value',
    example: 15,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  points: number;
}

export class UpdateQuestionPhaseDto {
  @ApiPropertyOptional({
    description: 'New phase identifier',
    example: 'phase_2',
    pattern: '^phase_\\d+$',
  })
  @IsString()
  @Matches(/^phase_\d+$/, {
    message: 'Phase must follow format: phase_1, phase_2, etc.',
  })
  phase: string;
}

export class BulkUpdateQuestionsDto {
  @ApiPropertyOptional({
    description: 'Array of question updates',
    example: [
      { questionId: 'uuid-1', data: { points: 10 } },
      { questionId: 'uuid-2', data: { timeLimit: 90 } },
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        questionId: { type: 'string' },
        data: { type: 'object' },
      },
    },
  })
  @IsArray()
  updates: Array<{ questionId: string; data: Partial<UpdateQuestionDto> }>;
}
