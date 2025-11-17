import { BaseCreateQuestionDto } from './base-question.dto';
export declare class CreateFastTestDto extends BaseCreateQuestionDto {
    content: string[];
    options: string[];
    answer: string;
}
