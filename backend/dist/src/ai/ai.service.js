"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const universal_1 = require("langchain/chat_models/universal");
let AiService = class AiService {
    options;
    llm;
    constructor(options) {
        this.options = options;
    }
    async onModuleInit() {
        this.llm = await (0, universal_1.initChatModel)(this.options.model, {
            modelProvider: this.options.provider,
            apiKey: this.options.apiKey,
            temperature: this.options.temperature ?? 0.2,
        });
    }
    async invoke(prompt) {
        const msg = [{ role: 'user', content: prompt }];
        const response = await this.llm.invoke(msg);
        return response.content;
    }
    async invokeText(prompt) {
        const content = await this.invoke(prompt);
        if (typeof content === 'string') {
            return content;
        }
        if (Array.isArray(content)) {
            return content
                .map((item) => typeof item === 'string' ? item : item.text || '')
                .filter(Boolean)
                .join('\n');
        }
        return String(content);
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], AiService);
//# sourceMappingURL=ai.service.js.map