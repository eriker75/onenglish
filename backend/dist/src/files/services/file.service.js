"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FileService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
const path = __importStar(require("path"));
const fs_1 = require("fs");
const local_storage_service_1 = require("./local-storage.service");
const s3_storage_service_1 = require("./s3-storage.service");
const media_file_service_1 = require("./media-file.service");
const file_type_detector_util_1 = require("../utils/file-type-detector.util");
let FileService = FileService_1 = class FileService {
    configService;
    localStorageService;
    s3StorageService;
    attachmentService;
    logger = new common_1.Logger(FileService_1.name);
    storageService;
    tmpDir;
    constructor(configService, localStorageService, s3StorageService, attachmentService) {
        this.configService = configService;
        this.localStorageService = localStorageService;
        this.s3StorageService = s3StorageService;
        this.attachmentService = attachmentService;
        this.initializeStorage();
        this.tmpDir = path.join(process.cwd(), 'tmp');
        this.ensureTmpDirectory();
    }
    initializeStorage() {
        const storageType = this.configService.get('STORAGE_TYPE') || 'local';
        this.storageService =
            storageType === 's3' ? this.s3StorageService : this.localStorageService;
        this.logger.log(`Storage service initialized: ${storageType}`);
    }
    async ensureTmpDirectory() {
        try {
            await fs_1.promises.access(this.tmpDir);
        }
        catch {
            await fs_1.promises.mkdir(this.tmpDir, { recursive: true });
        }
    }
    async saveFile(file) {
        const type = (0, file_type_detector_util_1.detectFileType)(file.originalName, file.mimeType);
        const randomName = `${(0, uuid_1.v4)()}${path.extname(file.originalName)}`;
        const url = await this.storageService.uploadFile(file, type, randomName);
        const mediaFile = await this.attachmentService.create({
            type,
            url,
            filename: file.originalName,
            pathName: randomName,
            size: file.size,
            mimeType: file.mimeType,
        });
        return {
            id: mediaFile.id,
            url,
            filename: randomName,
            type,
        };
    }
    async updateFile(fileId, newFile) {
        const existingFile = await this.attachmentService.findById(fileId);
        if (!existingFile) {
            throw new common_1.NotFoundException(`File with ID ${fileId} not found`);
        }
        const backupPath = path.join(this.tmpDir, `backup-${existingFile.pathName}`);
        let backupCreated = false;
        try {
            const newType = (0, file_type_detector_util_1.detectFileType)(newFile.originalName, newFile.mimeType);
            this.logger.log(`Creating backup for file ${existingFile.pathName}`);
            await this.createBackup(existingFile.type, existingFile.pathName, backupPath);
            backupCreated = true;
            const newRandomName = `${(0, uuid_1.v4)()}${path.extname(newFile.originalName)}`;
            this.logger.log(`Uploading new file with name ${newRandomName}`);
            const newUrl = await this.storageService.uploadFile(newFile, newType, newRandomName);
            this.logger.log(`Verifying new file ${newRandomName} was created`);
            const fileExists = await this.verifyFileExists(newType, newRandomName);
            if (!fileExists) {
                throw new Error('Failed to verify new file creation');
            }
            this.logger.log(`Deleting old file ${existingFile.pathName}`);
            await this.storageService.deleteFile(existingFile.type, existingFile.pathName);
            await this.attachmentService.update(existingFile.pathName, {
                type: newType,
                url: newUrl,
                filename: newFile.originalName,
                pathName: newRandomName,
                size: newFile.size,
                mimeType: newFile.mimeType,
            });
            await this.cleanupBackup(backupPath);
            this.logger.log(`File ${fileId} updated successfully`);
            return {
                id: existingFile.id,
                url: newUrl,
                filename: newRandomName,
                type: newType,
            };
        }
        catch (error) {
            this.logger.error(`Error updating file ${fileId}:`, error);
            if (backupCreated) {
                this.logger.warn(`Rolling back changes for file ${fileId}`);
                try {
                    await this.restoreFromBackup(existingFile.type, existingFile.pathName, backupPath);
                    this.logger.log(`Successfully restored file ${fileId} from backup`);
                }
                catch (rollbackError) {
                    this.logger.error(`Failed to restore from backup for file ${fileId}:`, rollbackError);
                    throw new common_1.InternalServerErrorException('File update failed and backup restoration also failed. Please contact support.');
                }
            }
            throw new common_1.InternalServerErrorException(`Failed to update file: ${error.message}`);
        }
    }
    async deleteFile(fileId) {
        const file = await this.attachmentService.findById(fileId);
        if (!file) {
            throw new common_1.NotFoundException(`File with ID ${fileId} not found`);
        }
        await this.storageService.deleteFile(file.type, file.pathName);
        await this.attachmentService.delete(file.pathName);
        this.logger.log(`File ${fileId} deleted successfully`);
    }
    async createBackup(type, filename, backupPath) {
        const storageType = this.configService.get('STORAGE_TYPE') || 'local';
        if (storageType === 'local') {
            const uploadRoot = this.configService.get('UPLOAD_ROOT') ||
                path.join(process.cwd(), 'uploads');
            const originalPath = path.join(uploadRoot, type, filename);
            try {
                await fs_1.promises.copyFile(originalPath, backupPath);
            }
            catch (error) {
                this.logger.warn(`Could not create backup for ${filename}: ${error.message}`);
            }
        }
        else {
            this.logger.log(`Skipping backup creation for S3 storage (file: ${filename})`);
        }
    }
    async restoreFromBackup(type, filename, backupPath) {
        const storageType = this.configService.get('STORAGE_TYPE') || 'local';
        if (storageType === 'local') {
            const uploadRoot = this.configService.get('UPLOAD_ROOT') ||
                path.join(process.cwd(), 'uploads');
            const originalPath = path.join(uploadRoot, type, filename);
            try {
                await fs_1.promises.access(backupPath);
                await fs_1.promises.copyFile(backupPath, originalPath);
                await fs_1.promises.unlink(backupPath);
            }
            catch (error) {
                throw new Error(`Failed to restore from backup: ${error.message}`);
            }
        }
        else {
            this.logger.warn(`Cannot restore from backup for S3 storage`);
        }
    }
    async cleanupBackup(backupPath) {
        try {
            await fs_1.promises.unlink(backupPath);
        }
        catch (error) {
            this.logger.warn(`Could not delete backup file: ${error.message}`);
        }
    }
    async verifyFileExists(type, filename) {
        const storageType = this.configService.get('STORAGE_TYPE') || 'local';
        if (storageType === 'local') {
            const uploadRoot = this.configService.get('UPLOAD_ROOT') ||
                path.join(process.cwd(), 'uploads');
            const filePath = path.join(uploadRoot, type, filename);
            try {
                await fs_1.promises.access(filePath);
                return true;
            }
            catch {
                return false;
            }
        }
        else {
            return true;
        }
    }
    getFileUrl(type, filename) {
        return this.storageService.getFileUrl(type, filename);
    }
};
exports.FileService = FileService;
exports.FileService = FileService = FileService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        local_storage_service_1.LocalStorageService,
        s3_storage_service_1.S3StorageService,
        media_file_service_1.MediaFileService])
], FileService);
//# sourceMappingURL=file.service.js.map