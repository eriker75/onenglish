import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
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
export declare class CreateTensesDto extends BaseCreateQuestionWithoutStageDto {
    content: string;
    options: ValidTenses[];
    answer: ValidTenses;
    media?: FileSystemStoredFile;
}
export {};
