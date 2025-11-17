import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsObject, IsOptional, ArrayMinSize } from 'class-validator';
import { BaseCreateQuestionDto } from './base-question.dto';

export class CreateWordboxDto extends BaseCreateQuestionDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    example: [
      ['A', 'B', 'C'],
      ['S', 'T', 'O'],
      ['A', 'C', 'D'],
    ],
    description: '2D array representing the letter grid',
  })
  @IsArray()
  @ArrayMinSize(1)
  content: string[][];

  @ApiPropertyOptional({
    example: { gridWidth: 3, gridHeight: 3 },
    description: 'Grid configuration settings',
  })
  @IsOptional()
  @IsObject()
  configuration?: Record<string, unknown>;
}
