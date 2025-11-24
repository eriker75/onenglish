import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class CreateTagItDto extends BaseCreateQuestionWithoutStageDto {
    content: string[];
    answer: string[];
    image?: FileSystemStoredFile;
}
