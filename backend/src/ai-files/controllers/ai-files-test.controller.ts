import { Controller, Post, Body, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { AiFilesService } from '../ai-files.service';
import { ProcessAudioDto, ValidateSpellingDto } from '../dto/process-audio.dto';
import {
  ProcessImagesDto,
  CreateStoryFromImagesDto,
} from '../dto/process-image.dto';
import {
  SpellingValidationResponseDto,
  FileProcessingResponseDto,
} from '../dto/responses.dto';
import { FileType, SupportedMimeType } from '../enums/file-type.enum';

@ApiTags('AI Files - Testing')
@Controller('ai-files/test')
export class AiFilesTestController {
  constructor(private readonly aiFilesService: AiFilesService) {}

  @Get('providers')
  @ApiOperation({ summary: 'Get available AI providers' })
  @ApiResponse({
    status: 200,
    description: 'List of available providers',
    schema: {
      type: 'object',
      properties: {
        providers: {
          type: 'array',
          items: { type: 'string' },
          example: ['google_genai'],
        },
        count: { type: 'number', example: 1 },
      },
    },
  })
  getProviders() {
    const providers = this.aiFilesService.getAvailableProviders();
    return {
      providers,
      count: providers.length,
    };
  }

  @Get('capabilities')
  @ApiOperation({ summary: 'Check provider capabilities' })
  @ApiResponse({
    status: 200,
    description: 'Provider capabilities by file type',
    schema: {
      type: 'object',
      properties: {
        provider: { type: 'string', example: 'google_genai' },
        capabilities: {
          type: 'object',
          properties: {
            audio: { type: 'boolean', example: true },
            image: { type: 'boolean', example: true },
            video: { type: 'boolean', example: true },
            document: { type: 'boolean', example: false },
          },
        },
      },
    },
  })
  getCapabilities() {
    const providers = this.aiFilesService.getAvailableProviders();
    const provider = providers[0] || 'google_genai';

    return {
      provider,
      capabilities: {
        audio: this.aiFilesService.providerSupportsFileType(
          FileType.AUDIO,
          provider,
        ),
        image: this.aiFilesService.providerSupportsFileType(
          FileType.IMAGE,
          provider,
        ),
        video: this.aiFilesService.providerSupportsFileType(
          FileType.VIDEO,
          provider,
        ),
        document: this.aiFilesService.providerSupportsFileType(
          FileType.DOCUMENT,
          provider,
        ),
      },
    };
  }

  @Post('validate-spelling')
  @ApiOperation({
    summary: 'Validate word spelling from audio recording',
    description:
      'Upload an audio file where a person spells a word letter by letter. ' +
      'The AI will transcribe the letters and validate if the spelling is correct.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Spelling validation result',
    type: SpellingValidationResponseDto,
  })
  @FormDataRequest()
  async validateSpelling(
    @Body() dto: ValidateSpellingDto,
  ): Promise<SpellingValidationResponseDto> {
    const audioInput = this.aiFilesService.filePathToFileInput(
      dto.audio.path,
      this.getMimeTypeFromFile(dto.audio.path, 'audio'),
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

  @Post('process-audio')
  @ApiOperation({
    summary: 'Process audio with custom prompt',
    description:
      'Upload an audio file and provide a custom system prompt for AI processing. ' +
      'Use this for custom audio analysis, transcription, or any audio-related task.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Audio processing result',
    type: FileProcessingResponseDto,
  })
  @FormDataRequest()
  async processAudio(
    @Body() dto: ProcessAudioDto,
  ): Promise<FileProcessingResponseDto> {
    const audioInput = this.aiFilesService.filePathToFileInput(
      dto.audio.path,
      this.getMimeTypeFromFile(dto.audio.path, 'audio'),
      FileType.AUDIO,
    );

    const result = await this.aiFilesService.processSingleFile(
      audioInput,
      dto.systemPrompt,
      dto.userPrompt,
      0.2,
      dto.provider,
    );

    return result;
  }

  @Post('create-story')
  @ApiOperation({
    summary: 'Create story from images',
    description:
      'Upload one or more images and the AI will create a story that connects them. ' +
      'Perfect for creative writing exercises or image-based comprehension.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Story creation result',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        story: {
          type: 'string',
          example: 'Once upon a time, there was a beautiful landscape...',
        },
        provider: { type: 'string', example: 'google_genai' },
        model: { type: 'string', example: 'gemini-2.0-flash-exp' },
        error: { type: 'string' },
      },
    },
  })
  @FormDataRequest()
  async createStory(@Body() dto: CreateStoryFromImagesDto) {
    const imageInputs = dto.images.map((img) =>
      this.aiFilesService.filePathToFileInput(
        img.path,
        this.getMimeTypeFromFile(img.path, 'image'),
        FileType.IMAGE,
      ),
    );

    const result = await this.aiFilesService.createStoryFromImages(
      imageInputs,
      dto.storyType || 'short',
      dto.additionalInstructions,
      dto.provider,
    );

    return {
      success: result.success,
      story: result.data,
      provider: result.provider,
      model: result.model,
      error: result.error,
    };
  }

  @Post('process-images')
  @ApiOperation({
    summary: 'Process images with custom prompt',
    description:
      'Upload one or more images and provide a custom system prompt for AI processing. ' +
      'Use this for image description, analysis, comparison, or any image-related task.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Image processing result',
    type: FileProcessingResponseDto,
  })
  @FormDataRequest()
  async processImages(
    @Body() dto: ProcessImagesDto,
  ): Promise<FileProcessingResponseDto> {
    // Normalize images to array (Swagger sometimes sends single object)
    let images = dto.images;
    if (!Array.isArray(images)) {
      images = images ? [images as any] : [];
    }

    const imageInputs = images.map((img) =>
      this.aiFilesService.filePathToFileInput(
        img.path,
        this.getMimeTypeFromFile(img.path, 'image'),
        FileType.IMAGE,
      ),
    );

    const result = await this.aiFilesService.processMultipleFiles(
      {
        files: imageInputs,
        systemPrompt: dto.systemPrompt,
        userPrompt: dto.userPrompt,
      },
      dto.provider,
    );

    return result;
  }

  @Post('analyze-images')
  @ApiOperation({
    summary: 'Analyze images (describe, compare, find connections)',
    description:
      'Upload images and choose an analysis type: describe each image, ' +
      'compare them, or find connections between them.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Image analysis result',
    type: FileProcessingResponseDto,
  })
  @FormDataRequest()
  async analyzeImages(
    @Body()
    dto: {
      images: any[];
      analysisType: 'describe' | 'compare' | 'find-connections';
      provider?: string;
    },
  ): Promise<FileProcessingResponseDto> {
    const imageInputs = dto.images.map((img) =>
      this.aiFilesService.filePathToFileInput(
        img.path,
        this.getMimeTypeFromFile(img.path, 'image'),
        FileType.IMAGE,
      ),
    );

    const result = await this.aiFilesService.analyzeImages(
      imageInputs,
      dto.analysisType || 'describe',
      dto.provider,
    );

    return result;
  }

  /**
   * Helper method to determine MIME type from file extension
   */
  private getMimeTypeFromFile(
    filePath: string,
    fileType: 'audio' | 'image' | 'video',
  ): SupportedMimeType {
    const ext = filePath.split('.').pop()?.toLowerCase();

    if (fileType === 'audio') {
      const audioTypes: Record<string, SupportedMimeType> = {
        mp3: SupportedMimeType.AUDIO_MP3,
        wav: SupportedMimeType.AUDIO_WAV,
        ogg: SupportedMimeType.AUDIO_OGG,
        flac: SupportedMimeType.AUDIO_FLAC,
        m4a: SupportedMimeType.AUDIO_M4A,
      };
      return audioTypes[ext || 'mp3'] || SupportedMimeType.AUDIO_MP3;
    }

    if (fileType === 'image') {
      const imageTypes: Record<string, SupportedMimeType> = {
        jpg: SupportedMimeType.IMAGE_JPEG,
        jpeg: SupportedMimeType.IMAGE_JPEG,
        png: SupportedMimeType.IMAGE_PNG,
        webp: SupportedMimeType.IMAGE_WEBP,
        gif: SupportedMimeType.IMAGE_GIF,
      };
      return imageTypes[ext || 'jpg'] || SupportedMimeType.IMAGE_JPEG;
    }

    if (fileType === 'video') {
      const videoTypes: Record<string, SupportedMimeType> = {
        mp4: SupportedMimeType.VIDEO_MP4,
        webm: SupportedMimeType.VIDEO_WEBM,
        mov: SupportedMimeType.VIDEO_MOV,
      };
      return videoTypes[ext || 'mp4'] || SupportedMimeType.VIDEO_MP4;
    }

    return SupportedMimeType.AUDIO_MP3; // Default
  }
}
