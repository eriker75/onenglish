import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StudentAnswer {
  @ApiProperty({
    description: 'Student answer unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Student ID who answered',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  studentId: string;

  @ApiProperty({
    description: 'Question ID that was answered',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  questionId: string;

  @ApiProperty({
    description: 'Challenge ID this answer belongs to',
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  challengeId: string;

  @ApiProperty({
    description: 'User answer (flexible JSON structure)',
    example: 'Apple',
  })
  userAnswer: any;

  @ApiProperty({
    description: 'Whether the answer is correct',
    example: true,
  })
  isCorrect: boolean;

  @ApiProperty({
    description: 'Attempt number',
    example: 1,
  })
  attemptNumber: number;

  @ApiProperty({
    description: 'Time spent answering in seconds',
    example: 35,
  })
  timeSpent: number;

  @ApiProperty({
    description: 'Points earned for this answer',
    example: 10,
  })
  pointsEarned: number;

  @ApiPropertyOptional({
    description: 'AI feedback in English',
    example: 'Great job! Your answer is correct.',
  })
  feedbackEnglish?: string;

  @ApiPropertyOptional({
    description: 'AI feedback in Spanish',
    example: '¡Buen trabajo! Tu respuesta es correcta.',
  })
  feedbackSpanish?: string;

  @ApiPropertyOptional({
    description: 'Audio URL for speaking questions',
    example: 'https://example.com/audio/answer123.mp3',
  })
  audioUrl?: string;

  @ApiProperty({
    description: 'When the answer was submitted',
    example: '2024-01-15T10:30:00Z',
  })
  answeredAt: Date;

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

