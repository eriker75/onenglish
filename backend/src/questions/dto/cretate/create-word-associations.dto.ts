import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject, IsOptional } from 'class-validator';
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

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Optional reference image',
  })
  @IsOptional()
  media?: any;
}

