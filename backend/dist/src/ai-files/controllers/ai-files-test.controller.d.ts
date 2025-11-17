import { AiFilesService } from '../ai-files.service';
import { ProcessAudioDto, ValidateSpellingDto } from '../dto/process-audio.dto';
import { ProcessImagesDto, CreateStoryFromImagesDto } from '../dto/process-image.dto';
import { SpellingValidationResponseDto, FileProcessingResponseDto } from '../dto/responses.dto';
export declare class AiFilesTestController {
    private readonly aiFilesService;
    constructor(aiFilesService: AiFilesService);
    getProviders(): {
        providers: string[];
        count: number;
    };
    getCapabilities(): {
        provider: string;
        capabilities: {
            audio: boolean;
            image: boolean;
            video: boolean;
            document: boolean;
        };
    };
    validateSpelling(dto: ValidateSpellingDto): Promise<SpellingValidationResponseDto>;
    processAudio(dto: ProcessAudioDto): Promise<FileProcessingResponseDto>;
    createStory(dto: CreateStoryFromImagesDto): Promise<{
        success: boolean;
        story: string;
        provider: string;
        model: string;
        error: string | undefined;
    }>;
    processImages(dto: ProcessImagesDto): Promise<FileProcessingResponseDto>;
    analyzeImages(dto: {
        images: any[];
        analysisType: 'describe' | 'compare' | 'find-connections';
        provider?: string;
    }): Promise<FileProcessingResponseDto>;
    private getMimeTypeFromFile;
}
