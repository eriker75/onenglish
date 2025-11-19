import { PrismaService } from 'src/database/prisma.service';
export declare class MediaFileService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(attachmentData: {
        type: string;
        url: string;
        filename: string;
        pathName: string;
        size: number;
        mimeType: string;
    }): import("@prisma/client").Prisma.Prisma__MediaFileClient<{
        id: string;
        type: string;
        createdAt: Date;
        updatedAt: Date;
        filename: string;
        pathName: string;
        url: string;
        size: number;
        mimeType: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findById(id: string): Promise<{
        id: string;
        type: string;
        createdAt: Date;
        updatedAt: Date;
        filename: string;
        pathName: string;
        url: string;
        size: number;
        mimeType: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findByRandomName(pathName: string): Promise<{
        id: string;
        type: string;
        createdAt: Date;
        updatedAt: Date;
        filename: string;
        pathName: string;
        url: string;
        size: number;
        mimeType: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    update(pathName: string, updateData: {
        type?: string;
        url?: string;
        filename?: string;
        pathName?: string;
        size?: number;
        mimeType?: string;
    }): Promise<{
        id: string;
        type: string;
        createdAt: Date;
        updatedAt: Date;
        filename: string;
        pathName: string;
        url: string;
        size: number;
        mimeType: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    delete(pathName: string): Promise<void>;
}
