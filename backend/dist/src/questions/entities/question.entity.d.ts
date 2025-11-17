import { QuestionStage, ValidationMethod } from '@prisma/client';
export declare class Question {
    id: string;
    challengeId: string;
    stage: QuestionStage;
    phase: string;
    position: number;
    type: string;
    points: number;
    timeLimit: number;
    maxAttempts: number;
    text: string;
    instructions: string;
    validationMethod: ValidationMethod;
    content?: any;
    options?: any;
    answer?: any;
    configuration?: any;
    parentQuestionId?: string;
    createdAt: Date;
    updatedAt: Date;
}
