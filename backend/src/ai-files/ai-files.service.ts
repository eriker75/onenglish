import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IFilesProviderAdapter } from './interfaces/provider-adapter.interface';
import {
  FileInput,
  MultiFileInput,
  FileProcessingResult,
} from './interfaces/file-input.interface';
import { FileType, SupportedMimeType } from './enums/file-type.enum';
import * as fs from 'fs';

@Injectable()
export class AiFilesService {
  private readonly logger = new Logger(AiFilesService.name);
  private adapters: Map<string, IFilesProviderAdapter> = new Map();
  private defaultProvider?: string;

  /**
   * Set default provider
   */
  setDefaultProvider(provider: string): void {
    this.defaultProvider = provider;
  }

  /**
   * Register a provider adapter
   */
  registerAdapter(adapter: IFilesProviderAdapter): void {
    this.adapters.set(adapter.getProviderName(), adapter);
    this.logger.log(`Registered adapter: ${adapter.getProviderName()}`);
  }

  /**
   * Get adapter by provider name
   */
  private getAdapter(provider?: string): IFilesProviderAdapter {
    const providerName = provider ?? this.defaultProvider;

    if (!providerName) {
      throw new NotFoundException(
        'No provider specified and no default provider configured',
      );
    }

    const adapter = this.adapters.get(providerName);
    if (!adapter) {
      throw new NotFoundException(
        `No adapter found for provider: ${providerName}. ` +
          `Available providers: ${Array.from(this.adapters.keys()).join(', ')}`,
      );
    }
    return adapter;
  }

  /**
   * Process a single file with specific provider
   */
  async processSingleFile(
    file: FileInput,
    systemPrompt: string,
    userPrompt?: string,
    temperature?: number,
    provider?: string,
  ): Promise<FileProcessingResult<string>> {
    const adapter = this.getAdapter(provider);

    if (!adapter.supportsFileType(file.fileType)) {
      return {
        success: false,
        data: '',
        provider: adapter.getProviderName(),
        model: 'unknown',
        error: `Provider ${adapter.getProviderName()} does not support ${file.fileType} files`,
      };
    }

    try {
      const result = await adapter.processSingleFile(
        file,
        systemPrompt,
        userPrompt,
        temperature,
      );

      return {
        success: true,
        data: result,
        provider: adapter.getProviderName(),
        model: adapter.getModelName(),
      };
    } catch (error) {
      this.logger.error(`Error processing file: ${error.message}`);
      return {
        success: false,
        data: '',
        provider: adapter.getProviderName(),
        model: adapter.getModelName(),
        error: error.message,
      };
    }
  }

  /**
   * Process multiple files with specific provider
   */
  async processMultipleFiles(
    input: MultiFileInput,
    provider?: string,
  ): Promise<FileProcessingResult<string>> {
    const adapter = this.getAdapter(provider);

    try {
      const result = await adapter.processMultipleFiles(input);

      return {
        success: true,
        data: result,
        provider: adapter.getProviderName(),
        model: adapter.getModelName(),
      };
    } catch (error) {
      this.logger.error(`Error processing multiple files: ${error.message}`);
      return {
        success: false,
        data: '',
        provider: adapter.getProviderName(),
        model: adapter.getModelName(),
        error: error.message,
      };
    }
  }

  /**
   * Validate spelling from audio file
   * High-level method for common use case
   */
  async validateSpellingFromAudio(
    audioFile: FileInput,
    expectedWord?: string,
    provider?: string,
  ): Promise<
    FileProcessingResult<{
      isCorrect: boolean;
      speltWord: string;
      transcription: string;
      analysis: string;
    }>
  > {
    const adapter = this.getAdapter(provider);

    const systemPrompt = expectedWord
      ? `You are a spelling validation assistant. Listen to the audio where a person spells a word letter by letter in English.
         The expected word is: "${expectedWord}"

         Your task:
         1. Transcribe the exact letters you hear
         2. Form the complete word from those letters
         3. Validate if the spelling matches the expected word
         4. Provide analysis of any mistakes`
      : `You are a spelling validation assistant. Listen to the audio where a person spells a word letter by letter in English.

         Your task:
         1. Transcribe the exact letters you hear
         2. Form the complete word from those letters
         3. Verify if it's a valid English word
         4. Provide analysis`;

    const userPrompt = `Respond ONLY in this JSON format (no markdown, no additional text):
{
  "transcription": "the exact letters you heard",
  "speltWord": "the word formed from the letters",
  "isCorrect": true or false,
  "analysis": "brief explanation"
}`;

    try {
      const response = await adapter.processAudio(
        audioFile,
        systemPrompt + '\n\n' + userPrompt,
        'json',
      );

      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from AI');
      }

      const data = JSON.parse(jsonMatch[0]);

      return {
        success: true,
        data,
        provider: adapter.getProviderName(),
        model: adapter.getProviderName(),
      };
    } catch (error) {
      this.logger.error(`Error validating spelling: ${error.message}`);
      return {
        success: false,
        data: {
          isCorrect: false,
          speltWord: '',
          transcription: '',
          analysis: `Error: ${error.message}`,
        },
        provider: adapter.getProviderName(),
        model: adapter.getProviderName(),
        error: error.message,
      };
    }
  }

  /**
   * Create story from images
   * High-level method for common use case
   */
  async createStoryFromImages(
    images: FileInput[],
    storyType: 'short' | 'detailed' = 'short',
    additionalInstructions?: string,
    provider?: string,
  ): Promise<FileProcessingResult<string>> {
    const systemPrompt = `You are a creative storytelling assistant. Your task is to create ${
      storyType === 'short' ? 'a short story or paragraph' : 'a detailed story'
    } that connects the images provided.

    Guidelines:
    - Be creative and engaging
    - Connect all images in a logical narrative
    - Use appropriate English level based on context
    - Make it interesting and coherent
    ${additionalInstructions ? `\n    - ${additionalInstructions}` : ''}`;

    const userPrompt = `Create ${storyType === 'short' ? 'a short story' : 'a detailed story'} that connects these images.`;

    return this.processMultipleFiles(
      {
        files: images,
        systemPrompt,
        userPrompt,
      },
      provider,
    );
  }

  /**
   * Analyze and describe images
   * High-level method for common use case
   */
  async analyzeImages(
    images: FileInput[],
    analysisType: 'describe' | 'compare' | 'find-connections' = 'describe',
    provider?: string,
  ): Promise<FileProcessingResult<string>> {
    const prompts = {
      describe: {
        system:
          'You are an image analysis assistant. Describe each image in detail.',
        user: 'Describe what you see in each image.',
      },
      compare: {
        system:
          'You are an image comparison assistant. Compare and contrast the images provided.',
        user: 'Compare these images. What are the similarities and differences?',
      },
      'find-connections': {
        system:
          'You are an image connection assistant. Find connections and relationships between the images.',
        user: 'Find connections between these images. How do they relate to each other?',
      },
    };

    const { system, user } = prompts[analysisType];

    return this.processMultipleFiles(
      {
        files: images,
        systemPrompt: system,
        userPrompt: user,
      },
      provider,
    );
  }

  /**
   * Utility: Convert file path to FileInput
   */
  filePathToFileInput(
    filePath: string,
    mimeType: SupportedMimeType,
    fileType: FileType,
  ): FileInput {
    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString('base64');

    return {
      data: base64Data,
      mimeType,
      fileType,
      fileName: filePath.split('/').pop(),
    };
  }

  /**
   * Get list of available providers
   */
  getAvailableProviders(): string[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * Check if provider supports file type
   */
  providerSupportsFileType(fileType: FileType, provider?: string): boolean {
    try {
      const adapter = this.getAdapter(provider);
      return adapter.supportsFileType(fileType);
    } catch {
      return false;
    }
  }
}
