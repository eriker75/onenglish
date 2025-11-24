import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class AudioSubQuestionDto {
    content: string;
    points: number;
    options: string[];
    answer: string;
}
declare const CreateTopicBasedAudioDto_base: import("@nestjs/common").Type<Omit<BaseCreateQuestionWithoutStageDto, "points">>;
export declare class CreateTopicBasedAudioDto extends CreateTopicBasedAudioDto_base {
    points?: number;
    audio: FileSystemStoredFile;
    subQuestions: string;
    parentQuestionId?: string;
}
export {};
