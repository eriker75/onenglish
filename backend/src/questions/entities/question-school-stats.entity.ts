import { ApiProperty } from '@nestjs/swagger';

export class QuestionSchoolStats {
  @ApiProperty({
    description: 'Stats entry unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Question ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  questionId: string;

  @ApiProperty({
    description: 'School ID',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  schoolId: string;

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

