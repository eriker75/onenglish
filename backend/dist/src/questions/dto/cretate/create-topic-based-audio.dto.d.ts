import { BaseCreateQuestionDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class AudioSubQuestionDto {
    text: string;
    points: number;
    options: string[];
    answer: string;
}
export declare class CreateTopicBasedAudioDto extends BaseCreateQuestionDto {
    media: FileSystemStoredFile;
    subQuestions: AudioSubQuestionDto[];
    parentQuestionId?: string;
}
