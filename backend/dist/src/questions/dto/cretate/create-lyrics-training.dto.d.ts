import { BaseCreateQuestionDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class CreateLyricsTrainingDto extends BaseCreateQuestionDto {
    media: FileSystemStoredFile;
    answer: string;
    options: string[];
}
