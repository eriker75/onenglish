import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { IFilesProviderAdapter } from '../interfaces/provider-adapter.interface';
import { FileInput, MultiFileInput } from '../interfaces/file-input.interface';
import { FileType } from '../enums/file-type.enum';

export interface GeminiAdapterOptions {
  apiKey: string;
  model: string; // 'gemini-2.0-flash-exp', 'gemini-1.5-pro', etc.
  defaultTemperature?: number;
}

@Injectable()
export class GeminiFilesAdapter implements IFilesProviderAdapter {
  private readonly logger = new Logger(GeminiFilesAdapter.name);
  private client: any | null = null;
  private readonly model: string;
  private readonly defaultTemperature: number;

  constructor(private readonly options: GeminiAdapterOptions) {
    this.model = options.model;
    this.defaultTemperature = options.defaultTemperature ?? 0.2;
  }

  private getClient(): any {
    if (this.client) {
      return this.client;
    }
    const client = new GoogleGenAI({ apiKey: this.options.apiKey });
    this.client = client;
    return client;
  }

  getProviderName(): string {
    return 'google_genai';
  }

  getModelName(): string {
    return this.model;
  }

  supportsFileType(fileType: string): boolean {
    // Gemini supports audio, image, and video
    const supportedTypes = [FileType.AUDIO, FileType.IMAGE, FileType.VIDEO];
    return supportedTypes.includes(fileType as FileType);
  }

  async processSingleFile(
    file: FileInput,
    systemPrompt: string,
    userPrompt?: string,
    temperature?: number,
  ): Promise<string> {
    const client = this.getClient();

    const parts: any[] = [
      {
        inlineData: {
          mimeType: file.mimeType,
          data: file.data,
        },
      },
    ];

    if (userPrompt) {
      parts.push({ text: userPrompt });
    }

    try {
      const result = await client.models.generateContent({
        model: this.model,
        contents: parts,
        config: {
          systemInstruction: systemPrompt,
          temperature: temperature ?? this.defaultTemperature,
        },
      });
      return result.text || '';
    } catch (error) {
      this.logger.error(`Error processing file with Gemini: ${error.message}`);
      throw error;
    }
  }

  async processMultipleFiles(input: MultiFileInput): Promise<string> {
    const client = this.getClient();

    const parts: any[] = input.files.map((file) => ({
      inlineData: {
        mimeType: file.mimeType,
        data: file.data,
      },
    }));

    if (input.userPrompt) {
      parts.push({ text: input.userPrompt });
    }

    // DEBUG: Log what we're sending
    this.logger.debug(`Processing ${input.files.length} files`);
    this.logger.debug(
      `Parts structure: ${JSON.stringify(
        parts.map((p) => ({
          hasInlineData: !!p.inlineData,
          mimeType: p.inlineData?.mimeType,
          dataLength: p.inlineData?.data?.length || 0,
          hasText: !!p.text,
        })),
      )}`,
    );

    try {
      const result = await client.models.generateContent({
        model: this.model,
        contents: parts,
        config: {
          systemInstruction: input.systemPrompt,
          temperature: input.temperature ?? this.defaultTemperature,
        },
      });
      return result.text || '';
    } catch (error) {
      this.logger.error(
        `Error processing multiple files with Gemini: ${error.message}`,
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

    let enhancedPrompt = systemPrompt;
    if (expectedOutput === 'json') {
      enhancedPrompt +=
        '\n\nRespond ONLY with valid JSON (no markdown, no additional text).';
    }

    return this.processSingleFile(audioFile, enhancedPrompt);
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
