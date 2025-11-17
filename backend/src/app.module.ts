import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestjsFormDataModule, FileSystemStoredFile } from 'nestjs-form-data';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { QuestionsModule } from './questions/questions.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';
import { CoordinatorsModule } from './coordinators/coordinators.module';
import { SchoolsModule } from './schools/schools.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { RevisionsModule } from './revisions/revisions.module';
import { AdminsModule } from './admins/admins.module';
import { PaymentsModule } from './payments/payments.module';
import { ChallengesModule } from './challenges/challenges.module';
import { EmployeesModule } from './employees/employees.module';
import { AiModule } from './ai/ai.module';
import { AiFilesModule } from './ai-files/ai-files.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    NestjsFormDataModule.config({
      isGlobal: true,
      storage: FileSystemStoredFile,
      fileSystemStoragePath: '/tmp',
      cleanupAfterSuccessHandle: true,
      cleanupAfterFailedHandle: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
      serveStaticOptions: {
        index: 'index.html',
      },
    }),
    AiModule.forFeatureAsync('GEMINI_AI', {
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        provider: 'google-genai',
        apiKey: configService.get<string>('GEMINI_API_KEY')!,
        model: 'gemini-2.5-flash',
        temperature: 0.2,
      }),
      inject: [ConfigService],
    }),
    AiFilesModule.forRootAsync(),
    DatabaseModule,
    AuthModule,
    QuestionsModule,
    StudentsModule,
    TeachersModule,
    CoordinatorsModule,
    SchoolsModule,
    AnalyticsModule,
    RevisionsModule,
    AdminsModule,
    PaymentsModule,
    ChallengesModule,
    EmployeesModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
