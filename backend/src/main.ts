import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

const APP_PORT = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const isDevelopment = nodeEnv === 'development';

  // CORS configuration
  // Get allowed origins from environment (for web dashboard and frontend)
  const corsOriginEnv = configService.get<string>('CORS_ORIGIN');
  const frontendUrl = configService.get<string>('FRONTEND_URL');

  const allowedOrigins: string[] = [];
  if (corsOriginEnv) {
    allowedOrigins.push(...corsOriginEnv.split(',').map((url) => url.trim()));
  } else if (frontendUrl) {
    allowedOrigins.push(frontendUrl);
  }

  app.use(helmet());
  app.use(cookieParser());
  app.use(compression());

  const corsOriginCallback = (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (isDevelopment) {
      // In development, allow all origins and requests without origin
      callback(null, true);
      return;
    }

    // In production:
    // - If no origin (undefined/null), it's likely a mobile app (React Native, etc.)
    //   Mobile apps don't send Origin header in HTTP requests
    if (!origin) {
      callback(null, true);
      return;
    }

    // If origin exists, check if it's in the allowed list (web dashboard/frontend)
    if (allowedOrigins.length > 0 && allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    // Origin not allowed
    callback(new Error('Not allowed by CORS'));
  };

  app.enableCors({
    origin: corsOriginCallback,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400, // 24 hours
  });

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties not in DTO
      //forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Convert types automatically
      },
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('OnEnglish Backend API')
    .setDescription(
      'API for OnEnglish learning platform. Includes comprehensive question management with 19+ question types (vocabulary, grammar, listening, writing, speaking), student answer tracking, and school performance analytics.',
    )
    .setVersion('1.0')
    .addTag('Questions', 'Question management endpoints for all question types')
    .addTag('Auth', 'Authentication and authorization')
    .addTag('Students', 'Student management')
    .addTag('Teachers', 'Teacher management')
    .addTag('Schools', 'School management')
    .addTag('Challenges', 'Challenge management')
    .addTag('Analytics', 'Analytics and statistics')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'Introduce tu token JWT con el prefijo Bearer',
    })
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(APP_PORT ?? 3000);
  logger.log(`App running on port ${APP_PORT ?? 3000}`);
}

bootstrap()
  .then(() => {
    console.log('Application is running on:', APP_PORT ?? 3000);
  })
  .catch((err) => {
    console.error('Error during application bootstrap:', err);
  });