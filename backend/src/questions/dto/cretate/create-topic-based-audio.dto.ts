import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  ValidateNested,
  IsArray,
  ArrayMinSize,
  IsInt,
  Min,
  IsOptional,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { BaseCreateQuestionDto } from './base-question.dto';
import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';

export class AudioSubQuestionDto {
  @ApiProperty({
    example: 'What is the main topic discussed in the audio?',
    description: 'Sub-question text'
  })
  @IsString()
  text: string;

  @ApiProperty({
    example: 8,
    minimum: 0,
    description: 'Points for this sub-question'
  })
  @IsInt()
  @Min(0)
  points: number;

  @ApiProperty({
    type: [String],
    description: 'Answer options for this sub-question',
    example: ['Travel plans', 'Business meeting', 'Weather forecast', 'Sports event']
  })
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options: string[];

  @ApiProperty({
    example: 'Business meeting',
    description: 'Correct answer (must match one of the options)'
  })
  @IsString()
  answer: string;
}

export class CreateTopicBasedAudioDto extends BaseCreateQuestionDto {
  @IsFile()
  @MaxFileSize(10e6) // 10MB
  @HasMimeType(['audio/mpeg', 'audio/wav', 'audio/ogg'])
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Audio file for the topic',
  })
  media: FileSystemStoredFile;

  @ApiProperty({
    type: [AudioSubQuestionDto],
    description: 'Multiple choice questions about the audio',
    example: [
      {
        text: 'What is the main topic discussed in the audio?',
        points: 8,
        options: ['Travel plans', 'Business meeting', 'Weather forecast', 'Sports event'],
        answer: 'Business meeting',
      },
      {
        text: 'When will the meeting take place?',
        points: 8,
        options: ['Monday morning', 'Tuesday afternoon', 'Wednesday evening', 'Thursday night'],
        answer: 'Monday morning',
      },
    ],
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AudioSubQuestionDto)
  subQuestions: AudioSubQuestionDto[];

  @ApiPropertyOptional({
    description: 'Parent question ID for sub-questions',
    example: '507f1f77-bcf8-6cd7-9943-9101abcd5678',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }
    return value;
  })
  parentQuestionId?: string;
}

