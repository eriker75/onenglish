import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { promises as fs } from 'fs';
import * as path from 'path';
import { IStorageService } from '../definitions/storage.interface';
import { Logger } from '@nestjs/common';

@Injectable()
export class LocalStorageService implements IStorageService {
  private readonly uploadRoot: string;
  private readonly logger = new Logger('LocalStorageService');

  constructor(private configService: ConfigService) {
    // Use UPLOAD_ROOT from env or default to 'uploads' directory in project root
    this.uploadRoot =
      this.configService.get<string>('UPLOAD_ROOT') ||
      path.join(process.cwd(), 'uploads');
    this.logger.log(`Upload root directory: ${this.uploadRoot}`);
  }

  private async ensureDirectoryExists(directory: string): Promise<void> {
    try {
      await fs.access(directory);
    } catch {
      await fs.mkdir(directory, { recursive: true });
    }
  }

  async uploadFile(
    file: FileSystemStoredFile,
    type: string,
    randomName: string,
  ): Promise<string> {
    const uploadDir = path.join(this.uploadRoot, type);
    const filePath = path.join(uploadDir, randomName);

    try {
      await this.ensureDirectoryExists(uploadDir);
      
      // Use copyFile + unlink instead of rename to support cross-device moves
      await fs.copyFile(file.path, filePath);
      await fs.unlink(file.path);
      
      return `/uploads/${type}/${randomName}`;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error guardando archivo local: ${error.message}`,
      );
    }
  }

  async updateFile(
    oldFilename: string,
    newFile: FileSystemStoredFile,
    type: string,
    newRandomName: string,
  ): Promise<string> {
    const uploadDir = path.join(this.uploadRoot, type);
    const oldFilePath = path.join(uploadDir, oldFilename);
    const newFilePath = path.join(uploadDir, newRandomName);

    try {
      // Eliminar el archivo antiguo si existe
      try {
        await fs.unlink(oldFilePath);
      } catch {
        // El archivo no existe, continuar
        this.logger.warn(
          `Archivo ${oldFilename} no existe, no se puede eliminar`,
        );
      }

      // Asegurar que el directorio existe antes de mover
      await this.ensureDirectoryExists(uploadDir);

      // Use copyFile + unlink instead of rename to support cross-device moves
      await fs.copyFile(newFile.path, newFilePath);
      await fs.unlink(newFile.path);

      return `/uploads/${type}/${newRandomName}`;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error actualizando archivo local: ${error.message}`,
      );
    }
  }

  async deleteFile(type: string, filename: string): Promise<void> {
    const filePath = path.join(this.uploadRoot, type, filename);

    try {
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
      } catch {
        // El archivo no existe, no hacer nada
        this.logger.warn(`Archivo ${filename} no existe, no se puede eliminar`);
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error eliminando archivo local: ${error.message}`,
      );
    }
  }

  getFileUrl(type: string, filename: string): string {
    return `/uploads/${type}/${filename}`;
  }
}
