import { FileService } from '../services/file.service';
import { UploadFileDto, UpdateFileDto, FileResponseDto, DeleteFileResponseDto } from '../dtos';
export declare class FilesController {
    private readonly fileService;
    constructor(fileService: FileService);
    uploadFile(uploadFileDto: UploadFileDto): Promise<FileResponseDto>;
    updateFile(updateFileDto: UpdateFileDto): Promise<FileResponseDto>;
    deleteFile(fileId: string): Promise<DeleteFileResponseDto>;
}
