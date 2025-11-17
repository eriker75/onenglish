import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Coordinator as PrismaCoordinator } from '@prisma/client';

export class Coordinator implements PrismaCoordinator {
  @ApiProperty({
    description: 'Coordinator unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Coordinator first name',
    example: 'Maria',
  })
  firstName: string;

  @ApiProperty({
    description: 'Coordinator last name',
    example: 'Rodriguez',
  })
  lastName: string;

  @ApiProperty({
    description: 'Coordinator email address',
    example: 'maria.rodriguez@example.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'Coordinator phone number',
    example: '+1234567890',
  })
  phone: string | null;

  @ApiPropertyOptional({
    description: 'Coordinator biography',
    example: 'Academic coordinator with 15 years of experience',
  })
  bio: string | null;

  @ApiPropertyOptional({
    description: 'Coordinator avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  avatar: string | null;

  @ApiProperty({
    description: 'Whether the coordinator is active',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'School ID the coordinator belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  schoolId: string | null;

  @ApiProperty({
    description: 'User ID associated with the coordinator',
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
