import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class ProcessImagesDto {
    images: FileSystemStoredFile[];
    systemPrompt: string;
    userPrompt?: string;
    provider?: string;
}
export declare class CreateStoryFromImagesDto {
    images: FileSystemStoredFile[];
    storyType?: 'short' | 'detailed';
    additionalInstructions?: string;
    provider?: string;
}
