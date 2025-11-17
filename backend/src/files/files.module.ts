import { Global, Module } from '@nestjs/common';
import { FileSystemStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { AuthModule } from 'src/auth/auth.module';
import { FileService } from './services/file.service';
import { join } from 'path';
import { LocalStorageService } from './services/local-storage.service';
import { S3StorageService } from './services/s3-storage.service';
import { MediaFileService } from './services/media-file.service';
import { FilesController } from './controllers/files.controller';

@Global()
@Module({
  imports: [
    AuthModule,
    NestjsFormDataModule.configAsync({
      useFactory: () => ({
        storage: FileSystemStoredFile,
        fileSystemStoragePath: join(process.cwd(), 'uploads'),
      }),
    }),
  ],
  controllers: [FilesController],
  providers: [
    MediaFileService,
    FileService,
    LocalStorageService,
    S3StorageService,
  ],
  exports: [NestjsFormDataModule, FileService, MediaFileService],
})
export class FilesModule {}
