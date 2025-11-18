import { ApiProperty } from '@nestjs/swagger';
import { QuestionStage, ValidationMethod } from '@prisma/client';

/**
 * Response DTO for debate questions
 */
export class DebateResponseDto {
  @ApiProperty({
    description: 'Question unique identifier',
    example: 'ee6d6331-e681-4a50-a607-19f9b7ffbdd1',
  })
  id: string;

  @ApiProperty({
    description: 'Question type',
    example: 'debate',
  })
  type: string;

  @ApiProperty({
    description: 'Question stage',
    enum: QuestionStage,
    example: QuestionStage.SPEAKING,
  })
  stage: QuestionStage;

  @ApiProperty({
    description: 'Phase identifier',
    example: 'phase_3',
  })
  phase: string;

  @ApiProperty({
    description: 'Position within phase',
    example: 1,
  })
  position: number;

  @ApiProperty({
    description: 'Points awarded for correct answer',
    example: 20,
  })
  points: number;

  @ApiProperty({
    description: 'Time limit in seconds',
    example: 240,
  })
  timeLimit: number;

  @ApiProperty({
    description: 'Maximum attempts allowed',
    example: 1,
  })
  maxAttempts: number;

  @ApiProperty({
    description: 'Question text',
    example: 'Defend or oppose the provided statement.',
  })
  text: string;

  @ApiProperty({
    description: 'Instructions for answering',
    example: 'Record an audio argument supporting or opposing the viewpoint.',
  })
  instructions: string;

  @ApiProperty({
    description: 'Validation method',
    enum: ValidationMethod,
    example: ValidationMethod.IA,
  })
  validationMethod: ValidationMethod;

  @ApiProperty({
    description: 'Debate topic/statement',
    example: 'Bubble gum',
  })
  topic: string;

  @ApiProperty({
    description: 'Minimum duration in seconds for the audio response',
    example: 90,
  })
  minDuration: number;

  @ApiProperty({
    description: 'Student stance for the debate',
    example: 'support',
    enum: ['support', 'oppose'],
  })
  stance: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-11-18T17:06:42.875Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-11-18T17:06:42.875Z',
  })
  updatedAt: Date;
}
