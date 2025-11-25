"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nestjs_form_data_1 = require("nestjs-form-data");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const interceptors_1 = require("./common/interceptors");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./auth/auth.module");
const questions_module_1 = require("./questions/questions.module");
const students_module_1 = require("./students/students.module");
const teachers_module_1 = require("./teachers/teachers.module");
const coordinators_module_1 = require("./coordinators/coordinators.module");
const schools_module_1 = require("./schools/schools.module");
const analytics_module_1 = require("./analytics/analytics.module");
const revisions_module_1 = require("./revisions/revisions.module");
const admins_module_1 = require("./admins/admins.module");
const payments_module_1 = require("./payments/payments.module");
const challenges_module_1 = require("./challenges/challenges.module");
const employees_module_1 = require("./employees/employees.module");
const ai_module_1 = require("./ai/ai.module");
const ai_files_module_1 = require("./ai-files/ai-files.module");
const files_module_1 = require("./files/files.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            nestjs_form_data_1.NestjsFormDataModule.config({
                isGlobal: true,
                storage: nestjs_form_data_1.FileSystemStoredFile,
                fileSystemStoragePath: '/tmp',
                cleanupAfterSuccessHandle: true,
                cleanupAfterFailedHandle: true,
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'public'),
                serveRoot: '/',
                serveStaticOptions: {
                    index: 'index.html',
                },
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'public'),
                serveRoot: '/public',
                serveStaticOptions: {
                    index: false,
                },
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
                serveStaticOptions: {
                    setHeaders: (res, _path, _stat) => {
                        if (process.env.NODE_ENV === 'development') {
                            res.setHeader('Access-Control-Allow-Origin', '*');
                        }
                        else {
                            const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [
                                process.env.FRONTEND_URL,
                            ];
                            res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0] || '*');
                        }
                        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
                        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
                        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
                    },
                },
            }),
            ai_module_1.AiModule.forFeatureAsync('GEMINI_AI', {
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    provider: 'google-genai',
                    apiKey: configService.get('GEMINI_API_KEY'),
                    model: 'gemini-2.5-flash',
                    temperature: 0.2,
                }),
                inject: [config_1.ConfigService],
            }),
            ai_files_module_1.AiFilesModule.forRootAsync(),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            questions_module_1.QuestionsModule,
            students_module_1.StudentsModule,
            teachers_module_1.TeachersModule,
            coordinators_module_1.CoordinatorsModule,
            schools_module_1.SchoolsModule,
            analytics_module_1.AnalyticsModule,
            revisions_module_1.RevisionsModule,
            admins_module_1.AdminsModule,
            payments_module_1.PaymentsModule,
            challenges_module_1.ChallengesModule,
            employees_module_1.EmployeesModule,
            files_module_1.FilesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: interceptors_1.LoggingInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map