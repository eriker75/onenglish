import { PrismaService } from '../../database/prisma.service';
import { FileService } from '../../files/services/file.service';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { QuestionWithRelations, EnrichedQuestion } from './types';
export interface MediaAttachment {
    id: string;
    context?: string;
    position?: number;
}
export declare class QuestionMediaService {
    private readonly prisma;
    private readonly fileService;
    constructor(prisma: PrismaService, fileService: FileService);
    uploadSingleFile(file: FileSystemStoredFile): Promise<{
        id: string;
        url: string;
        filename: string;
        type: string;
    }>;
    uploadMultipleFiles(files: FileSystemStoredFile[]): Promise<{
        id: string;
        url: string;
        filename: string;
        type: string;
    }[]>;
    attachMediaFiles(questionId: string, mediaIds: Array<{
        id: string;
        context?: string;
        position?: number;
    }>): Promise<void>;
    detachAllMediaFiles(questionId: string): Promise<void>;
    replaceMediaFiles(questionId: string, mediaIds: Array<{
        id: string;
        context?: string;
        position?: number;
    }>): Promise<void>;
    getQuestionMedia(questionId: string): Promise<({
        mediaFile: {
            id: string;
            type: string;
            filename: string;
            pathName: string;
            url: string;
            size: number;
            mimeType: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        questionId: string;
        mediaFileId: string;
        position: number;
        context: string | null;
    })[]>;
    enrichQuestionWithMedia(question: QuestionWithRelations): EnrichedQuestion;
    enrichQuestionsWithMedia(questions: QuestionWithRelations[]): EnrichedQuestion[];
}
