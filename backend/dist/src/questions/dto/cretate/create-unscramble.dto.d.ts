import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class CreateUnscrambleDto extends BaseCreateQuestionWithoutStageDto {
    content: string[];
    answer: string[];
    media?: FileSystemStoredFile;
}
