import { QuestionStage } from '@prisma/client';
export declare class BaseCreateQuestionDto {
    challengeId: string;
    stage: QuestionStage;
    phase: string;
    points: number;
    timeLimit: number;
    maxAttempts: number;
    text?: string;
    instructions?: string;
}
