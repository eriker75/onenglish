import { FileSystemStoredFile } from 'nestjs-form-data';
export interface IStorageService {
    uploadFile(file: FileSystemStoredFile, type: string, randomName: string): Promise<string>;
    updateFile(oldFilename: string, newFile: FileSystemStoredFile, type: string, newRandomName: string): Promise<string>;
    deleteFile(type: string, filename: string): Promise<void>;
    getFileUrl(type: string, filename: string): string;
}
