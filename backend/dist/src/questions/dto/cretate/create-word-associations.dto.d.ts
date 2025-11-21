import { FileSystemStoredFile } from 'nestjs-form-data';
import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
export declare class CreateWordAssociationsDto extends BaseCreateQuestionWithoutStageDto {
    content: string;
    maxAssociations: number;
    media?: FileSystemStoredFile;
}
