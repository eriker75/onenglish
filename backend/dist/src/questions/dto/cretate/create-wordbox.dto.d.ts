import { BaseCreateQuestionDto } from './base-question.dto';
export declare class CreateWordboxDto extends BaseCreateQuestionDto {
    gridWidth: number;
    gridHeight: number;
    maxWords: number;
    content: string[][];
}
