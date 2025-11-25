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
  private readonly region: string;
  private readonly endpoint?: string;
  private readonly forcePathStyle?: boolean;

  constructor(private configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
    // Aceptar ambas variantes: AWS_S3_BUCKET_NAME o AWS_S3_BUCKET
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME')!;
    if (!this.bucketName) {
      throw new Error(
        'AWS_S3_BUCKET_NAME o AWS_S3_BUCKET debe estar configurado',
      );
    }
    this.endpoint = this.configService.get<string>('AWS_S3_ENDPOINT');
    this.forcePathStyle =
      this.configService.get<string>('AWS_S3_FORCE_PATH_STYLE') === 'true';

    const s3Config: any = {
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        )!,
      },
    };

    // Si hay un endpoint personalizado (DigitalOcean Spaces, MinIO, etc.)
    if (this.endpoint) {
      s3Config.endpoint = this.endpoint;
      s3Config.forcePathStyle = this.forcePathStyle ?? true;
    } else {
      // Para S3 puro de AWS, configurar explícitamente el endpoint basándose en la región
      // Esto evita problemas de redirección cuando la región no coincide
      if (this.region === 'us-east-1') {
        s3Config.endpoint = 'https://s3.amazonaws.com';
      } else {
        s3Config.endpoint = `https://s3.${this.region}.amazonaws.com`;
      }
      // Para AWS S3 estándar, usar virtual-hosted-style (no path-style)
      s3Config.forcePathStyle = false;
    }

    this.s3Client = new S3Client(s3Config);
  }

  async uploadFile(
    file: FileSystemStoredFile,
    type: string,
    randomName: string,
  ): Promise<string> {
    const s3Key = `${type}/${randomName}`;

    try {
      const mimeType = file.mimeType || 'application/octet-stream';
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: s3Key,
          Body: fs.readFileSync(file.path),
          ContentType: mimeType,
        }),
      );
      return this.getFileUrl(type, randomName);
    } catch (error) {
      // Si el error menciona endpoint, probablemente la región no coincide con el bucket
      if (error.message?.includes('endpoint')) {
        const errorDetails = error.message;
        throw new InternalServerErrorException(
          `Error subiendo archivo a S3: ${errorDetails}. ` +
            `La región configurada es '${this.region}'. ` +
            `Verifica la región real de tu bucket S3 en la consola de AWS o ejecuta: ` +
            `aws s3api get-bucket-location --bucket ${this.bucketName}. ` +
            `Asegúrate de que AWS_REGION coincida exactamente con la región del bucket.`,
        );
      }
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

      return this.getFileUrl(type, newRandomName);
    } catch (error) {
      if (error.message?.includes('endpoint')) {
        throw new InternalServerErrorException(
          `Error actualizando archivo en S3: ${error.message}. Verifica que AWS_REGION coincida con la región de tu bucket S3.`,
        );
      }
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
      if (error.message?.includes('endpoint')) {
        throw new InternalServerErrorException(
          `Error eliminando archivo de S3: ${error.message}. Verifica que AWS_REGION coincida con la región de tu bucket S3.`,
        );
      }
      throw new InternalServerErrorException(
        `Error eliminando archivo de S3: ${error.message}`,
      );
    }
  }

  getFileUrl(type: string, filename: string): string {
    const s3Key = `${type}/${filename}`;

    // Si hay un endpoint personalizado, construir la URL basándose en ese endpoint
    if (this.endpoint) {
      if (this.forcePathStyle) {
        // Path-style: https://endpoint.com/bucket-name/key
        const endpointUrl = this.endpoint.replace(/\/$/, ''); // Remover trailing slash
        return `${endpointUrl}/${this.bucketName}/${s3Key}`;
      } else {
        // Virtual-hosted-style: https://bucket-name.endpoint.com/key
        const endpointUrl = this.endpoint
          .replace(/^https?:\/\//, '')
          .replace(/\/$/, '');
        return `https://${this.bucketName}.${endpointUrl}/${s3Key}`;
      }
    }

    // Para AWS S3 estándar, usar el formato regional correcto
    // Si la región es us-east-1, no incluir la región en la URL
    if (this.region === 'us-east-1') {
      return `https://${this.bucketName}.s3.amazonaws.com/${s3Key}`;
    } else {
      // Para otras regiones, incluir la región en la URL
      return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${s3Key}`;
    }
  }
}
