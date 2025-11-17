import { School as PrismaSchool } from '@prisma/client';
export declare class School implements PrismaSchool {
    id: string;
    schoolId: number;
    name: string;
    code: string;
    type: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    country: string;
    address: string | null;
    postalCode: string | null;
    website: string | null;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
