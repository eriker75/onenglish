import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseCreateQuestionDto } from './base-question.dto';
import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';

export class CreateGossipDto extends BaseCreateQuestionDto {
  @IsFile()
  @MaxFileSize(10e6) // 10MB
  @HasMimeType(['audio/mpeg', 'audio/wav', 'audio/ogg'])
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Audio file to transcribe',
  })
  media: FileSystemStoredFile;

  @ApiProperty({
    example: 'The meeting has been moved to Monday morning.',
    description: 'Expected transcription',
  })
  @IsString()
  answer: string;
}

