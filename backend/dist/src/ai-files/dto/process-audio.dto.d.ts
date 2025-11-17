import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class ProcessAudioDto {
    audio: FileSystemStoredFile;
    systemPrompt: string;
    userPrompt?: string;
    provider?: string;
}
export declare class ValidateSpellingDto {
    audio: FileSystemStoredFile;
    expectedWord?: string;
    provider?: string;
}
