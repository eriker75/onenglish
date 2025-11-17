import { IFilesProviderAdapter } from '../interfaces/provider-adapter.interface';
import { FileInput, MultiFileInput } from '../interfaces/file-input.interface';
export interface GeminiAdapterOptions {
    apiKey: string;
    model: string;
    defaultTemperature?: number;
}
export declare class GeminiFilesAdapter implements IFilesProviderAdapter {
    private readonly options;
    private readonly logger;
    private client;
    private readonly model;
    private readonly defaultTemperature;
    constructor(options: GeminiAdapterOptions);
    private getClient;
    getProviderName(): string;
    getModelName(): string;
    supportsFileType(fileType: string): boolean;
    processSingleFile(file: FileInput, systemPrompt: string, userPrompt?: string, temperature?: number): Promise<string>;
    processMultipleFiles(input: MultiFileInput): Promise<string>;
    processAudio(audioFile: FileInput, systemPrompt: string, expectedOutput?: 'text' | 'json'): Promise<string>;
    processImages(images: FileInput[], systemPrompt: string, userPrompt?: string): Promise<string>;
}
