"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_form_data_1 = require("nestjs-form-data");
const database_module_1 = require("../database/database.module");
const files_module_1 = require("../files/files.module");
const ai_module_1 = require("../ai/ai.module");
const ai_files_module_1 = require("../ai-files/ai-files.module");
const questions_service_1 = require("./services/questions.service");
const services_1 = require("./services");
const question_validation_service_1 = require("./services/question-validation.service");
const question_update_service_1 = require("./services/question-update.service");
const questions_creation_controller_1 = require("./controllers/questions-creation.controller");
const questions_query_controller_1 = require("./controllers/questions-query.controller");
const questions_answer_controller_1 = require("./controllers/questions-answer.controller");
const questions_update_controller_1 = require("./controllers/questions-update.controller");
let QuestionsModule = class QuestionsModule {
};
exports.QuestionsModule = QuestionsModule;
exports.QuestionsModule = QuestionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            files_module_1.FilesModule,
            ai_module_1.AiModule.forFeature('QUESTIONS_AI', {
                provider: 'openai',
                apiKey: process.env.OPENAI_API_KEY || '',
                model: 'gpt-4o-mini',
                temperature: 0.2,
            }),
            ai_files_module_1.AiFilesModule.forFeature('QUESTIONS_AI_FILES', {
                defaultProvider: 'openai',
                providers: {
                    gemini: {
                        apiKey: process.env.GEMINI_API_KEY || '',
                        model: 'gemini-2.0-flash-exp',
                        defaultTemperature: 0.2,
                    },
                    openai: {
                        apiKey: process.env.OPENAI_API_KEY || '',
                        visionModel: 'gpt-4o',
                        audioModel: 'whisper-1',
                        defaultTemperature: 0.2,
                    },
                },
            }),
            nestjs_form_data_1.NestjsFormDataModule,
        ],
        controllers: [
            questions_creation_controller_1.QuestionsCreationController,
            questions_query_controller_1.QuestionsQueryController,
            questions_answer_controller_1.QuestionsAnswerController,
            questions_update_controller_1.QuestionsUpdateController,
        ],
        providers: [
            questions_service_1.QuestionsService,
            services_1.QuestionMediaService,
            services_1.QuestionFormatterService,
            question_validation_service_1.QuestionValidationService,
            question_update_service_1.QuestionUpdateService,
        ],
        exports: [
            questions_service_1.QuestionsService,
            services_1.QuestionMediaService,
            services_1.QuestionFormatterService,
            question_validation_service_1.QuestionValidationService,
            question_update_service_1.QuestionUpdateService,
        ],
    })
], QuestionsModule);
//# sourceMappingURL=questions.module.js.map