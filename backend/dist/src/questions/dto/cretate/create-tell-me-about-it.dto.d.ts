import { FileSystemStoredFile } from 'nestjs-form-data';
import { BaseCreateQuestionDto } from './base-question.dto';
export declare class CreateTellMeAboutItDto extends BaseCreateQuestionDto {
    content: string;
    media?: FileSystemStoredFile;
}
