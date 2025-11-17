import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerFastTestDto {
  @ApiProperty({
    description: 'Student\'s quick answer or completion',
    example: 'goes',
  })
  @IsString()
  @IsNotEmpty()
  userAnswer: string;

  @ApiPropertyOptional({
    description: 'Time spent on the question in seconds',
    example: 15,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  timeSpent?: number;
}
