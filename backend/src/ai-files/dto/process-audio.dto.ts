import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import {
  FileSystemStoredFile,
  HasMimeType,
  IsFile,
  MaxFileSize,
} from 'nestjs-form-data';

export class ProcessAudioDto {
  @IsFile()
  @MaxFileSize(10e6) // 10MB
  @HasMimeType(['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac'])
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Audio file to process',
  })
  audio: FileSystemStoredFile;

  @ApiProperty({
    description: 'System prompt for AI processing',
    example: 'You are a spelling validation assistant...',
  })
  @IsString()
  @IsNotEmpty()
  systemPrompt: string;

  @ApiPropertyOptional({
    description: 'Additional user prompt',
    example: 'Validate the spelling',
  })
  @IsOptional()
  @IsString()
  userPrompt?: string;

  @ApiPropertyOptional({
    description: 'Provider to use (gemini, openai, etc.)',
    example: 'google_genai',
  })
  @IsOptional()
  @IsString()
  provider?: string;
}

export class ValidateSpellingDto {
  @IsFile()
  @MaxFileSize(10e6)
  @HasMimeType(['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac'])
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Audio file with spelling',
  })
  audio: FileSystemStoredFile;

  @ApiPropertyOptional({
    description: 'Expected word',
    example: 'beautiful',
  })
  @IsOptional()
  @IsString()
  expectedWord?: string;

  @ApiPropertyOptional({
    description: 'Provider to use',
    example: 'google_genai',
  })
  @IsOptional()
  @IsString()
  provider?: string;
}
