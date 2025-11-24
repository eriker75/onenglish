import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class CreateTalesDto extends BaseCreateQuestionWithoutStageDto {
    images: FileSystemStoredFile[];
}
