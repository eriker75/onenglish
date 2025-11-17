import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dtos/pagination.dto';

export class QuerySchoolDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'Filter by active status',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiProperty({
    required: false,
    description: 'Search by name, code, schoolId, or address',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by school name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by school code (e.g., SCH0001)',
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by school ID (sequential integer)',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  schoolId?: number;

  @ApiProperty({
    required: false,
    description: 'Filter by city',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by state',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by country',
  })
  @IsOptional()
  @IsString()
  country?: string;
}

