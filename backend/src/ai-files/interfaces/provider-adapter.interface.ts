import { FileInput, MultiFileInput } from './file-input.interface';

export interface IFilesProviderAdapter {
  /**
   * Provider name (gemini, openai, anthropic, etc.)
   */
  getProviderName(): string;

  /**
   * Model name (gemini-1.5-flash, gpt-4, etc.)
   */
  getModelName(): string;

  /**
   * Check if this adapter supports the given file type
   */
  supportsFileType(fileType: string): boolean;

  /**
   * Process a single file with AI
   */
  processSingleFile(
    file: FileInput,
    systemPrompt: string,
    userPrompt?: string,
    temperature?: number,
  ): Promise<string>;

  /**
   * Process multiple files with AI
   */
  processMultipleFiles(input: MultiFileInput): Promise<string>;

  /**
   * Process audio specifically (for spelling validation, transcription, etc.)
   */
  processAudio(
    audioFile: FileInput,
    systemPrompt: string,
    expectedOutput?: 'text' | 'json',
  ): Promise<string>;

  /**
   * Process images (for description, analysis, story creation, etc.)
   */
  processImages(
    images: FileInput[],
    systemPrompt: string,
    userPrompt?: string,
  ): Promise<string>;
}
