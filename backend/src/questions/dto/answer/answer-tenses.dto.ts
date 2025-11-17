import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerTensesDto {
  @ApiProperty({
    description: 'The selected verb tense',
    example: 'past_simple',
  })
  @IsString()
  @IsNotEmpty()
  userAnswer: string;

  @ApiPropertyOptional({
    description: 'Time spent on the question in seconds',
    example: 30,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  timeSpent?: number;
}
