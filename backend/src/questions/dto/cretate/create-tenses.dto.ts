import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsEnum, ArrayMinSize } from 'class-validator';
import { BaseCreateQuestionDto } from './base-question.dto';

enum ValidTenses {
  PRESENT_SIMPLE = 'present_simple',
  PAST_SIMPLE = 'past_simple',
  FUTURE_SIMPLE = 'future_simple',
  PRESENT_CONTINUOUS = 'present_continuous',
  PAST_CONTINUOUS = 'past_continuous',
  FUTURE_CONTINUOUS = 'future_continuous',
  PRESENT_PERFECT = 'present_perfect',
  PAST_PERFECT = 'past_perfect',
  FUTURE_PERFECT = 'future_perfect',
}

export class CreateTensesDto extends BaseCreateQuestionDto {
  @ApiProperty({
    example: 'She does her homework before dinner every day.',
    description: 'Sentence to identify tense from',
  })
  @IsString()
  content: string;

  @ApiProperty({
    enum: ValidTenses,
    isArray: true,
    example: [
      ValidTenses.FUTURE_CONTINUOUS,
      ValidTenses.PAST_CONTINUOUS,
      ValidTenses.PAST_PERFECT,
      ValidTenses.PRESENT_CONTINUOUS,
    ],
    description: 'Tense options for multiple choice',
  })
  @IsArray()
  @ArrayMinSize(2)
  @IsEnum(ValidTenses, { each: true })
  options: ValidTenses[];

  @ApiProperty({
    enum: ValidTenses,
    example: ValidTenses.PRESENT_SIMPLE,
    description: 'Correct tense',
  })
  @IsEnum(ValidTenses)
  answer: ValidTenses;
}

