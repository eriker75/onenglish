import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { School as PrismaSchool } from '@prisma/client';

export class School implements PrismaSchool {
  @ApiProperty({
    description: 'School unique identifier (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Sequential school ID (friendly identifier for searches and display)',
    example: 1,
  })
  schoolId: number;

  @ApiProperty({
    description: 'School name',
    example: 'U.E. Colegio Los Arcos',
  })
  name: string;

  @ApiProperty({
    description: 'Auto-generated school code (SCH0001, SCH0002, ..., SCH9999, SCH00001)',
    example: 'SCH0001',
  })
  code: string;

  @ApiProperty({
    description: 'School type',
    example: 'public',
  })
  type: string;

  @ApiProperty({
    description: 'Email address',
    example: 'contacto@colegiolosarcos.edu.ve',
  })
  email: string;

  @ApiProperty({
    description: 'Phone number',
    example: '+58424-1234567',
  })
  phone: string;

  @ApiProperty({
    description: 'City',
    example: 'Caracas',
  })
  city: string;

  @ApiProperty({
    description: 'State or province',
    example: 'Distrito Capital',
  })
  state: string;

  @ApiProperty({
    description: 'Country (defaults to Venezuela)',
    example: 'Venezuela',
  })
  country: string;

  @ApiPropertyOptional({
    description: 'School address',
    example: 'Av. Principal de Los Ruices',
  })
  address: string | null;

  @ApiPropertyOptional({
    description: 'Postal code',
    example: '1071',
  })
  postalCode: string | null;

  @ApiPropertyOptional({
    description: 'Website URL',
    example: 'https://www.colegiolosarcos.edu.ve',
  })
  website: string | null;

  @ApiPropertyOptional({
    description: 'School description',
    example: 'Institución educativa de excelencia',
  })
  description: string | null;

  @ApiProperty({
    description: 'Whether the school is active',
    example: true,
  })
  isActive: boolean;

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
