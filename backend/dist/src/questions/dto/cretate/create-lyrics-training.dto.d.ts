import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class CreateLyricsTrainingDto extends BaseCreateQuestionWithoutStageDto {
    video: FileSystemStoredFile;
    answer: string;
    options: string[];
}
