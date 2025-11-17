# AI Files Module - Usage Examples

## Overview

The `AiFilesModule` provides multimodal AI processing capabilities for audio, images, and video files. It supports multiple AI providers through an adapter pattern, with Gemini currently implemented.

## Module Configuration

### Global Configuration (Recommended)

Already configured in `app.module.ts`:

```typescript
import { AiFilesModule } from './ai-files/ai-files.module';

@Module({
  imports: [
    AiFilesModule.forRootAsync(), // Uses ConfigService with GEMINI_API_KEY
    // ... other modules
  ],
})
export class AppModule {}
```

### Feature-Specific Configuration

```typescript
import { AiFilesModule } from '../ai-files/ai-files.module';

@Module({
  imports: [
    AiFilesModule.forFeature('CUSTOM_AI', {
      defaultProvider: 'google_genai',
      providers: {
        gemini: {
          apiKey: 'custom-api-key',
          model: 'gemini-1.5-pro',
          defaultTemperature: 0.5,
        },
      },
    }),
  ],
})
export class CustomModule {}
```

## Service Injection

```typescript
import { Injectable } from '@nestjs/common';
import { AiFilesService, FileType, SupportedMimeType } from '../ai-files';

@Injectable()
export class YourService {
  constructor(private readonly aiFilesService: AiFilesService) {}
}
```

## Usage Examples

### 1. Validate Spelling from Audio

**Use Case**: Student records themselves spelling a word, validate if correct.

```typescript
async validateStudentSpelling(audioPath: string, expectedWord: string) {
  // Convert file path to FileInput
  const audioInput = this.aiFilesService.filePathToFileInput(
    audioPath,
    SupportedMimeType.AUDIO_MP3,
    FileType.AUDIO,
  );

  // Validate spelling (uses default provider)
  const result = await this.aiFilesService.validateSpellingFromAudio(
    audioInput,
    expectedWord,
  );

  if (result.success) {
    return {
      passed: result.data.isCorrect,
      studentSpelled: result.data.speltWord,
      expectedWord: expectedWord,
      transcription: result.data.transcription,
      feedback: result.data.analysis,
    };
  } else {
    throw new Error(result.error);
  }
}
```

### 2. Validate Spelling with Provider Override

```typescript
async validateSpellingWithCustomProvider(audioPath: string, word: string) {
  const audioInput = this.aiFilesService.filePathToFileInput(
    audioPath,
    SupportedMimeType.AUDIO_WAV,
    FileType.AUDIO,
  );

  // Override default provider
  const result = await this.aiFilesService.validateSpellingFromAudio(
    audioInput,
    word,
    'google_genai', // Explicit provider
  );

  return result;
}
```

### 3. Create Story from Multiple Images

**Use Case**: Student uploads 3 images, AI creates a connecting story.

```typescript
async createStoryChallenge(imagePaths: string[], studentLevel: string) {
  const imageInputs = imagePaths.map((path) =>
    this.aiFilesService.filePathToFileInput(
      path,
      SupportedMimeType.IMAGE_JPEG,
      FileType.IMAGE,
    ),
  );

  const levelInstructions = {
    A1: 'Use very simple English with basic vocabulary',
    A2: 'Use simple English suitable for elementary level',
    B1: 'Use intermediate English with moderate vocabulary',
    B2: 'Use upper-intermediate English',
  };

  const result = await this.aiFilesService.createStoryFromImages(
    imageInputs,
    'short',
    levelInstructions[studentLevel] || levelInstructions['A2'],
  );

  if (result.success) {
    return {
      story: result.data,
      provider: result.provider,
    };
  } else {
    throw new Error(result.error);
  }
}
```

### 4. Analyze Image with Custom Prompt

**Use Case**: Describe an image for vocabulary practice.

```typescript
async describeImageForVocabulary(imagePath: string) {
  const imageInput = this.aiFilesService.filePathToFileInput(
    imagePath,
    SupportedMimeType.IMAGE_PNG,
    FileType.IMAGE,
  );

  const systemPrompt = `You are an English vocabulary teacher. 
  Describe this image focusing on:
  1. Main objects and their names
  2. Actions happening in the image (verbs)
  3. Adjectives describing the scene
  4. Prepositions showing positions
  
  Format your response as a structured vocabulary list.`;

  const result = await this.aiFilesService.processSingleFile(
    imageInput,
    systemPrompt,
    'Describe this image for English vocabulary learning',
    0.3, // temperature
  );

  return result;
}
```

### 5. Compare Multiple Images

**Use Case**: Find connections between images for critical thinking.

```typescript
async findImageConnections(imagePaths: string[]) {
  const imageInputs = imagePaths.map((path) =>
    this.aiFilesService.filePathToFileInput(
      path,
      SupportedMimeType.IMAGE_JPEG,
      FileType.IMAGE,
    ),
  );

  const result = await this.aiFilesService.analyzeImages(
    imageInputs,
    'find-connections',
  );

  return result;
}
```

### 6. Process Audio with Custom System Prompt

**Use Case**: Transcribe and analyze student's pronunciation.

```typescript
async analyzePronunciation(audioPath: string, targetSentence: string) {
  const audioInput = this.aiFilesService.filePathToFileInput(
    audioPath,
    SupportedMimeType.AUDIO_MP3,
    FileType.AUDIO,
  );

  const systemPrompt = `You are a pronunciation coach. 
  The student should be saying: "${targetSentence}"
  
  Analyze:
  1. Transcribe what they actually said
  2. Identify pronunciation errors
  3. Provide specific feedback
  4. Rate pronunciation from 1-10`;

  const result = await this.aiFilesService.processSingleFile(
    audioInput,
    systemPrompt,
    'Analyze this pronunciation attempt',
    0.2,
  );

  return result;
}
```

### 7. Process Multiple Files with Different Types

```typescript
async createMultimodalChallenge(
  imagePath: string,
  audioPath: string,
  instruction: string,
) {
  const imageInput = this.aiFilesService.filePathToFileInput(
    imagePath,
    SupportedMimeType.IMAGE_JPEG,
    FileType.IMAGE,
  );

  const audioInput = this.aiFilesService.filePathToFileInput(
    audioPath,
    SupportedMimeType.AUDIO_MP3,
    FileType.AUDIO,
  );

  const systemPrompt = `You are an English learning assistant.
  You will receive an image and an audio recording.
  ${instruction}`;

  const result = await this.aiFilesService.processMultipleFiles(
    {
      files: [imageInput, audioInput],
      systemPrompt,
      userPrompt: 'Analyze both the image and audio together',
      temperature: 0.3,
    },
    'google_genai',
  );

  return result;
}
```

## Check Provider Capabilities

```typescript
// Check available providers
const providers = this.aiFilesService.getAvailableProviders();
console.log('Available providers:', providers); // ['google_genai']

// Check if provider supports file type
const supportsAudio = this.aiFilesService.providerSupportsFileType(
  FileType.AUDIO,
  'google_genai',
);
console.log('Supports audio:', supportsAudio); // true
```

## Error Handling

All methods return `FileProcessingResult<T>` with:
- `success: boolean` - Whether operation succeeded
- `data: T` - The result data
- `provider: string` - Provider used
- `model: string` - Model used
- `error?: string` - Error message if failed

```typescript
const result = await this.aiFilesService.validateSpellingFromAudio(
  audioInput,
  'beautiful',
);

if (!result.success) {
  console.error('Validation failed:', result.error);
  // Handle error appropriately
} else {
  console.log('Validation result:', result.data);
}
```

## Controller Example

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { AiFilesService, FileType, SupportedMimeType } from '../ai-files';
import { ValidateSpellingDto, SpellingValidationResponseDto } from '../ai-files/dto';

@ApiTags('AI Spelling')
@Controller('spelling')
export class SpellingController {
  constructor(private readonly aiFilesService: AiFilesService) {}

  @Post('validate')
  @ApiOperation({ summary: 'Validate word spelling from audio' })
  @FormDataRequest()
  async validateSpelling(
    @Body() dto: ValidateSpellingDto,
  ): Promise<SpellingValidationResponseDto> {
    const audioInput = this.aiFilesService.filePathToFileInput(
      dto.audio.path,
      SupportedMimeType.AUDIO_MP3,
      FileType.AUDIO,
    );

    const result = await this.aiFilesService.validateSpellingFromAudio(
      audioInput,
      dto.expectedWord,
      dto.provider,
    );

    return {
      success: result.success,
      isCorrect: result.data.isCorrect,
      speltWord: result.data.speltWord,
      transcription: result.data.transcription,
      analysis: result.data.analysis,
      provider: result.provider,
      model: result.model,
      error: result.error,
    };
  }
}
```

## Best Practices

1. **Always check `result.success`** before using `result.data`
2. **Use specific prompts** - The more detailed your system prompt, the better results
3. **Handle errors gracefully** - AI services can fail, always have fallbacks
4. **Consider temperature** - Lower (0.1-0.3) for structured tasks, higher (0.5-0.8) for creative tasks
5. **Provider override** - Use when you need specific provider features
6. **File size limits** - Current limit is 10MB per file, consider chunking for larger files

## Adding New Providers (Future)

To add OpenAI or other providers:

1. Create adapter implementing `IFilesProviderAdapter`
2. Register in `AiFilesModule.createServiceWithAdapters()`
3. Update `AiFilesModuleOptions` interface
4. Use with provider name: `'openai'`

## Environment Variables

Required in `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp  # Optional, defaults to gemini-2.0-flash-exp
```

