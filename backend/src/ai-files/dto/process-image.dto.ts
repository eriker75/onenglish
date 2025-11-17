import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { FileSystemStoredFile, HasMimeType, IsFiles } from 'nestjs-form-data';

export class ProcessImagesDto {
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Image files to process',
  })
  @IsFiles()
  @HasMimeType(['image/jpeg', 'image/png', 'image/jpg', 'image/webp'], {
    each: true,
  })
  images: FileSystemStoredFile[];

  @ApiProperty({
    description: 'System prompt for AI processing',
    example: 'You are a creative storytelling assistant...',
  })
  @IsString()
  @IsNotEmpty()
  systemPrompt: string;

  @ApiPropertyOptional({
    description: 'User prompt',
    example: 'Create a story connecting these images',
  })
  @IsOptional()
  @IsString()
  userPrompt?: string;

  @ApiPropertyOptional({
    description: 'Provider to use',
    example: 'google_genai',
  })
  @IsOptional()
  @IsString()
  provider?: string;
}

export class CreateStoryFromImagesDto {
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Images to create story from',
  })
  @IsFiles()
  @HasMimeType(['image/jpeg', 'image/png', 'image/jpg', 'image/webp'], {
    each: true,
  })
  images: FileSystemStoredFile[];

  @ApiPropertyOptional({
    description: 'Story type',
    enum: ['short', 'detailed'],
    default: 'short',
  })
  @IsOptional()
  @IsEnum(['short', 'detailed'])
  storyType?: 'short' | 'detailed';

  @ApiPropertyOptional({
    description: 'Additional instructions',
    example: 'Use simple English suitable for beginners',
  })
  @IsOptional()
  @IsString()
  additionalInstructions?: string;

  @ApiPropertyOptional({
    description: 'Provider to use',
    example: 'google_genai',
  })
  @IsOptional()
  @IsString()
  provider?: string;
}
