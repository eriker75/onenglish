export declare class Challenge {
    id: string;
    name: string;
    grade: string;
    type: string;
    isDemo: boolean;
    year: number | null;
    exactDate: Date | null;
    stage: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    totalQuestions?: number;
    totalTime?: number;
}
