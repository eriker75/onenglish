import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { VERB_TENSES } from '../../definitions/constants';
export declare class CreateTensesDto extends BaseCreateQuestionWithoutStageDto {
    content: string;
    options: VERB_TENSES[];
    answer: VERB_TENSES;
    media?: FileSystemStoredFile;
}
