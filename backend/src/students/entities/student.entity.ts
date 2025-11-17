import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Student as PrismaStudent } from '@prisma/client';

export class Student implements PrismaStudent {
  @ApiProperty({
    description: 'Student unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Student first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'Student last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'Student email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'Student phone number',
    example: '+1234567890',
  })
  phone: string | null;

  @ApiPropertyOptional({
    description: 'Student biography',
    example: 'Passionate about learning English',
  })
  bio: string | null;

  @ApiPropertyOptional({
    description: 'Student avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  avatar: string | null;

  @ApiProperty({
    description: 'Whether the student is active',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'School ID the student belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  schoolId: string | null;

  @ApiProperty({
    description: 'User ID associated with the student',
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
