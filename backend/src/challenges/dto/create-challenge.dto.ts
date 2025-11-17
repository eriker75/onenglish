import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsIn,
  IsDateString,
} from 'class-validator';

export class CreateChallengeDto {
  @ApiProperty({
    description: 'Grade level',
    enum: ['5th_grade', '6th_grade', '1st_year', '2nd_year', '3rd_year', '4th_year', '5th_year'],
    example: '5th_grade',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['5th_grade', '6th_grade', '1st_year', '2nd_year', '3rd_year', '4th_year', '5th_year'])
  grade: string;

  @ApiProperty({
    description: 'Challenge type',
    enum: ['regular', 'bilingual'],
    example: 'bilingual',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['regular', 'bilingual'])
  type: string;

  @ApiProperty({
    description: 'Whether the challenge is a demo',
    default: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isDemo?: boolean;

  @ApiProperty({
    description: 'Exact date of the challenge in ISO 8601 format (YYYY-MM-DD)',
    required: false,
    example: '2024-06-15',
    type: String,
  })
  @IsDateString()
  @IsOptional()
  exactDate?: string;

  @ApiProperty({
    description: 'Challenge stage',
    enum: ['Regional', 'State', 'National'],
    required: false,
    example: 'National',
  })
  @IsString()
  @IsOptional()
  @IsIn(['Regional', 'State', 'National'])
  stage?: string;

  @ApiProperty({
    description: 'Whether the challenge is active',
    default: true,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
