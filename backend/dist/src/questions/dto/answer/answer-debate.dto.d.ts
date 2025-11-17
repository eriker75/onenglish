import { FileSystemStoredFile } from 'nestjs-form-data';
export declare enum DebateStance {
    SUPPORT = "support",
    OPPOSE = "oppose"
}
export declare class AnswerDebateDto {
    audio: FileSystemStoredFile;
    stance: DebateStance;
    timeSpent?: number;
}
