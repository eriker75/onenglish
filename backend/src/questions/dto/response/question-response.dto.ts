import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QuestionStage, ValidationMethod } from '@prisma/client';

/**
 * Base response DTO for all questions
 */
export class QuestionResponseDto {
  @ApiProperty({
    description: 'Question unique identifier',
    example: 'uuid-123',
  })
  id: string;

  @ApiProperty({
    description: 'Challenge ID this question belongs to',
    example: 'uuid-challenge-1',
  })
  challengeId: string;

  @ApiProperty({
    description: 'Question stage',
    enum: QuestionStage,
    example: QuestionStage.VOCABULARY,
  })
  stage: QuestionStage;

  @ApiProperty({
    description: 'Phase identifier',
    example: 'phase_1',
  })
  phase: string;

  @ApiProperty({
    description: 'Position within phase',
    example: 1,
  })
  position: number;

  @ApiProperty({
    description: 'Question type',
    example: 'image_to_multiple_choices',
  })
  type: string;

  @ApiProperty({
    description: 'Points awarded for correct answer',
    example: 10,
  })
  points: number;

  @ApiProperty({
    description: 'Time limit in seconds',
    example: 60,
  })
  timeLimit: number;

  @ApiProperty({
    description: 'Maximum attempts allowed',
    example: 3,
  })
  maxAttempts: number;

  @ApiProperty({
    description: 'Question text',
    example: 'What is the name of this animal?',
  })
  text: string;

  @ApiProperty({
    description: 'Instructions for answering',
    example: 'Select the correct option',
  })
  instructions: string;

  @ApiProperty({
    description: 'Validation method',
    enum: ValidationMethod,
    example: ValidationMethod.AUTO,
  })
  validationMethod: ValidationMethod;

  @ApiPropertyOptional({
    description: 'Flexible content field (structure varies by question type)',
  })
  content?: any;

  @ApiPropertyOptional({
    description: 'Answer options (for multiple choice questions)',
    example: ['cat', 'dog', 'bird', 'fish'],
  })
  options?: any;

  @ApiPropertyOptional({
    description: 'Parent question ID (if this is a sub-question)',
    example: 'uuid-parent-question',
  })
  parentQuestionId?: string;

  @ApiPropertyOptional({
    description: 'Sub-questions (if this question has them)',
    type: [QuestionResponseDto],
  })
  subQuestions?: QuestionResponseDto[];

  @ApiPropertyOptional({
    description: 'Media files attached to this question',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        type: { type: 'string', example: 'image' },
        url: { type: 'string', example: 'https://...' },
        filename: { type: 'string' },
        position: { type: 'number' },
        context: { type: 'string' },
      },
    },
  })
  media?: any[];

  @ApiPropertyOptional({
    description: 'Additional configurations (key-value pairs)',
    example: { gridWidth: '4', minWords: '50' },
  })
  configurations?: Record<string, string>;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-01-15T10:30:00Z',
  })
  updatedAt: Date;
}

/**
 * Response DTO for validation/answer submission
 */
export class ValidationResponseDto {
  @ApiProperty({
    description: 'Whether the operation was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Whether the answer is correct',
    example: true,
  })
  isCorrect: boolean;

  @ApiProperty({
    description: 'Points earned for this answer',
    example: 10,
  })
  pointsEarned: number;

  @ApiPropertyOptional({
    description: 'Feedback in English',
    example: 'Great job! Your answer is correct.',
  })
  feedbackEnglish?: string;

  @ApiPropertyOptional({
    description: 'Feedback in Spanish',
    example: '¡Buen trabajo! Tu respuesta es correcta.',
  })
  feedbackSpanish?: string;

  @ApiPropertyOptional({
    description: 'Additional validation details',
  })
  details?: any;

  @ApiProperty({
    description: 'Student answer record',
    type: 'object',
    properties: {
      id: { type: 'string' },
      questionId: { type: 'string' },
      studentId: { type: 'string' },
      isCorrect: { type: 'boolean' },
      pointsEarned: { type: 'number' },
      attemptNumber: { type: 'number' },
      timeSpent: { type: 'number' },
    },
  })
  studentAnswer: {
    id: string;
    questionId: string;
    studentId: string;
    isCorrect: boolean;
    pointsEarned: number;
    attemptNumber: number;
    timeSpent: number;
  };
}

/**
 * Response DTO for school statistics
 */
export class SchoolStatsResponseDto {
  @ApiProperty({
    description: 'Question ID',
    example: 'uuid-123',
  })
  questionId: string;

  @ApiProperty({
    description: 'Question text',
    example: 'What is the name of this animal?',
  })
  questionText: string;

  @ApiProperty({
    description: 'Question type',
    example: 'image_to_multiple_choices',
  })
  questionType: string;

  @ApiProperty({
    description: 'Total number of attempts',
    example: 150,
  })
  totalAttempts: number;

  @ApiProperty({
    description: 'Number of correct answers',
    example: 120,
  })
  correctAnswers: number;

  @ApiProperty({
    description: 'Average time spent in seconds',
    example: 45.5,
  })
  averageTime: number;

  @ApiProperty({
    description: 'Success rate percentage (0-100)',
    example: 80.0,
  })
  successRate: number;
}

/**
 * Response DTO for bulk operations
 */
export class BulkOperationResponseDto {
  @ApiProperty({
    description: 'Number of successful operations',
    example: 15,
  })
  successCount: number;

  @ApiProperty({
    description: 'Number of failed operations',
    example: 2,
  })
  failureCount: number;

  @ApiProperty({
    description: 'Total operations attempted',
    example: 17,
  })
  totalCount: number;

  @ApiPropertyOptional({
    description: 'List of errors for failed operations',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        questionId: { type: 'string' },
        error: { type: 'string' },
      },
    },
  })
  errors?: Array<{ questionId: string; error: string }>;

  @ApiProperty({
    description: 'Updated questions',
    type: [QuestionResponseDto],
  })
  results: QuestionResponseDto[];
}
