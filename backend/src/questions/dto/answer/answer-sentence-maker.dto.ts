import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerSentenceMakerDto {
  @ApiProperty({
    description: 'Student\'s written sentence describing the images',
    example: 'The cat is sleeping on the couch next to the window.',
  })
  @IsString()
  @IsNotEmpty()
  userAnswer: string;

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
