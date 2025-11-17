import { Coordinator as PrismaCoordinator } from '@prisma/client';
export declare class Coordinator implements PrismaCoordinator {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    bio: string | null;
    avatar: string | null;
    isActive: boolean;
    schoolId: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
