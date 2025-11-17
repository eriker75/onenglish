import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../common/dtos/pagination.dto';

export class QueryChallengeDto extends PaginationDto {
  @ApiProperty({
    required: false,
    description: 'Filter by category',
    enum: ['listening', 'speaking', 'grammar', 'vocabulary', 'mixed'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['listening', 'speaking', 'grammar', 'vocabulary', 'mixed'])
  category?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by level',
    enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
  level?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by difficulty',
    enum: ['easy', 'medium', 'hard'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['easy', 'medium', 'hard'])
  difficulty?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by published status',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isPublished?: boolean;

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
    description: 'Search by title, slug, or description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by title',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    required: false,
    description: 'Filter by slug',
  })
  @IsOptional()
  @IsString()
  slug?: string;
}

