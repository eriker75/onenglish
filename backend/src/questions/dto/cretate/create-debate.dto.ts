import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum } from 'class-validator';
import { BaseCreateQuestionDto } from './base-question.dto';

export enum DebateStance {
  SUPPORT = 'support',
  OPPOSE = 'oppose',
  RANDOM = 'random',
}

export class CreateDebateDto extends BaseCreateQuestionDto {
  @ApiProperty({
    example: 'Bubble gum',
    description: 'Debate topic/statement',
  })
  @IsString()
  content: string;

  @ApiProperty({
    enum: DebateStance,
    example: 'support',
    description: 'Student stance for the debate (support or oppose)',
  })
  @IsEnum(DebateStance)
  stance: DebateStance;
}
