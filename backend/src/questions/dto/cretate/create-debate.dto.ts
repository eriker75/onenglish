import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import {
  FileSystemStoredFile,
  MaxFileSize,
  HasMimeType,
  IsFile,
} from 'nestjs-form-data';

export enum DebateStance {
  SUPPORT = 'support',
  OPPOSE = 'oppose',
  RANDOM = 'random',
}

export class CreateDebateDto extends BaseCreateQuestionWithoutStageDto {
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

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description:
      'Optional reference image for the debate topic (image/jpeg, image/png, image/webp)',
  })
  @IsOptional()
  @IsFile()
  @MaxFileSize(5e6) // 5MB
  @HasMimeType([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'image/avif',
  ])
  image?: FileSystemStoredFile;
}
