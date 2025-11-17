export declare class CreateChallengeDto {
    title: string;
    slug: string;
    description?: string;
    category: string;
    level: string;
    difficulty: string;
    totalPoints?: number;
    isPublished?: boolean;
    isActive?: boolean;
}
