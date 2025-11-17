import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ArrayMinSize } from 'class-validator';
import { BaseCreateQuestionDto } from './base-question.dto';

export class CreateUnscrambleDto extends BaseCreateQuestionDto {
  @ApiProperty({
    type: [String],
    example: ['book', 'read', 'I', 'every', 'night'],
    description: 'Scrambled words to reorder',
  })
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  content: string[];

  @ApiProperty({
    type: [String],
    example: ['I', 'read', 'book', 'every', 'night'],
    description: 'Correct word order',
  })
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  answer: string[];
}

