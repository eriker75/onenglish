export declare class StudentAnswer {
    id: string;
    studentId: string;
    questionId: string;
    challengeId: string;
    userAnswer: any;
    isCorrect: boolean;
    attemptNumber: number;
    timeSpent: number;
    pointsEarned: number;
    feedbackEnglish?: string;
    feedbackSpanish?: string;
    audioUrl?: string;
    answeredAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
