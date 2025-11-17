import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerTagItDto {
  @ApiProperty({
    description: 'Array of selected tags/words',
    example: ['noun', 'verb', 'adjective'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  userAnswer: string[];

  @ApiPropertyOptional({
    description: 'Time spent on the question in seconds',
    example: 75,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  timeSpent?: number;
}
