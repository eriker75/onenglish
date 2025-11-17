import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { FileSystemStoredFile } from 'nestjs-form-data';
import * as fs from 'fs';
import { IStorageService } from '../definitions/storage.interface';

@Injectable()
export class S3StorageService implements IStorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION')!,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        )!,
      },
    });

    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME')!;
  }

  async uploadFile(
    file: FileSystemStoredFile,
    type: string,
    randomName: string,
  ): Promise<string> {
    const s3Key = `${type}/${randomName}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: s3Key,
          Body: fs.readFileSync(file.path),
          ContentType: file.mimeType,
        }),
      );
      return `https://${this.bucketName}.s3.amazonaws.com/${s3Key}`;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error subiendo archivo a S3: ${error.message}`,
      );
    }
  }

  async updateFile(
    oldFilename: string,
    newFile: FileSystemStoredFile,
    type: string,
    newRandomName: string,
  ): Promise<string> {
    const oldS3Key = `${type}/${oldFilename}`;
    const newS3Key = `${type}/${newRandomName}`;

    try {
      // Eliminar el archivo antiguo de S3
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: oldS3Key,
        }),
      );

      // Subir el nuevo archivo a S3
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: newS3Key,
          Body: fs.readFileSync(newFile.path),
          ContentType: newFile.mimeType,
        }),
      );

      return `https://${this.bucketName}.s3.amazonaws.com/${newS3Key}`;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error actualizando archivo en S3: ${error.message}`,
      );
    }
  }

  async deleteFile(type: string, filename: string): Promise<void> {
    const s3Key = `${type}/${filename}`;

    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: s3Key,
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Error eliminando archivo de S3: ${error.message}`,
      );
    }
  }

  getFileUrl(type: string, filename: string): string {
    return `https://${this.bucketName}.s3.amazonaws.com/${type}/${filename}`;
  }
}
