import { IFilesProviderAdapter } from './interfaces/provider-adapter.interface';
import { FileInput, MultiFileInput, FileProcessingResult } from './interfaces/file-input.interface';
import { FileType, SupportedMimeType } from './enums/file-type.enum';
export declare class AiFilesService {
    private readonly logger;
    private adapters;
    private defaultProvider?;
    setDefaultProvider(provider: string): void;
    registerAdapter(adapter: IFilesProviderAdapter): void;
    private getAdapter;
    processSingleFile(file: FileInput, systemPrompt: string, userPrompt?: string, temperature?: number, provider?: string): Promise<FileProcessingResult<string>>;
    processMultipleFiles(input: MultiFileInput, provider?: string): Promise<FileProcessingResult<string>>;
    validateSpellingFromAudio(audioFile: FileInput, expectedWord?: string, provider?: string): Promise<FileProcessingResult<{
        isCorrect: boolean;
        speltWord: string;
        transcription: string;
        analysis: string;
    }>>;
    createStoryFromImages(images: FileInput[], storyType?: 'short' | 'detailed', additionalInstructions?: string, provider?: string): Promise<FileProcessingResult<string>>;
    analyzeImages(images: FileInput[], analysisType?: 'describe' | 'compare' | 'find-connections', provider?: string): Promise<FileProcessingResult<string>>;
    filePathToFileInput(filePath: string, mimeType: SupportedMimeType, fileType: FileType): FileInput;
    getAvailableProviders(): string[];
    providerSupportsFileType(fileType: FileType, provider?: string): boolean;
}
