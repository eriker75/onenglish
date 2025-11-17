import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Teacher as PrismaTeacher } from '@prisma/client';

export class Teacher implements PrismaTeacher {
  @ApiProperty({
    description: 'Teacher unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Teacher first name',
    example: 'Jane',
  })
  firstName: string;

  @ApiProperty({
    description: 'Teacher last name',
    example: 'Smith',
  })
  lastName: string;

  @ApiProperty({
    description: 'Teacher email address',
    example: 'jane.smith@example.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'Teacher phone number',
    example: '+1234567890',
  })
  phone: string | null;

  @ApiPropertyOptional({
    description: 'Teacher biography',
    example: 'Experienced English teacher with 10 years of experience',
  })
  bio: string | null;

  @ApiPropertyOptional({
    description: 'Teacher avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  avatar: string | null;

  @ApiProperty({
    description: 'Whether the teacher is active',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'School ID the teacher belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  schoolId: string | null;

  @ApiProperty({
    description: 'User ID associated with the teacher',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
