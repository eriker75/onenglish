import { QuestionStage } from '@prisma/client';
export declare class BaseCreateQuestionWithoutStageDto {
    challengeId: string;
    points: number;
    timeLimit: number;
    maxAttempts: number;
    text?: string;
    instructions?: string;
}
export declare class BaseCreateQuestionDto extends BaseCreateQuestionWithoutStageDto {
    stage: QuestionStage;
}
