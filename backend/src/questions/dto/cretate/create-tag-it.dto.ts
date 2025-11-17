import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayMinSize } from 'class-validator';
import { BaseCreateQuestionDto } from './base-question.dto';

export class CreateTagItDto extends BaseCreateQuestionDto {
  @ApiProperty({
    type: [String],
    example: ['He is responsible for the project,', '?'],
    description: 'Sentence parts with missing tag',
  })
  @IsArray()
  @ArrayMinSize(2)
  content: string[];

  @ApiProperty({
    type: [String],
    example: ["isn't he?", 'is not he?'],
    description: 'Acceptable answers for the tag',
  })
  @IsArray()
  @ArrayMinSize(1)
  answer: string[];
}

