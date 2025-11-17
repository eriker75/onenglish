import { Student as PrismaStudent } from '@prisma/client';
export declare class Student implements PrismaStudent {
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
