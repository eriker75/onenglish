import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { IFilesProviderAdapter } from '../interfaces/provider-adapter.interface';
import { FileInput, MultiFileInput } from '../interfaces/file-input.interface';
import { FileType } from '../enums/file-type.enum';

export interface OpenAIAdapterOptions {
  apiKey: string;
  visionModel?: string; // 'gpt-4o', 'gpt-4-turbo', 'gpt-4o-mini'
  audioModel?: string; // 'whisper-1'
  defaultTemperature?: number;
}

@Injectable()
export class OpenAIFilesAdapter implements IFilesProviderAdapter {
  private readonly logger = new Logger(OpenAIFilesAdapter.name);
  private client: OpenAI | null = null;
  private readonly visionModel: string;
  private readonly audioModel: string;
  private readonly defaultTemperature: number;

  constructor(private readonly options: OpenAIAdapterOptions) {
    this.visionModel = options.visionModel ?? 'gpt-4o';
    this.audioModel = options.audioModel ?? 'whisper-1';
    this.defaultTemperature = options.defaultTemperature ?? 0.2;
  }

  private getClient(): OpenAI {
    if (this.client) {
      return this.client;
    }
    this.client = new OpenAI({ apiKey: this.options.apiKey });
    return this.client;
  }

  getProviderName(): string {
    return 'openai';
  }

  getModelName(): string {
    return this.visionModel;
  }

  supportsFileType(fileType: string): boolean {
    // OpenAI supports audio and image (no video support)
    const supportedTypes = [FileType.AUDIO, FileType.IMAGE];
    return supportedTypes.includes(fileType as FileType);
  }

  async processSingleFile(
    file: FileInput,
    systemPrompt: string,
    userPrompt?: string,
    temperature?: number,
  ): Promise<string> {
    if (file.fileType === FileType.IMAGE) {
      return this.processImageWithVision(
        file,
        systemPrompt,
        userPrompt,
        temperature,
      );
    } else if (file.fileType === FileType.AUDIO) {
      return this.processAudio(file, systemPrompt);
    } else {
      throw new Error(`Unsupported file type: ${file.fileType}`);
    }
  }

  private async processImageWithVision(
    image: FileInput,
    systemPrompt: string,
    userPrompt?: string,
    temperature?: number,
  ): Promise<string> {
    const client = this.getClient();

    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${image.mimeType};base64,${image.data}`,
              },
            },
          ],
        },
      ];

      // Add user prompt if provided
      if (userPrompt) {
        messages.push({
          role: 'user',
          content: userPrompt,
        });
      }

      const response = await client.chat.completions.create({
        model: this.visionModel,
        messages,
        temperature: temperature ?? this.defaultTemperature,
        max_tokens: 4096,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      this.logger.error(`Error processing image with OpenAI: ${error.message}`);
      throw error;
    }
  }

  async processMultipleFiles(input: MultiFileInput): Promise<string> {
    const client = this.getClient();

    // Check if all files are images
    const allImages = input.files.every((f) => f.fileType === FileType.IMAGE);
    if (!allImages) {
      throw new Error(
        'OpenAI adapter only supports processing multiple images at once',
      );
    }

    try {
      const content: OpenAI.Chat.ChatCompletionContentPart[] = input.files.map(
        (file) => ({
          type: 'image_url',
          image_url: {
            url: `data:${file.mimeType};base64,${file.data}`,
          },
        }),
      );

      // Add user prompt if provided
      if (input.userPrompt) {
        content.push({
          type: 'text',
          text: input.userPrompt,
        });
      }

      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: input.systemPrompt,
        },
        {
          role: 'user',
          content,
        },
      ];

      this.logger.debug(`Processing ${input.files.length} images with OpenAI`);

      const response = await client.chat.completions.create({
        model: this.visionModel,
        messages,
        temperature: input.temperature ?? this.defaultTemperature,
        max_tokens: 4096,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      this.logger.error(
        `Error processing multiple files with OpenAI: ${error.message}`,
      );
      throw error;
    }
  }

  async processAudio(
    audioFile: FileInput,
    systemPrompt: string,
    expectedOutput: 'text' | 'json' = 'text',
  ): Promise<string> {
    if (audioFile.fileType !== FileType.AUDIO) {
      throw new Error('File must be of type AUDIO');
    }

    const client = this.getClient();

    try {
      // Step 1: Transcribe audio with Whisper
      this.logger.debug('Transcribing audio with Whisper...');

      // Convert base64 to buffer for Whisper
      const audioBuffer = Buffer.from(audioFile.data, 'base64');

      // Create a File object from the buffer
      const file = new File([audioBuffer], audioFile.fileName || 'audio.mp3', {
        type: audioFile.mimeType,
      });

      const transcription = await client.audio.transcriptions.create({
        file: file,
        model: this.audioModel,
      });

      this.logger.debug(`Transcription: ${transcription.text}`);

      // Step 2: Use GPT to analyze the transcription with the system prompt
      this.logger.debug('Analyzing transcription with GPT...');

      let enhancedPrompt = systemPrompt;
      if (expectedOutput === 'json') {
        enhancedPrompt +=
          '\n\nRespond ONLY with valid JSON (no markdown, no additional text).';
      }

      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: enhancedPrompt,
        },
        {
          role: 'user',
          content: `Transcription: ${transcription.text}`,
        },
      ];

      const response = await client.chat.completions.create({
        model: this.visionModel, // Using vision model for text analysis too
        messages,
        temperature: this.defaultTemperature,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      this.logger.error(`Error processing audio with OpenAI: ${error.message}`);
      throw error;
    }
  }

  async processImages(
    images: FileInput[],
    systemPrompt: string,
    userPrompt?: string,
  ): Promise<string> {
    // Validate all files are images
    const invalidFiles = images.filter(
      (img) => img.fileType !== FileType.IMAGE,
    );
    if (invalidFiles.length > 0) {
      throw new Error('All files must be of type IMAGE');
    }

    return this.processMultipleFiles({
      files: images,
      systemPrompt,
      userPrompt,
    });
  }
}
