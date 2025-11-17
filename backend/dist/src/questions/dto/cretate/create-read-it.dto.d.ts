import { BaseCreateQuestionDto } from './base-question.dto';
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
export declare class CreateReadItDto extends BaseCreateQuestionDto {
    content: PassageDto[];
    subQuestions: SubQuestionDto[];
    parentQuestionId?: string;
}
