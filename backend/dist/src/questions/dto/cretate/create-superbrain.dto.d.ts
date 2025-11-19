import { FileSystemStoredFile } from 'nestjs-form-data';
import { BaseCreateQuestionDto } from './base-question.dto';
export declare class CreateSuperbrainDto extends BaseCreateQuestionDto {
    content: string;
    media?: FileSystemStoredFile;
}
