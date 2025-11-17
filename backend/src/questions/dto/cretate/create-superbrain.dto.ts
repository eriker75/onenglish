import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseCreateQuestionDto } from './base-question.dto';

export class CreateSuperbrainDto extends BaseCreateQuestionDto {
  @ApiProperty({
    example: 'What do bees make?',
    description: 'Question prompt for audio response',
  })
  @IsString()
  content: string;
}

