import { FileSystemStoredFile } from 'nestjs-form-data';
import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
export declare class CreateTellMeAboutItDto extends BaseCreateQuestionWithoutStageDto {
    content: string;
    image?: FileSystemStoredFile;
}
