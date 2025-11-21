import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
export declare class CreateWordboxDto extends BaseCreateQuestionWithoutStageDto {
    gridWidth: number;
    gridHeight: number;
    maxWords: number;
    content: string[][];
}
