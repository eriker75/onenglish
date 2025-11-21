import { QuestionStage } from '@prisma/client';
export declare class UpdateQuestionDto {
    text?: string;
    instructions?: string;
    timeLimit?: number;
    maxAttempts?: number;
    points?: number;
    stage?: QuestionStage;
    position?: number;
    content?: any;
    options?: any;
    answer?: any;
}
export declare class UpdateQuestionTextDto {
    text: string;
}
export declare class UpdateQuestionInstructionsDto {
    instructions: string;
}
export declare class UpdateQuestionTimeLimitDto {
    timeLimit: number;
}
export declare class UpdateQuestionPointsDto {
    points: number;
}
export declare class BulkUpdateQuestionsDto {
    updates: Array<{
        questionId: string;
        data: Partial<UpdateQuestionDto>;
    }>;
}
