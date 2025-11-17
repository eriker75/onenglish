import { FileInput, MultiFileInput } from './file-input.interface';
export interface IFilesProviderAdapter {
    getProviderName(): string;
    getModelName(): string;
    supportsFileType(fileType: string): boolean;
    processSingleFile(file: FileInput, systemPrompt: string, userPrompt?: string, temperature?: number): Promise<string>;
    processMultipleFiles(input: MultiFileInput): Promise<string>;
    processAudio(audioFile: FileInput, systemPrompt: string, expectedOutput?: 'text' | 'json'): Promise<string>;
    processImages(images: FileInput[], systemPrompt: string, userPrompt?: string): Promise<string>;
}
