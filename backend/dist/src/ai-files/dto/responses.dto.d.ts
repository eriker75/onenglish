export declare class SpellingValidationResponseDto {
    success: boolean;
    isCorrect: boolean;
    speltWord: string;
    transcription: string;
    analysis: string;
    provider: string;
    model: string;
    error?: string;
}
export declare class FileProcessingResponseDto {
    success: boolean;
    data: string;
    provider: string;
    model: string;
    error?: string;
}
export declare class StoryCreationResponseDto extends FileProcessingResponseDto {
    story: string;
}
