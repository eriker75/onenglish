import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseCreateQuestionDto } from './base-question.dto';

export class CreateReportItDto extends BaseCreateQuestionDto {
  @ApiProperty({
    example: '"I will call you tomorrow," she said.',
    description: 'Direct speech sentence to convert to reported speech',
  })
  @IsString()
  content: string;
}

