import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { BaseCreateQuestionDto } from './base-question.dto';

export class CreateReportItDto extends BaseCreateQuestionDto {
  @ApiProperty({
    example: '"I will call you tomorrow," she said.',
    description: 'Direct speech sentence to convert to reported speech',
  })
  @IsString()
  content: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Optional reference image (PNG with transparency recommended)',
  })
  @IsOptional()
  media?: any;
}

