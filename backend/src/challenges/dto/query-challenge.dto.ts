import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString, IsIn, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dtos/pagination.dto';

export class QueryChallengeDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'Filter by grade',
    enum: ['5th_grade', '6th_grade', '1st_year', '2nd_year', '3rd_year', '4th_year', '5th_year'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['5th_grade', '6th_grade', '1st_year', '2nd_year', '3rd_year', '4th_year', '5th_year'])
  grade?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by type',
    enum: ['regular', 'bilingual'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['regular', 'bilingual'])
  type?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by stage',
    enum: ['Regional', 'State', 'National'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['Regional', 'State', 'National'])
  stage?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by demo status',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isDemo?: boolean;

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
    description: 'Filter by year',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  year?: number;

  @ApiProperty({
    required: false,
    description: 'Filter by exact date (ISO 8601 format)',
  })
  @IsOptional()
  @IsString()
  exactDate?: string;

  @ApiProperty({
    required: false,
    description: 'Search by name',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by name',
  })
  @IsOptional()
  @IsString()
  name?: string;
}

