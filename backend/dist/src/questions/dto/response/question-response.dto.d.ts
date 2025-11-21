import { QuestionStage, ValidationMethod } from '@prisma/client';
export declare class QuestionResponseDto {
    id: string;
    challengeId: string;
    stage: QuestionStage;
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
    parentQuestionId?: string;
    subQuestions?: QuestionResponseDto[];
    media?: any[];
    configurations?: Record<string, string>;
    createdAt: Date;
    updatedAt: Date;
}
export declare class ValidationResponseDto {
    success: boolean;
    isCorrect: boolean;
    pointsEarned: number;
    feedbackEnglish?: string;
    feedbackSpanish?: string;
    details?: any;
    studentAnswer: {
        id: string;
        questionId: string;
        studentId: string;
        isCorrect: boolean;
        pointsEarned: number;
        attemptNumber: number;
        timeSpent: number;
    };
}
export declare class SchoolStatsResponseDto {
    questionId: string;
    questionText: string;
    questionType: string;
    totalAttempts: number;
    correctAnswers: number;
    averageTime: number;
    successRate: number;
}
export declare class BulkOperationResponseDto {
    successCount: number;
    failureCount: number;
    totalCount: number;
    errors?: Array<{
        questionId: string;
        error: string;
    }>;
    results: QuestionResponseDto[];
}
