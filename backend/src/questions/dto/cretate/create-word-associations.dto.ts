import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject } from 'class-validator';
import { BaseCreateQuestionDto } from './base-question.dto';

export class CreateWordAssociationsDto extends BaseCreateQuestionDto {
  @ApiProperty({
    example: 'Journey',
    description: 'Target word for associations',
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: { totalAssociations: 20 },
    description: 'Configuration including total associations expected',
  })
  @IsObject()
  configuration: Record<string, unknown>;
}

