import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class CreateGossipDto extends BaseCreateQuestionWithoutStageDto {
    audio: FileSystemStoredFile;
    answer: string;
}
