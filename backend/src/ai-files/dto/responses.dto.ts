import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SpellingValidationResponseDto {
  @ApiProperty({
    description: 'Whether the operation was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Whether the spelling is correct',
    example: true,
  })
  isCorrect: boolean;

  @ApiProperty({
    description: 'The word that was spelled',
    example: 'beautiful',
  })
  speltWord: string;

  @ApiProperty({
    description: 'Raw transcription of letters heard',
    example: 'B-E-A-U-T-I-F-U-L',
  })
  transcription: string;

  @ApiProperty({
    description: 'Analysis of the spelling',
    example: 'Correct spelling of the word "beautiful"',
  })
  analysis: string;

  @ApiProperty({
    description: 'Provider used for processing',
    example: 'google_genai',
  })
  provider: string;

  @ApiProperty({
    description: 'Model used for processing',
    example: 'gemini-2.0-flash-exp',
  })
  model: string;

  @ApiPropertyOptional({
    description: 'Error message if operation failed',
    example: 'Invalid audio format',
  })
  error?: string;
}

export class FileProcessingResponseDto {
  @ApiProperty({
    description: 'Whether the operation was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Processed data/result',
    example: 'The image shows a beautiful landscape...',
  })
  data: string;

  @ApiProperty({
    description: 'Provider used for processing',
    example: 'google_genai',
  })
  provider: string;

  @ApiProperty({
    description: 'Model used for processing',
    example: 'gemini-2.0-flash-exp',
  })
  model: string;

  @ApiPropertyOptional({
    description: 'Error message if operation failed',
    example: 'File format not supported',
  })
  error?: string;
}

export class StoryCreationResponseDto extends FileProcessingResponseDto {
  @ApiProperty({
    description: 'Generated story',
    example:
      'Once upon a time, there was a beautiful landscape where children played...',
  })
  story: string;
}
