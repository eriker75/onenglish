import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerLyricsTrainingDto {
  @ApiProperty({
    description: 'Array of missing words filled in by the student',
    example: ['love', 'heart', 'forever'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  userAnswer: string[];

  @ApiPropertyOptional({
    description: 'Time spent on the question in seconds',
    example: 120,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  timeSpent?: number;
}
