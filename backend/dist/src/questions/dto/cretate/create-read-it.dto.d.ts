import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class CreateReadItDto extends BaseCreateQuestionWithoutStageDto {
    content: string;
    subQuestions: string;
    parentQuestionId?: string;
    image?: FileSystemStoredFile;
}
