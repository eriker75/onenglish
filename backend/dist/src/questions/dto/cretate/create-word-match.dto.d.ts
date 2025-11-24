import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class CreateWordMatchDto extends BaseCreateQuestionWithoutStageDto {
    audio: FileSystemStoredFile;
    options: string[];
    answer: string;
}
