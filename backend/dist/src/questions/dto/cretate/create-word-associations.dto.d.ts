import { BaseCreateQuestionDto } from './base-question.dto';
export declare class CreateWordAssociationsDto extends BaseCreateQuestionDto {
    content: string;
    configuration: Record<string, unknown>;
    media?: any;
}
