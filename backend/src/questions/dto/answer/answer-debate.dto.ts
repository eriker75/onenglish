import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import {
  IsFile,
  MaxFileSize,
  HasMimeType,
  FileSystemStoredFile,
} from 'nestjs-form-data';

export enum DebateStance {
  SUPPORT = 'support',
  OPPOSE = 'oppose',
}

export class AnswerDebateDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Audio file with student argument (mp3, wav, ogg, flac, m4a)',
  })
  @IsFile()
  @MaxFileSize(10 * 1024 * 1024) // 10MB max
  @HasMimeType([
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/flac',
    'audio/mp4',
  ])
  audio: FileSystemStoredFile;

  @ApiProperty({
    enum: DebateStance,
    example: 'support',
    description: 'Student stance for the debate (support or oppose)',
  })
  @IsEnum(DebateStance)
  stance: DebateStance;

  @ApiPropertyOptional({
    description: 'Time spent on the question in seconds',
    example: 240,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  timeSpent?: number;
}
