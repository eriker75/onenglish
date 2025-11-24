import { BaseCreateQuestionWithoutStageDto } from './base-question.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
export declare enum DebateStance {
    SUPPORT = "support",
    OPPOSE = "oppose",
    RANDOM = "random"
}
export declare class CreateDebateDto extends BaseCreateQuestionWithoutStageDto {
    content: string;
    stance: DebateStance;
    image?: FileSystemStoredFile;
}
