import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayMinSize } from 'class-validator';
import { BaseCreateQuestionDto } from './base-question.dto';
import {
  FileSystemStoredFile,
  HasMimeType,
  IsFile,
  MaxFileSize,
} from 'nestjs-form-data';

export class CreateLyricsTrainingDto extends BaseCreateQuestionDto {
  @IsFile()
  @MaxFileSize(10e6) // 10MB for video/audio
  @HasMimeType(['audio/mpeg', 'audio/wav', 'video/mp4', 'video/webm'])
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Video/audio file of the song',
  })
  media: FileSystemStoredFile;

  @ApiProperty({
    example: 'dark',
    description: 'Correct word in the lyrics',
  })
  @IsString()
  answer: string;

  @ApiProperty({
    type: [String],
    example: ['light', 'dark', 'bright', 'night'],
    description: 'Word options',
  })
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options: string[];
}
