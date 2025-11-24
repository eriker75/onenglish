import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ArrayMinSize } from 'class-validator';
import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';

export class CreateFastTestDto extends BaseCreateQuestionWithoutStageDto {
  @ApiProperty({
    type: [String],
    example: ['I enjoy', 'to the beach'],
    description: 'Sentence parts with a gap',
  })
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  content: string[];

  @ApiProperty({
    type: [String],
    example: ['going', 'go', 'gone', 'going to'],
    description: 'Options to complete the sentence',
  })
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options: string[];

  @ApiProperty({
    example: 'going',
    description: 'Correct option',
  })
  @IsString()
  answer: string;
}

