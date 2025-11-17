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
var GeminiFilesAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiFilesAdapter = void 0;
const common_1 = require("@nestjs/common");
const genai_1 = require("@google/genai");
const file_type_enum_1 = require("../enums/file-type.enum");
let GeminiFilesAdapter = GeminiFilesAdapter_1 = class GeminiFilesAdapter {
    options;
    logger = new common_1.Logger(GeminiFilesAdapter_1.name);
    client = null;
    model;
    defaultTemperature;
    constructor(options) {
        this.options = options;
        this.model = options.model;
        this.defaultTemperature = options.defaultTemperature ?? 0.2;
    }
    getClient() {
        if (this.client) {
            return this.client;
        }
        const client = new genai_1.GoogleGenAI({ apiKey: this.options.apiKey });
        this.client = client;
        return client;
    }
    getProviderName() {
        return 'google_genai';
    }
    getModelName() {
        return this.model;
    }
    supportsFileType(fileType) {
        const supportedTypes = [file_type_enum_1.FileType.AUDIO, file_type_enum_1.FileType.IMAGE, file_type_enum_1.FileType.VIDEO];
        return supportedTypes.includes(fileType);
    }
    async processSingleFile(file, systemPrompt, userPrompt, temperature) {
        const client = this.getClient();
        const parts = [
            {
                inlineData: {
                    mimeType: file.mimeType,
                    data: file.data,
                },
            },
        ];
        if (userPrompt) {
            parts.push({ text: userPrompt });
        }
        try {
            const result = await client.models.generateContent({
                model: this.model,
                contents: parts,
                config: {
                    systemInstruction: systemPrompt,
                    temperature: temperature ?? this.defaultTemperature,
                },
            });
            return result.text || '';
        }
        catch (error) {
            this.logger.error(`Error processing file with Gemini: ${error.message}`);
            throw error;
        }
    }
    async processMultipleFiles(input) {
        const client = this.getClient();
        const parts = input.files.map((file) => ({
            inlineData: {
                mimeType: file.mimeType,
                data: file.data,
            },
        }));
        if (input.userPrompt) {
            parts.push({ text: input.userPrompt });
        }
        this.logger.debug(`Processing ${input.files.length} files`);
        this.logger.debug(`Parts structure: ${JSON.stringify(parts.map((p) => ({
            hasInlineData: !!p.inlineData,
            mimeType: p.inlineData?.mimeType,
            dataLength: p.inlineData?.data?.length || 0,
            hasText: !!p.text,
        })))}`);
        try {
            const result = await client.models.generateContent({
                model: this.model,
                contents: parts,
                config: {
                    systemInstruction: input.systemPrompt,
                    temperature: input.temperature ?? this.defaultTemperature,
                },
            });
            return result.text || '';
        }
        catch (error) {
            this.logger.error(`Error processing multiple files with Gemini: ${error.message}`);
            throw error;
        }
    }
    async processAudio(audioFile, systemPrompt, expectedOutput = 'text') {
        if (audioFile.fileType !== file_type_enum_1.FileType.AUDIO) {
            throw new Error('File must be of type AUDIO');
        }
        let enhancedPrompt = systemPrompt;
        if (expectedOutput === 'json') {
            enhancedPrompt +=
                '\n\nRespond ONLY with valid JSON (no markdown, no additional text).';
        }
        return this.processSingleFile(audioFile, enhancedPrompt);
    }
    async processImages(images, systemPrompt, userPrompt) {
        const invalidFiles = images.filter((img) => img.fileType !== file_type_enum_1.FileType.IMAGE);
        if (invalidFiles.length > 0) {
            throw new Error('All files must be of type IMAGE');
        }
        return this.processMultipleFiles({
            files: images,
            systemPrompt,
            userPrompt,
        });
    }
};
exports.GeminiFilesAdapter = GeminiFilesAdapter;
exports.GeminiFilesAdapter = GeminiFilesAdapter = GeminiFilesAdapter_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], GeminiFilesAdapter);
//# sourceMappingURL=gemini-files.adapter.js.map