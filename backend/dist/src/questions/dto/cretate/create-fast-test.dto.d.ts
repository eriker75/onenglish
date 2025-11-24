import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
export declare class CreateFastTestDto extends BaseCreateQuestionWithoutStageDto {
    content: string[];
    options: string[];
    answer: string;
}
