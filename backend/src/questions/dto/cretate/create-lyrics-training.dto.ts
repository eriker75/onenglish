import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayMinSize } from 'class-validator';
import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import {
  FileSystemStoredFile,
  HasMimeType,
  IsFile,
  MaxFileSize,
} from 'nestjs-form-data';

export class CreateLyricsTrainingDto extends BaseCreateQuestionWithoutStageDto {
  @IsFile()
  @MaxFileSize(50e6) // 50MB for video
  @HasMimeType(['video/mp4', 'video/webm'])
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Video file of the song',
  })
  video: FileSystemStoredFile;

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
