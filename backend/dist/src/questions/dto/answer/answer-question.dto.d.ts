import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class AnswerQuestionDto {
    userAnswer: string | string[] | object;
}
export declare class AnswerAudioQuestionDto {
    audio: FileSystemStoredFile;
    timeSpent?: number;
}
export declare class AnswerMultipleChoiceDto {
    userAnswer: string;
}
export declare class AnswerMultipleSelectionDto {
    userAnswer: string[];
}
export declare class AnswerTextDto {
    userAnswer: string;
}
export declare class AnswerWithSubQuestionsDto {
    userAnswer: Record<string, string>;
}
export declare class AnswerWordboxDto {
    userAnswer: string[];
    timeSpent?: number;
}
export declare class AnswerWordAssociationsDto {
    userAnswer: string[];
    timeSpent?: number;
}
