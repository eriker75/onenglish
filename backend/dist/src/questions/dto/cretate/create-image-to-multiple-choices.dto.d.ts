import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class CreateImageToMultipleChoicesDto extends BaseCreateQuestionWithoutStageDto {
    media: FileSystemStoredFile;
    options: string[];
    answer: string;
}
