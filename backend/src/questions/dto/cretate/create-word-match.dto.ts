import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ArrayMinSize } from 'class-validator';
import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';

export class CreateWordMatchDto extends BaseCreateQuestionWithoutStageDto {
  @IsFile({ each: true })
  @MaxFileSize(10e6, { each: true })
  @HasMimeType(['audio/mpeg', 'audio/wav', 'audio/ogg'], { each: true })
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Audio files to match with words',
  })
  @IsArray()
  @ArrayMinSize(1)
  audios: FileSystemStoredFile[];

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
