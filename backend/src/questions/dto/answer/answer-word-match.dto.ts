import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerWordMatchDto {
  @ApiProperty({
    description: 'Object mapping word IDs to their matched audio IDs',
    example: {
      'word-1': 'audio-2',
      'word-2': 'audio-1',
      'word-3': 'audio-3',
    },
  })
  @IsObject()
  @IsNotEmpty()
  userAnswer: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Time spent on the question in seconds',
    example: 90,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  timeSpent?: number;
}
