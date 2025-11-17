import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerImageToMultipleChoicesDto {
  @ApiProperty({
    description: 'The selected option',
    example: 'cat',
  })
  @IsString()
  @IsNotEmpty()
  userAnswer: string;

  @ApiPropertyOptional({
    description: 'Time spent on the question in seconds',
    example: 45,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  timeSpent?: number;
}
