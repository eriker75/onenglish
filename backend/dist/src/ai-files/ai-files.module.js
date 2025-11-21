"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AiFilesModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiFilesModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nestjs_form_data_1 = require("nestjs-form-data");
const ai_files_service_1 = require("./ai-files.service");
const gemini_files_adapter_1 = require("./adapters/gemini-files.adapter");
const openai_files_adapter_1 = require("./adapters/openai-files.adapter");
const ai_files_test_controller_1 = require("./controllers/ai-files-test.controller");
let AiFilesModule = class AiFilesModule {
    static { AiFilesModule_1 = this; }
    static ROOT_OPTIONS_TOKEN = 'AI_FILES_OPTIONS';
    static forRoot(options) {
        return {
            module: AiFilesModule_1,
            imports: [nestjs_form_data_1.NestjsFormDataModule],
            controllers: [ai_files_test_controller_1.AiFilesTestController],
            providers: [
                {
                    provide: this.ROOT_OPTIONS_TOKEN,
                    useValue: options,
                },
                {
                    provide: ai_files_service_1.AiFilesService,
                    useFactory: (opts) => {
                        return this.createServiceWithAdapters(opts);
                    },
                    inject: [this.ROOT_OPTIONS_TOKEN],
                },
            ],
            exports: [ai_files_service_1.AiFilesService],
        };
    }
    static forRootAsync(options) {
        const asyncProviders = options
            ? this.createAsyncProviders(options)
            : this.createDefaultAsyncProviders();
        return {
            global: true,
            module: AiFilesModule_1,
            imports: [nestjs_form_data_1.NestjsFormDataModule, ...(options?.imports ?? [config_1.ConfigModule])],
            controllers: [ai_files_test_controller_1.AiFilesTestController],
            providers: [
                ...asyncProviders,
                {
                    provide: ai_files_service_1.AiFilesService,
                    useFactory: (opts) => {
                        return this.createServiceWithAdapters(opts);
                    },
                    inject: [this.ROOT_OPTIONS_TOKEN],
                },
            ],
            exports: [ai_files_service_1.AiFilesService],
        };
    }
    static forFeature(token, options) {
        const optionsToken = `AI_FILES_OPTIONS_${token}`;
        return {
            module: AiFilesModule_1,
            providers: [
                {
                    provide: optionsToken,
                    useValue: options,
                },
                {
                    provide: token,
                    useFactory: (opts) => {
                        return this.createServiceWithAdapters(opts);
                    },
                    inject: [optionsToken],
                },
            ],
            exports: [token],
        };
    }
    static forFeatureAsync(token, options) {
        const optionsToken = `AI_FILES_OPTIONS_${token}`;
        return {
            module: AiFilesModule_1,
            imports: options.imports ?? [],
            providers: [
                {
                    provide: optionsToken,
                    useFactory: options.useFactory,
                    inject: options.inject ?? [],
                },
                {
                    provide: token,
                    useFactory: (opts) => {
                        return this.createServiceWithAdapters(opts);
                    },
                    inject: [optionsToken],
                },
            ],
            exports: [token],
        };
    }
    static createServiceWithAdapters(options) {
        const service = new ai_files_service_1.AiFilesService();
        if (options.providers.gemini) {
            const geminiAdapter = new gemini_files_adapter_1.GeminiFilesAdapter({
                apiKey: options.providers.gemini.apiKey,
                model: options.providers.gemini.model,
                defaultTemperature: options.providers.gemini.defaultTemperature,
            });
            service.registerAdapter(geminiAdapter);
        }
        if (options.providers.openai) {
            const openaiAdapter = new openai_files_adapter_1.OpenAIFilesAdapter({
                apiKey: options.providers.openai.apiKey,
                visionModel: options.providers.openai.visionModel,
                audioModel: options.providers.openai.audioModel,
                defaultTemperature: options.providers.openai.defaultTemperature,
            });
            service.registerAdapter(openaiAdapter);
        }
        if (options.defaultProvider) {
            service.setDefaultProvider(options.defaultProvider);
        }
        else if (options.providers.gemini) {
            service.setDefaultProvider('google_genai');
        }
        else if (options.providers.openai) {
            service.setDefaultProvider('openai');
        }
        return service;
    }
    static createAsyncProviders(options) {
        return [
            {
                provide: this.ROOT_OPTIONS_TOKEN,
                useFactory: options.useFactory,
                inject: options.inject ?? [],
            },
        ];
    }
    static createDefaultAsyncProviders() {
        return [
            {
                provide: this.ROOT_OPTIONS_TOKEN,
                useFactory: (configService) => {
                    return {
                        defaultProvider: 'google_genai',
                        providers: {
                            gemini: {
                                apiKey: configService.get('GEMINI_API_KEY'),
                                model: configService.get('GEMINI_MODEL') ||
                                    'gemini-2.0-flash-exp',
                                defaultTemperature: 0.2,
                            },
                        },
                    };
                },
                inject: [config_1.ConfigService],
            },
        ];
    }
};
exports.AiFilesModule = AiFilesModule;
exports.AiFilesModule = AiFilesModule = AiFilesModule_1 = __decorate([
    (0, common_1.Module)({})
], AiFilesModule);
//# sourceMappingURL=ai-files.module.js.map