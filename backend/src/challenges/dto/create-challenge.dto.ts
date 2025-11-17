import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  IsIn,
  Min,
} from 'class-validator';

export class CreateChallengeDto {
  @ApiProperty({ description: 'Challenge title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Challenge slug (unique identifier)' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ description: 'Challenge description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Challenge category',
    enum: ['listening', 'speaking', 'grammar', 'vocabulary', 'mixed'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['listening', 'speaking', 'grammar', 'vocabulary', 'mixed'])
  category: string;

  @ApiProperty({
    description: 'Challenge level',
    enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
  level: string;

  @ApiProperty({
    description: 'Challenge difficulty',
    enum: ['easy', 'medium', 'hard'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['easy', 'medium', 'hard'])
  difficulty: string;

  @ApiProperty({ description: 'Total points for the challenge', default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  totalPoints?: number;

  @ApiProperty({ description: 'Whether the challenge is published', default: false })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiProperty({ description: 'Whether the challenge is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
