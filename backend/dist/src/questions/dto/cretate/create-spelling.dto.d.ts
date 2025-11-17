import { BaseCreateQuestionDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class CreateSpellingDto extends BaseCreateQuestionDto {
    media: FileSystemStoredFile;
    answer: string;
}
