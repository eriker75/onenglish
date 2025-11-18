import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayMinSize } from 'class-validator';
import { Transform } from 'class-transformer';
import { BaseCreateQuestionDto } from './base-question.dto';

export class CreateTopicBasedAudioSubquestionDto extends BaseCreateQuestionDto {
  @ApiProperty({
    example: 'What is the main topic discussed in the audio?',
    description: 'Question text/content',
  })
  @IsString()
  content: string;

  @ApiProperty({
    type: [String],
    description: 'Answer options (minimum 2)',
    example: [
      'Travel plans',
      'Business meeting',
      'Weather forecast',
      'Sports event',
    ],
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value.split(',').map((item) => item.trim());
      }
    }
    return value;
  })
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options: string[];

  @ApiProperty({
    example: 'Business meeting',
    description: 'Correct answer (must be one of the options)',
  })
  @IsString()
  answer: string;

  @ApiProperty({
    description: 'Parent question ID (topic_based_audio question)',
    example: '507f1f77-bcf8-6cd7-9943-9101abcd5678',
  })
  @IsString()
  parentQuestionId: string;
}
