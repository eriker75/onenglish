import { Admin as PrismaAdmin } from '@prisma/client';
export declare class Admin implements PrismaAdmin {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    bio: string | null;
    avatar: string | null;
    isActive: boolean;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
