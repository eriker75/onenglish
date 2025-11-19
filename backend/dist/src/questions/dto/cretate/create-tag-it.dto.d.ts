import { BaseCreateQuestionDto } from './base-question.dto';
export declare class CreateTagItDto extends BaseCreateQuestionDto {
    content: string[];
    answer: string[];
    media?: any;
}
