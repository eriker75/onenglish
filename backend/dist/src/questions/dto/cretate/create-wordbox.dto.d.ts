import { BaseCreateQuestionDto } from './base-question.dto';
export declare class CreateWordboxDto extends BaseCreateQuestionDto {
    content: string[][];
    configuration?: Record<string, unknown>;
}
