import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { promises as fs } from 'fs';
import { LocalStorageService } from './local-storage.service';
import { S3StorageService } from './s3-storage.service';
import { MediaFileService } from './media-file.service';
import { detectFileType } from '../utils/file-type-detector.util';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private storageService: LocalStorageService | S3StorageService;
  private readonly tmpDir: string;

  constructor(
    private configService: ConfigService,
    private localStorageService: LocalStorageService,
    private s3StorageService: S3StorageService,
    private attachmentService: MediaFileService,
  ) {
    this.initializeStorage();
    this.tmpDir = path.join(process.cwd(), 'tmp');
    this.ensureTmpDirectory();
  }

  private initializeStorage() {
    const storageType =
      this.configService.get<'local' | 's3'>('STORAGE_TYPE') || 'local';
    this.storageService =
      storageType === 's3' ? this.s3StorageService : this.localStorageService;
    this.logger.log(`Storage service initialized: ${storageType}`);
  }

  private async ensureTmpDirectory(): Promise<void> {
    try {
      await fs.access(this.tmpDir);
    } catch {
      await fs.mkdir(this.tmpDir, { recursive: true });
    }
  }

  /**
   * Saves a new file to storage
   * Automatically detects file type from extension and MIME type
   */
  async saveFile(
    file: FileSystemStoredFile,
  ): Promise<{ id: string; url: string; filename: string; type: string }> {
    // Detect file type automatically
    const mimeType = (file as any).busBoyMimeType || (file as any).fileType?.mime || 'application/octet-stream';
    const type = detectFileType(file.originalName, mimeType);

    const randomName = `${uuidv4()}${path.extname(file.originalName)}`;
    const url = await this.storageService.uploadFile(file, type, randomName);

    const mediaFile = await this.attachmentService.create({
      type,
      url,
      filename: file.originalName,
      pathName: randomName,
      size: file.size,
      mimeType: mimeType,
    });

    return {
      id: mediaFile.id,
      url,
      filename: randomName,
      type,
    };
  }

  /**
   * Updates an existing file with backup and rollback capability
   * Creates a temporary backup before updating
   * Automatically detects file type from extension and MIME type
   */
  async updateFile(
    fileId: string,
    newFile: FileSystemStoredFile,
  ): Promise<{ id: string; url: string; filename: string; type: string }> {
    // Get existing file metadata
    const existingFile = await this.attachmentService.findById(fileId);
    if (!existingFile) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }

    const backupPath = path.join(this.tmpDir, `backup-${existingFile.pathName}`);
    let backupCreated = false;

    try {
      // Detect new file type
      const newMimeType = (newFile as any).busBoyMimeType || (newFile as any).fileType?.mime || 'application/octet-stream';
      const newType = detectFileType(newFile.originalName, newMimeType);

      // Step 1: Create backup of existing file
      this.logger.log(`Creating backup for file ${existingFile.pathName}`);
      await this.createBackup(existingFile.type, existingFile.pathName, backupPath);
      backupCreated = true;

      // Step 2: Upload new file
      const newRandomName = `${uuidv4()}${path.extname(newFile.originalName)}`;
      this.logger.log(`Uploading new file with name ${newRandomName}`);
      const newUrl = await this.storageService.uploadFile(
        newFile,
        newType,
        newRandomName,
      );

      // Step 3: Verify new file was created successfully
      this.logger.log(`Verifying new file ${newRandomName} was created`);
      const fileExists = await this.verifyFileExists(newType, newRandomName);
      if (!fileExists) {
        throw new Error('Failed to verify new file creation');
      }

      // Step 4: Delete old file
      this.logger.log(`Deleting old file ${existingFile.pathName}`);
      await this.storageService.deleteFile(
        existingFile.type,
        existingFile.pathName,
      );

      // Step 5: Update database record
      await this.attachmentService.update(existingFile.pathName, {
        type: newType,
        url: newUrl,
        filename: newFile.originalName,
        pathName: newRandomName,
        size: newFile.size,
        mimeType: newMimeType,
      });

      // Step 6: Clean up backup
      await this.cleanupBackup(backupPath);

      this.logger.log(`File ${fileId} updated successfully`);

      return {
        id: existingFile.id,
        url: newUrl,
        filename: newRandomName,
        type: newType,
      };
    } catch (error) {
      this.logger.error(`Error updating file ${fileId}:`, error);

      // Rollback: Restore from backup if it was created
      if (backupCreated) {
        this.logger.warn(`Rolling back changes for file ${fileId}`);
        try {
          await this.restoreFromBackup(
            existingFile.type,
            existingFile.pathName,
            backupPath,
          );
          this.logger.log(`Successfully restored file ${fileId} from backup`);
        } catch (rollbackError) {
          this.logger.error(
            `Failed to restore from backup for file ${fileId}:`,
            rollbackError,
          );
          throw new InternalServerErrorException(
            'File update failed and backup restoration also failed. Please contact support.',
          );
        }
      }

      throw new InternalServerErrorException(
        `Failed to update file: ${error.message}`,
      );
    }
  }

  /**
   * Deletes a file by its ID
   */
  async deleteFile(fileId: string): Promise<void> {
    const file = await this.attachmentService.findById(fileId);
    if (!file) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }

    await this.storageService.deleteFile(file.type, file.pathName);
    await this.attachmentService.delete(file.pathName);

    this.logger.log(`File ${fileId} deleted successfully`);
  }

  /**
   * Creates a backup copy of a file in the tmp directory
   */
  private async createBackup(
    type: string,
    filename: string,
    backupPath: string,
  ): Promise<void> {
    const storageType =
      this.configService.get<'local' | 's3'>('STORAGE_TYPE') || 'local';

    if (storageType === 'local') {
      const uploadRoot =
        this.configService.get<string>('UPLOAD_ROOT') ||
        path.join(process.cwd(), 'uploads');
      const originalPath = path.join(uploadRoot, type, filename);

      try {
        await fs.copyFile(originalPath, backupPath);
      } catch (error) {
        this.logger.warn(
          `Could not create backup for ${filename}: ${error.message}`,
        );
        // Don't throw error if backup fails, just log it
      }
    } else {
      // For S3, we don't create local backups
      this.logger.log(
        `Skipping backup creation for S3 storage (file: ${filename})`,
      );
    }
  }

  /**
   * Restores a file from backup
   */
  private async restoreFromBackup(
    type: string,
    filename: string,
    backupPath: string,
  ): Promise<void> {
    const storageType =
      this.configService.get<'local' | 's3'>('STORAGE_TYPE') || 'local';

    if (storageType === 'local') {
      const uploadRoot =
        this.configService.get<string>('UPLOAD_ROOT') ||
        path.join(process.cwd(), 'uploads');
      const originalPath = path.join(uploadRoot, type, filename);

      try {
        await fs.access(backupPath);
        await fs.copyFile(backupPath, originalPath);
        await fs.unlink(backupPath);
      } catch (error) {
        throw new Error(`Failed to restore from backup: ${error.message}`);
      }
    } else {
      this.logger.warn(`Cannot restore from backup for S3 storage`);
    }
  }

  /**
   * Cleans up backup file
   */
  private async cleanupBackup(backupPath: string): Promise<void> {
    try {
      await fs.unlink(backupPath);
    } catch (error) {
      this.logger.warn(`Could not delete backup file: ${error.message}`);
      // Don't throw, this is just cleanup
    }
  }

  /**
   * Verifies that a file exists in storage
   */
  private async verifyFileExists(
    type: string,
    filename: string,
  ): Promise<boolean> {
    const storageType =
      this.configService.get<'local' | 's3'>('STORAGE_TYPE') || 'local';

    if (storageType === 'local') {
      const uploadRoot =
        this.configService.get<string>('UPLOAD_ROOT') ||
        path.join(process.cwd(), 'uploads');
      const filePath = path.join(uploadRoot, type, filename);

      try {
        await fs.access(filePath);
        return true;
      } catch {
        return false;
      }
    } else {
      // For S3, assume it exists if upload succeeded
      return true;
    }
  }

  getFileUrl(type: string, filename: string): string {
    return this.storageService.getFileUrl(type, filename);
  }

  /**
   * Converts a relative file path to a full URL
   * If the path is already a full URL (starts with http/https), returns it as is
   * Otherwise, constructs the full URL using APP_URL or builds from PORT/HOST
   */
  getFullUrl(pathOrUrl: string | null | undefined): string | null {
    if (!pathOrUrl) return null;

    // If already a full URL, return as is
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
      return pathOrUrl;
    }

    // Get base URL from environment
    const appUrl = this.configService.get<string>('APP_URL');
    if (appUrl) {
      // Remove trailing slash from APP_URL if present
      const baseUrl = appUrl.endsWith('/') ? appUrl.slice(0, -1) : appUrl;
      // Ensure path starts with /
      const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
      return `${baseUrl}${path}`;
    }

    // Fallback: construct from PORT and HOST if APP_URL is not set
    const port = this.configService.get<string>('PORT') || '3000';
    const host = this.configService.get<string>('HOST') || 'localhost';
    const protocol = this.configService.get<string>('NODE_ENV') === 'production' ? 'https' : 'http';
    const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
    
    return `${protocol}://${host}:${port}${path}`;
  }
}
