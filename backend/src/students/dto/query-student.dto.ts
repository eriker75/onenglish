import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsUUID, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dtos/pagination.dto';

export class QueryStudentDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'Filter by school ID',
  })
  @IsOptional()
  @IsUUID()
  schoolId?: string;

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
    description: 'Search by first name, last name, or email',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by first name',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by last name',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by email',
  })
  @IsOptional()
  @IsString()
  email?: string;
}

