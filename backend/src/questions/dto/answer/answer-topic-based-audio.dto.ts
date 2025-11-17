import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerTopicBasedAudioDto {
  @ApiProperty({
    description: 'Object mapping sub-question IDs to their answers',
    example: {
      'sub-question-id-1': 'answer text 1',
      'sub-question-id-2': 'answer text 2',
      'sub-question-id-3': 'answer text 3',
    },
  })
  @IsObject()
  @IsNotEmpty()
  userAnswer: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Time spent on the question in seconds',
    example: 150,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  timeSpent?: number;
}
