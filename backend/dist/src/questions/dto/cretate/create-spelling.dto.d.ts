import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class CreateSpellingDto extends BaseCreateQuestionWithoutStageDto {
    media: FileSystemStoredFile;
    answer: string;
}
