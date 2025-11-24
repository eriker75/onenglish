import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ArrayMinSize } from 'class-validator';
import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';

export class CreateWordMatchDto extends BaseCreateQuestionWithoutStageDto {
  @IsFile()
  @MaxFileSize(10e6) // 10MB
  @HasMimeType(['audio/mpeg', 'audio/wav', 'audio/ogg', 'video/mp4', 'video/webm'])
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Audio/video file to match with words',
  })
  audio: FileSystemStoredFile;

  @ApiProperty({
    type: [String],
    example: ['Ocean', 'Mountain', 'Forest', 'Desert'],
    description: 'Word options to match with audio',
  })
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options: string[];

  @ApiProperty({
    example: 'Ocean',
    description: 'Correct match',
  })
  @IsString()
  answer: string;
}
