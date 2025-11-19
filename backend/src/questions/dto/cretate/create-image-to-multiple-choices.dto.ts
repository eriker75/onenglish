import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ArrayMinSize } from 'class-validator';
import { Transform } from 'class-transformer';
import { BaseCreateQuestionDto } from './base-question.dto';
import {
  FileSystemStoredFile,
  IsFile,
  MaxFileSize,
  HasMimeType,
} from 'nestjs-form-data';

export class CreateImageToMultipleChoicesDto extends BaseCreateQuestionDto {
  @Transform(({ value }) => {
    // Ensure value is always an array
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  })
  @IsFile({ each: true })
  @MaxFileSize(5e6, { each: true }) // 5MB per file
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp'], { each: true })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one image file is required' })
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Image files to upload (PNG, JPEG, or WebP, max 5MB each)',
  })
  media: FileSystemStoredFile[];

  @ApiProperty({
    type: [String],
    example: ['Apple', 'Orange', 'Grapes', 'Banana'],
    description:
      'Multiple choice options (minimum 2). For form-data, send as comma-separated string: "Apple,Orange,Grapes,Banana"',
  })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map((item) => item.trim());
    }
    return value;
  })
  @IsArray()
  @ArrayMinSize(2, { message: 'Must provide at least 2 options' })
  @IsString({ each: true })
  options: string[];

  @ApiProperty({
    example: 'Apple',
    description: 'Correct answer (must be one of the options)',
  })
  @IsString()
  answer: string;
}
