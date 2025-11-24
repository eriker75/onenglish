import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class CreateImageToMultipleChoicesDto extends BaseCreateQuestionWithoutStageDto {
    image: FileSystemStoredFile;
    options: string[];
    answer: string;
}
