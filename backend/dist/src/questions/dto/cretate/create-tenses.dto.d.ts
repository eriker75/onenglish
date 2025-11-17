import { BaseCreateQuestionDto } from './base-question.dto';
declare enum ValidTenses {
    PRESENT_SIMPLE = "present_simple",
    PAST_SIMPLE = "past_simple",
    FUTURE_SIMPLE = "future_simple",
    PRESENT_CONTINUOUS = "present_continuous",
    PAST_CONTINUOUS = "past_continuous",
    FUTURE_CONTINUOUS = "future_continuous",
    PRESENT_PERFECT = "present_perfect",
    PAST_PERFECT = "past_perfect",
    FUTURE_PERFECT = "future_perfect"
}
export declare class CreateTensesDto extends BaseCreateQuestionDto {
    content: string;
    options: ValidTenses[];
    answer: ValidTenses;
}
export {};
