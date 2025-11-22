import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class PassageDto {
    image?: string;
    text?: string;
}
export declare class SubQuestionDto {
    content: string;
    options: [boolean, boolean];
    answer: boolean;
    points: number;
}
export declare class CreateReadItDto extends BaseCreateQuestionWithoutStageDto {
    content: PassageDto[];
    subQuestions: SubQuestionDto[];
    parentQuestionId?: string;
    media?: FileSystemStoredFile;
}
