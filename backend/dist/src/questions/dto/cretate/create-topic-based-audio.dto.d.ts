import { BaseCreateQuestionDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class AudioSubQuestionDto {
    text: string;
    points: number;
    options: string[];
    answer: string;
}
declare const CreateTopicBasedAudioDto_base: import("@nestjs/common").Type<Omit<BaseCreateQuestionDto, "points">>;
export declare class CreateTopicBasedAudioDto extends CreateTopicBasedAudioDto_base {
    points?: number;
    media: FileSystemStoredFile;
    subQuestions: string;
    parentQuestionId?: string;
}
export {};
