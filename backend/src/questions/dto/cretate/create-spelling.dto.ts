import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';

export class CreateSpellingDto extends BaseCreateQuestionWithoutStageDto {
  @IsFile()
  @MaxFileSize(5e6) // 5MB
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'image/avif'])
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image file to spell the word',
  })
  media: FileSystemStoredFile;

  @ApiProperty({
    example: 'Butterfly',
    description: 'Correct spelling',
  })
  @IsString()
  answer: string;
}

