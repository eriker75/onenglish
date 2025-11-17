import { BaseCreateQuestionDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class CreateGossipDto extends BaseCreateQuestionDto {
    media: FileSystemStoredFile;
    answer: string;
}
