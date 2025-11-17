import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerReadItDto {
  @ApiProperty({
    description: 'Object mapping sub-question IDs to their answers (true/false)',
    example: {
      'sub-question-id-1': 'true',
      'sub-question-id-2': 'false',
      'sub-question-id-3': 'true',
    },
  })
  @IsObject()
  @IsNotEmpty()
  userAnswer: Record<string, string>;

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
