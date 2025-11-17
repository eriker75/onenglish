import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseCreateQuestionDto } from './base-question.dto';

export class CreateTellMeAboutItDto extends BaseCreateQuestionDto {
  @ApiProperty({
    example: 'your first toy',
    description: 'Story prompt topic',
  })
  @IsString()
  content: string;
}

