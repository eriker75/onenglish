import { BaseCreateQuestionDto } from './base-question.dto';
export declare enum DebateStance {
    SUPPORT = "support",
    OPPOSE = "oppose",
    RANDOM = "random"
}
export declare class CreateDebateDto extends BaseCreateQuestionDto {
    content: string;
    stance: DebateStance;
}
