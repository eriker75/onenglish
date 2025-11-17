import { FileType, SupportedMimeType } from '../enums/file-type.enum';

export interface FileInput {
  data: string; // Base64 encoded
  mimeType: SupportedMimeType;
  fileType: FileType;
  fileName?: string;
}

export interface MultiFileInput {
  files: FileInput[];
  systemPrompt: string;
  userPrompt?: string;
  temperature?: number;
}

export interface FileProcessingResult<T = any> {
  success: boolean;
  data: T;
  provider: string;
  model: string;
  error?: string;
}
