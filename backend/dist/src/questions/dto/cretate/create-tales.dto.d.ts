import { BaseCreateQuestionDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class CreateTalesDto extends BaseCreateQuestionDto {
    media: FileSystemStoredFile[];
}
