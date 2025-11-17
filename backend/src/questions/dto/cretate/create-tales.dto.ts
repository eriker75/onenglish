import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayMinSize } from 'class-validator';
import { BaseCreateQuestionDto } from './base-question.dto';
import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';

export class CreateTalesDto extends BaseCreateQuestionDto {
  @IsFile({ each: true })
  @MaxFileSize(5e6, { each: true })
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp'], { each: true })
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Image files to inspire story writing (1 or more)',
  })
  @IsArray()
  @ArrayMinSize(1)
  media: FileSystemStoredFile[];
}

