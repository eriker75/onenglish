import { ConfigService } from '@nestjs/config';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { IStorageService } from '../definitions/storage.interface';
export declare class S3StorageService implements IStorageService {
    private configService;
    private readonly s3Client;
    private readonly bucketName;
    private readonly region;
    private readonly endpoint?;
    private readonly forcePathStyle?;
    constructor(configService: ConfigService);
    uploadFile(file: FileSystemStoredFile, type: string, randomName: string): Promise<string>;
    updateFile(oldFilename: string, newFile: FileSystemStoredFile, type: string, newRandomName: string): Promise<string>;
    deleteFile(type: string, filename: string): Promise<void>;
    getFileUrl(type: string, filename: string): string;
}
