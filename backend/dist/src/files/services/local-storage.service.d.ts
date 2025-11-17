import { ConfigService } from '@nestjs/config';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { IStorageService } from '../definitions/storage.interface';
export declare class LocalStorageService implements IStorageService {
    private configService;
    private readonly uploadRoot;
    private readonly logger;
    constructor(configService: ConfigService);
    private ensureDirectoryExists;
    uploadFile(file: FileSystemStoredFile, type: string, randomName: string): Promise<string>;
    updateFile(oldFilename: string, newFile: FileSystemStoredFile, type: string, newRandomName: string): Promise<string>;
    deleteFile(type: string, filename: string): Promise<void>;
    getFileUrl(type: string, filename: string): string;
}
