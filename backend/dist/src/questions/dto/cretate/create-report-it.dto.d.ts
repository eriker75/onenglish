import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class CreateReportItDto extends BaseCreateQuestionWithoutStageDto {
    content: string;
    media?: FileSystemStoredFile;
}
