import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsUUID,
  IsBoolean,
  IsUrl,
} from 'class-validator';

export class CreateCoordinatorDto {
  @ApiProperty({
    description: 'Coordinator first name',
    example: 'Maria',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName: string;

  @ApiProperty({
    description: 'Coordinator last name',
    example: 'Rodriguez',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName: string;

  @ApiProperty({
    description: 'Coordinator email address',
    example: 'maria.rodriguez@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User ID to associate with the coordinator',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({
    description: 'Username for login',
    example: 'mariarodriguez',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username?: string;

  @ApiPropertyOptional({
    description: 'Password for login (minimum 6 characters)',
    example: 'SecurePass123',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password?: string;

  @ApiPropertyOptional({
    description: 'Coordinator phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({
    description: 'Coordinator avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Coordinator biography',
    example: 'Academic coordinator with 15 years of experience',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @ApiProperty({
    description: 'School ID the coordinator belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  schoolId: string;

  @ApiPropertyOptional({
    description: 'Whether the coordinator is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
