"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AiModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiModule = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
let AiModule = class AiModule {
    static { AiModule_1 = this; }
    static ROOT_OPTIONS_TOKEN = 'AI_OPTIONS';
    static createAiServiceProvider(provideToken, optionsToken) {
        return {
            provide: provideToken,
            useFactory: (opts) => {
                return new ai_service_1.AiService(opts);
            },
            inject: [optionsToken],
        };
    }
    static createAsyncOptionsProvider(optionsToken, options) {
        return {
            provide: optionsToken,
            useFactory: options.useFactory,
            inject: options.inject ?? [],
        };
    }
    static forRoot(options) {
        return {
            module: AiModule_1,
            providers: [
                {
                    provide: this.ROOT_OPTIONS_TOKEN,
                    useValue: options,
                },
                this.createAiServiceProvider(ai_service_1.AiService, this.ROOT_OPTIONS_TOKEN),
            ],
            exports: [ai_service_1.AiService],
        };
    }
    static forRootAsync(options) {
        return {
            module: AiModule_1,
            imports: options.imports ?? [],
            providers: [
                this.createAsyncOptionsProvider(this.ROOT_OPTIONS_TOKEN, options),
                this.createAiServiceProvider(ai_service_1.AiService, this.ROOT_OPTIONS_TOKEN),
            ],
            exports: [ai_service_1.AiService],
        };
    }
    static forFeature(token, options) {
        const optionsToken = `AI_OPTIONS_${token}`;
        return {
            module: AiModule_1,
            providers: [
                {
                    provide: optionsToken,
                    useValue: options,
                },
                this.createAiServiceProvider(token, optionsToken),
            ],
            exports: [token],
        };
    }
    static forFeatureAsync(token, options) {
        const optionsToken = `AI_OPTIONS_${token}`;
        return {
            module: AiModule_1,
            imports: options.imports ?? [],
            providers: [
                this.createAsyncOptionsProvider(optionsToken, options),
                this.createAiServiceProvider(token, optionsToken),
            ],
            exports: [token],
        };
    }
};
exports.AiModule = AiModule;
exports.AiModule = AiModule = AiModule_1 = __decorate([
    (0, common_1.Module)({})
], AiModule);
//# sourceMappingURL=ai.module.js.map