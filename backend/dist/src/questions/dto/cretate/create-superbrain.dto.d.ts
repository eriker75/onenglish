import { FileSystemStoredFile } from 'nestjs-form-data';
import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
export declare class CreateSuperbrainDto extends BaseCreateQuestionWithoutStageDto {
    content: string;
    image?: FileSystemStoredFile;
}
