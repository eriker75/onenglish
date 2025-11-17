import { BaseCreateQuestionDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class CreateSentenceMakerDto extends BaseCreateQuestionDto {
    media: FileSystemStoredFile[];
}
