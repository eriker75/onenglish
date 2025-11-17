import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerUnscrambleDto {
  @ApiProperty({
    description: 'Array of words in correct order',
    example: ['The', 'cat', 'is', 'on', 'the', 'table'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  userAnswer: string[];

  @ApiPropertyOptional({
    description: 'Time spent on the question in seconds',
    example: 60,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  timeSpent?: number;
}
