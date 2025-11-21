# AI Files Module

A flexible, extensible NestJS module for processing multimodal files (audio, images, video) using AI providers.

## Features

- 🎯 **Provider Agnostic**: Adapter pattern for easy integration of multiple AI providers
- 🎵 **Audio Processing**: Spelling validation, transcription, pronunciation analysis
- 🖼️ **Image Processing**: Story creation, image analysis, description generation
- 🎬 **Video Support**: Ready for video processing (Gemini supports it)
- 🔧 **Flexible Configuration**: Global, feature-specific, or per-call provider selection
- 📦 **Type Safe**: Full TypeScript support with interfaces and DTOs
- 🚀 **High-Level Methods**: Common use cases built-in (spelling validation, story creation)
- 🎨 **Custom Prompts**: Full control over system and user prompts

## Architecture

```
ai-files/
├── adapters/              # Provider-specific implementations
│   └── gemini-files.adapter.ts
├── interfaces/            # Contracts and types
│   ├── file-input.interface.ts
│   └── provider-adapter.interface.ts
├── enums/                 # File types and MIME types
│   └── file-type.enum.ts
├── dto/                   # Request/Response DTOs
│   ├── process-audio.dto.ts
│   ├── process-image.dto.ts
│   └── responses.dto.ts
├── ai-files.module.ts     # Module configuration
├── ai-files.service.ts    # Main service
└── index.ts               # Barrel exports
```

## Installation

Already integrated in your project. No additional packages needed.

Dependencies:
- `@google/genai` ✅ (already installed)
- `nestjs-form-data` ✅ (already installed)

## Quick Start

### 1. Module is already configured globally in `app.module.ts`

```typescript
AiFilesModule.forRootAsync() // Uses GEMINI_API_KEY from .env
```

### 2. Test the API endpoints

The module includes a test controller with endpoints for all main features:

**Available endpoints:**
- `GET /ai-files/test/providers` - List available providers
- `GET /ai-files/test/capabilities` - Check provider capabilities
- `POST /ai-files/test/validate-spelling` - Validate word spelling from audio
- `POST /ai-files/test/process-audio` - Process audio with custom prompt
- `POST /ai-files/test/create-story` - Create story from images
- `POST /ai-files/test/process-images` - Process images with custom prompt
- `POST /ai-files/test/analyze-images` - Analyze images

Access Swagger UI at: `http://localhost:3000/api` to test all endpoints interactively.

### 3. Inject the service

```typescript
import { Injectable } from '@nestjs/common';
import { AiFilesService } from '../ai-files';

@Injectable()
export class YourService {
  constructor(private readonly aiFilesService: AiFilesService) {}
}
```

### 3. Use it!

```typescript
// Validate spelling from audio
const audioInput = this.aiFilesService.filePathToFileInput(
  '/path/to/audio.mp3',
  SupportedMimeType.AUDIO_MP3,
  FileType.AUDIO,
);

const result = await this.aiFilesService.validateSpellingFromAudio(
  audioInput,
  'beautiful',
);

console.log(result.data); // { isCorrect: true, speltWord: 'beautiful', ... }
```

## Core Concepts

### FileInput

All files are converted to `FileInput` interface:

```typescript
interface FileInput {
  data: string;              // Base64 encoded file
  mimeType: SupportedMimeType;
  fileType: FileType;
  fileName?: string;
}
```

### Provider Selection

Three ways to specify provider:

1. **Default (configured in module)**: No provider parameter
2. **Override per call**: Pass provider as last parameter
3. **Feature-specific**: Use `forFeature()` with custom config

### Result Format

All methods return `FileProcessingResult<T>`:

```typescript
interface FileProcessingResult<T> {
  success: boolean;  // Operation succeeded?
  data: T;          // Result data
  provider: string; // Provider used
  model: string;    // Model used
  error?: string;   // Error message if failed
}
```

## API Reference

### High-Level Methods (Recommended)

#### `validateSpellingFromAudio()`
Validate word spelling from audio recording.

```typescript
async validateSpellingFromAudio(
  audioFile: FileInput,
  expectedWord?: string,
  provider?: string,
): Promise<FileProcessingResult<{
  isCorrect: boolean;
  speltWord: string;
  transcription: string;
  analysis: string;
}>>
```

#### `createStoryFromImages()`
Create a story connecting multiple images.

```typescript
async createStoryFromImages(
  images: FileInput[],
  storyType: 'short' | 'detailed' = 'short',
  additionalInstructions?: string,
  provider?: string,
): Promise<FileProcessingResult<string>>
```

#### `analyzeImages()`
Analyze images (describe, compare, find connections).

```typescript
async analyzeImages(
  images: FileInput[],
  analysisType: 'describe' | 'compare' | 'find-connections' = 'describe',
  provider?: string,
): Promise<FileProcessingResult<string>>
```

### Generic Methods (Maximum Flexibility)

#### `processSingleFile()`
Process any single file with custom prompt.

```typescript
async processSingleFile(
  file: FileInput,
  systemPrompt: string,
  userPrompt?: string,
  temperature?: number,
  provider?: string,
): Promise<FileProcessingResult<string>>
```

#### `processMultipleFiles()`
Process multiple files together.

```typescript
async processMultipleFiles(
  input: MultiFileInput,
  provider?: string,
): Promise<FileProcessingResult<string>>
```

### Utility Methods

#### `filePathToFileInput()`
Convert file path to FileInput.

```typescript
filePathToFileInput(
  filePath: string,
  mimeType: SupportedMimeType,
  fileType: FileType,
): FileInput
```

#### `getAvailableProviders()`
List registered providers.

```typescript
getAvailableProviders(): string[]
```

#### `providerSupportsFileType()`
Check if provider supports a file type.

```typescript
providerSupportsFileType(
  fileType: FileType,
  provider?: string,
): boolean
```

## Supported File Types

### Audio
- `audio/mpeg` (MP3)
- `audio/wav` (WAV)
- `audio/ogg` (OGG)
- `audio/flac` (FLAC)
- `audio/mp4` (M4A)

### Image
- `image/jpeg` (JPEG/JPG)
- `image/png` (PNG)
- `image/webp` (WebP)
- `image/gif` (GIF)

### Video
- `video/mp4` (MP4)
- `video/webm` (WebM)
- `video/quicktime` (MOV)

## Configuration Options

### Global Configuration

```typescript
AiFilesModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    defaultProvider: 'google_genai',
    providers: {
      gemini: {
        apiKey: configService.get('GEMINI_API_KEY'),
        model: 'gemini-2.0-flash-exp',
        defaultTemperature: 0.2,
      },
    },
  }),
  inject: [ConfigService],
})
```

### Feature-Specific Configuration

```typescript
AiFilesModule.forFeature('CUSTOM_AI', {
  defaultProvider: 'google_genai',
  providers: {
    gemini: {
      apiKey: 'custom-key',
      model: 'gemini-1.5-pro',
      defaultTemperature: 0.5,
    },
  },
})
```

## Examples

See [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) for comprehensive examples including:
- Spelling validation
- Story creation from images
- Pronunciation analysis
- Custom prompt processing
- Error handling
- Controller examples

## Current Provider Support

| Provider | Audio | Image | Video | Status |
|----------|-------|-------|-------|--------|
| Gemini   | ✅    | ✅    | ✅    | Active |
| OpenAI   | 🔜    | 🔜    | ❌    | Planned |
| Anthropic| ❌    | 🔜    | ❌    | Planned |

## Adding New Providers

1. Create adapter implementing `IFilesProviderAdapter`
2. Add provider config to `AiFilesModuleOptions`
3. Register in `createServiceWithAdapters()`

Example structure:

```typescript
export class OpenAIFilesAdapter implements IFilesProviderAdapter {
  getProviderName(): string { return 'openai'; }
  supportsFileType(fileType: string): boolean { /* ... */ }
  // ... implement all methods
}
```

## Environment Variables

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.0-flash-exp  # Optional
```

## Best Practices

1. ✅ Always check `result.success` before using data
2. ✅ Use specific, detailed system prompts
3. ✅ Handle errors gracefully with fallbacks
4. ✅ Choose appropriate temperature for task
5. ✅ Consider file size limits (10MB default)
6. ✅ Use high-level methods when available
7. ✅ Cache results when appropriate

## Troubleshooting

### "No adapter found for provider"
- Check provider name spelling
- Verify provider is configured in module
- Check environment variables

### "Provider does not support X files"
- Verify file type is supported by provider
- Check MIME type is correct
- Use `providerSupportsFileType()` to verify

### "Invalid JSON response from AI"
- Check system prompt for clarity
- Increase temperature if too rigid
- Add more context to user prompt

## Related Modules

- **AiModule**: For text-only AI operations (existing)
- **FilesModule**: For file upload/storage operations
- **QuestionsModule**: Uses AI Files for question generation

## License

Same as main project.

## Support

For issues or questions, contact the development team.
