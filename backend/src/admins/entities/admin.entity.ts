import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Admin as PrismaAdmin } from '@prisma/client';

export class Admin implements PrismaAdmin {
  @ApiProperty({
    description: 'Admin unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Admin first name',
    example: 'Carlos',
  })
  firstName: string;

  @ApiProperty({
    description: 'Admin last name',
    example: 'Martinez',
  })
  lastName: string;

  @ApiProperty({
    description: 'Admin email address',
    example: 'carlos.martinez@example.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'Admin phone number',
    example: '+1234567890',
  })
  phone: string | null;

  @ApiPropertyOptional({
    description: 'Admin biography',
    example: 'System administrator with expertise in educational platforms',
  })
  bio: string | null;

  @ApiPropertyOptional({
    description: 'Admin avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  avatar: string | null;

  @ApiProperty({
    description: 'Whether the admin is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'User ID associated with the admin',
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
