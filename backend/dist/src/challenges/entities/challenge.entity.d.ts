import { Challenge as PrismaChallenge } from '@prisma/client';
export declare class Challenge implements PrismaChallenge {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    category: string;
    level: string;
    difficulty: string;
    totalPoints: number;
    isPublished: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
