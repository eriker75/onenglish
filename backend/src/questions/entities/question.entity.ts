import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QuestionStage, ValidationMethod } from '@prisma/client';

export class Question {
  @ApiProperty({
    description: 'Question unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Challenge ID this question belongs to',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  challengeId: string;

  @ApiProperty({
    enum: QuestionStage,
    description: 'Question stage/category',
    example: 'VOCABULARY',
  })
  stage: QuestionStage;

  @ApiProperty({
    description: 'Position/order within the challenge',
    example: 1,
  })
  position: number;

  @ApiProperty({
    description: 'Question type',
    example: 'image_to_multiple_choices',
  })
  type: string;

  @ApiProperty({
    description: 'Points value for correct answer',
    example: 10,
  })
  points: number;

  @ApiProperty({
    description: 'Time limit in seconds',
    example: 45,
  })
  timeLimit: number;

  @ApiProperty({
    description: 'Maximum attempts allowed',
    example: 2,
  })
  maxAttempts: number;

  @ApiProperty({
    description: 'Question text/prompt',
    example: 'Match the image to the correct English word.',
  })
  text: string;

  @ApiProperty({
    description: 'Instructions for answering the question',
    example: 'Select the correct option that represents the image.',
  })
  instructions: string;

  @ApiProperty({
    enum: ValidationMethod,
    description: 'Validation method',
    example: 'AUTO',
  })
  validationMethod: ValidationMethod;

  @ApiPropertyOptional({
    description: 'Question content (flexible JSON structure)',
    example: { type: 'image', id: '550e8400-e29b-41d4-a716-446655440002' },
  })
  content?: any;

  @ApiPropertyOptional({
    description: 'Answer options (flexible JSON structure)',
    example: ['Apple', 'Orange', 'Grapes', 'Banana'],
  })
  options?: any;

  @ApiPropertyOptional({
    description: 'Expected answer (flexible JSON structure)',
    example: 'Apple',
  })
  answer?: any;

  @ApiPropertyOptional({
    description: 'Additional configuration (flexible JSON structure)',
    example: { gridWidth: 3, gridHeight: 3 },
  })
  configuration?: any;

  @ApiPropertyOptional({
    description: 'Parent question ID for sub-questions',
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  parentQuestionId?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}

