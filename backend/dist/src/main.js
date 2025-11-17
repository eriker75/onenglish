"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = require("path");
const APP_PORT = process.env.PORT;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const logger = new common_1.Logger('Bootstrap');
    const nodeEnv = configService.get('NODE_ENV', 'development');
    const isDevelopment = nodeEnv === 'development';
    const corsOriginEnv = configService.get('CORS_ORIGIN');
    const frontendUrl = configService.get('FRONTEND_URL');
    const allowedOrigins = [];
    if (corsOriginEnv) {
        allowedOrigins.push(...corsOriginEnv.split(',').map((url) => url.trim()));
    }
    else if (frontendUrl) {
        allowedOrigins.push(frontendUrl);
    }
    app.use((0, helmet_1.default)());
    app.use((0, cookie_parser_1.default)());
    app.use((0, compression_1.default)());
    const corsOriginCallback = (origin, callback) => {
        if (isDevelopment) {
            callback(null, true);
            return;
        }
        if (!origin) {
            callback(null, true);
            return;
        }
        if (allowedOrigins.length > 0 && allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error('Not allowed by CORS'));
    };
    const uploadRoot = (0, path_1.join)(process.cwd(), 'uploads');
    app.useStaticAssets(uploadRoot, {
        prefix: '/uploads',
        setHeaders: (res) => {
            res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
        },
    });
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
        maxAge: 86400,
    });
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('OnEnglish Backend API')
        .setDescription('API for OnEnglish learning platform. Includes comprehensive question management with 19+ question types (vocabulary, grammar, listening, writing, speaking), student answer tracking, and school performance analytics.')
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document, {
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
//# sourceMappingURL=main.js.map