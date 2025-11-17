import { BaseCreateQuestionDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
export declare class CreateWordMatchDto extends BaseCreateQuestionDto {
    media: FileSystemStoredFile[];
    options: string[];
    answer: string;
}
