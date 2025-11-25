import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestjsFormDataModule, FileSystemStoredFile } from 'nestjs-form-data';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingInterceptor } from './common/interceptors';
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
    // Serve static files from public folder at root
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
      serveStaticOptions: {
        index: 'index.html',
      },
    }),
    // Also serve public folder at /public for direct access
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
      serveStaticOptions: {
        index: false, // Don't serve index.html here
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        setHeaders: (res, _path, _stat) => {
          // In development, allow all origins
          if (process.env.NODE_ENV === 'development') {
            res.setHeader('Access-Control-Allow-Origin', '*');
          } else {
            // In production, use FRONTEND_URL or CORS_ORIGINS
            const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [
              process.env.FRONTEND_URL,
            ];
            res.setHeader(
              'Access-Control-Allow-Origin',
              allowedOrigins[0] || '*',
            );
          }
          res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
          res.setHeader(
            'Access-Control-Allow-Headers',
            'Content-Type, Authorization',
          );
          res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        },
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
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
