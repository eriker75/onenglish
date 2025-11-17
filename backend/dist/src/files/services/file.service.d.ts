import { ConfigService } from '@nestjs/config';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { LocalStorageService } from './local-storage.service';
import { S3StorageService } from './s3-storage.service';
import { MediaFileService } from './media-file.service';
export declare class FileService {
    private configService;
    private localStorageService;
    private s3StorageService;
    private attachmentService;
    private readonly logger;
    private storageService;
    private readonly tmpDir;
    constructor(configService: ConfigService, localStorageService: LocalStorageService, s3StorageService: S3StorageService, attachmentService: MediaFileService);
    private initializeStorage;
    private ensureTmpDirectory;
    saveFile(file: FileSystemStoredFile): Promise<{
        id: string;
        url: string;
        filename: string;
        type: string;
    }>;
    updateFile(fileId: string, newFile: FileSystemStoredFile): Promise<{
        id: string;
        url: string;
        filename: string;
        type: string;
    }>;
    deleteFile(fileId: string): Promise<void>;
    private createBackup;
    private restoreFromBackup;
    private cleanupBackup;
    private verifyFileExists;
    getFileUrl(type: string, filename: string): string;
}
