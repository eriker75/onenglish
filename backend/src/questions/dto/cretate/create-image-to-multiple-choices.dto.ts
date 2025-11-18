import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ArrayMinSize, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { BaseCreateQuestionDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';

export class CreateImageToMultipleChoicesDto extends BaseCreateQuestionDto {
  @Transform(({ value }) => {
    // Si viene como array, tomar el primer elemento
    if (Array.isArray(value) && value.length > 0) {
      return value[0];
    }
    return value;
  })
  @IsNotEmpty({ message: 'Media file is required' })
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Image file to upload (PNG, JPEG, or WebP, max 5MB)',
  })
  media: FileSystemStoredFile;

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
