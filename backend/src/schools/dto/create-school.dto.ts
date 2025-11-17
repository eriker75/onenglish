import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSchoolDto {
  @ApiProperty({
    description: 'School name',
    example: 'U.E. Colegio Los Arcos',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name: string;

  @ApiProperty({
    description: 'Email address',
    example: 'contacto@colegiolosarcos.edu.ve',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+58424-1234567',
  })
  @IsString()
  @MaxLength(20)
  phone: string;

  @ApiProperty({
    description: 'City',
    example: 'Caracas',
  })
  @IsString()
  @MaxLength(100)
  city: string;

  @ApiProperty({
    description: 'State or province',
    example: 'Distrito Capital',
  })
  @IsString()
  @MaxLength(100)
  state: string;

  @ApiProperty({
    description: 'School type',
    example: 'public',
  })
  @IsString()
  @MaxLength(50)
  type: string;

  @ApiPropertyOptional({
    description: 'Website URL',
    example: 'https://www.colegiolosarcos.edu.ve',
  })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({
    description: 'School address',
    example: 'Av. Principal de Los Ruices',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  address?: string;

  @ApiPropertyOptional({
    description: 'Postal code',
    example: '1071',
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  postalCode?: string;

  @ApiPropertyOptional({
    description: 'School description',
    example: 'Institución educativa de excelencia',
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Whether the school is active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
