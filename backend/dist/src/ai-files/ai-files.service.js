"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var AiFilesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiFilesService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
let AiFilesService = AiFilesService_1 = class AiFilesService {
    logger = new common_1.Logger(AiFilesService_1.name);
    adapters = new Map();
    defaultProvider;
    setDefaultProvider(provider) {
        this.defaultProvider = provider;
    }
    registerAdapter(adapter) {
        this.adapters.set(adapter.getProviderName(), adapter);
        this.logger.log(`Registered adapter: ${adapter.getProviderName()}`);
    }
    getAdapter(provider) {
        const providerName = provider ?? this.defaultProvider;
        if (!providerName) {
            throw new common_1.NotFoundException('No provider specified and no default provider configured');
        }
        const adapter = this.adapters.get(providerName);
        if (!adapter) {
            throw new common_1.NotFoundException(`No adapter found for provider: ${providerName}. ` +
                `Available providers: ${Array.from(this.adapters.keys()).join(', ')}`);
        }
        return adapter;
    }
    async processSingleFile(file, systemPrompt, userPrompt, temperature, provider) {
        const adapter = this.getAdapter(provider);
        if (!adapter.supportsFileType(file.fileType)) {
            return {
                success: false,
                data: '',
                provider: adapter.getProviderName(),
                model: 'unknown',
                error: `Provider ${adapter.getProviderName()} does not support ${file.fileType} files`,
            };
        }
        try {
            const result = await adapter.processSingleFile(file, systemPrompt, userPrompt, temperature);
            return {
                success: true,
                data: result,
                provider: adapter.getProviderName(),
                model: adapter.getModelName(),
            };
        }
        catch (error) {
            this.logger.error(`Error processing file: ${error.message}`);
            return {
                success: false,
                data: '',
                provider: adapter.getProviderName(),
                model: adapter.getModelName(),
                error: error.message,
            };
        }
    }
    async processMultipleFiles(input, provider) {
        const adapter = this.getAdapter(provider);
        try {
            const result = await adapter.processMultipleFiles(input);
            return {
                success: true,
                data: result,
                provider: adapter.getProviderName(),
                model: adapter.getModelName(),
            };
        }
        catch (error) {
            this.logger.error(`Error processing multiple files: ${error.message}`);
            return {
                success: false,
                data: '',
                provider: adapter.getProviderName(),
                model: adapter.getModelName(),
                error: error.message,
            };
        }
    }
    async validateSpellingFromAudio(audioFile, expectedWord, provider) {
        const adapter = this.getAdapter(provider);
        const systemPrompt = expectedWord
            ? `You are a spelling validation assistant. Listen to the audio where a person spells a word letter by letter in English.
         The expected word is: "${expectedWord}"

         Your task:
         1. Transcribe the exact letters you hear
         2. Form the complete word from those letters
         3. Validate if the spelling matches the expected word
         4. Provide analysis of any mistakes`
            : `You are a spelling validation assistant. Listen to the audio where a person spells a word letter by letter in English.

         Your task:
         1. Transcribe the exact letters you hear
         2. Form the complete word from those letters
         3. Verify if it's a valid English word
         4. Provide analysis`;
        const userPrompt = `Respond ONLY in this JSON format (no markdown, no additional text):
{
  "transcription": "the exact letters you heard",
  "speltWord": "the word formed from the letters",
  "isCorrect": true or false,
  "analysis": "brief explanation"
}`;
        try {
            const response = await adapter.processAudio(audioFile, systemPrompt + '\n\n' + userPrompt, 'json');
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid JSON response from AI');
            }
            const data = JSON.parse(jsonMatch[0]);
            return {
                success: true,
                data,
                provider: adapter.getProviderName(),
                model: adapter.getProviderName(),
            };
        }
        catch (error) {
            this.logger.error(`Error validating spelling: ${error.message}`);
            return {
                success: false,
                data: {
                    isCorrect: false,
                    speltWord: '',
                    transcription: '',
                    analysis: `Error: ${error.message}`,
                },
                provider: adapter.getProviderName(),
                model: adapter.getProviderName(),
                error: error.message,
            };
        }
    }
    async createStoryFromImages(images, storyType = 'short', additionalInstructions, provider) {
        const systemPrompt = `You are a creative storytelling assistant. Your task is to create ${storyType === 'short' ? 'a short story or paragraph' : 'a detailed story'} that connects the images provided.

    Guidelines:
    - Be creative and engaging
    - Connect all images in a logical narrative
    - Use appropriate English level based on context
    - Make it interesting and coherent
    ${additionalInstructions ? `\n    - ${additionalInstructions}` : ''}`;
        const userPrompt = `Create ${storyType === 'short' ? 'a short story' : 'a detailed story'} that connects these images.`;
        return this.processMultipleFiles({
            files: images,
            systemPrompt,
            userPrompt,
        }, provider);
    }
    async analyzeImages(images, analysisType = 'describe', provider) {
        const prompts = {
            describe: {
                system: 'You are an image analysis assistant. Describe each image in detail.',
                user: 'Describe what you see in each image.',
            },
            compare: {
                system: 'You are an image comparison assistant. Compare and contrast the images provided.',
                user: 'Compare these images. What are the similarities and differences?',
            },
            'find-connections': {
                system: 'You are an image connection assistant. Find connections and relationships between the images.',
                user: 'Find connections between these images. How do they relate to each other?',
            },
        };
        const { system, user } = prompts[analysisType];
        return this.processMultipleFiles({
            files: images,
            systemPrompt: system,
            userPrompt: user,
        }, provider);
    }
    filePathToFileInput(filePath, mimeType, fileType) {
        const fileBuffer = fs.readFileSync(filePath);
        const base64Data = fileBuffer.toString('base64');
        return {
            data: base64Data,
            mimeType,
            fileType,
            fileName: filePath.split('/').pop(),
        };
    }
    getAvailableProviders() {
        return Array.from(this.adapters.keys());
    }
    providerSupportsFileType(fileType, provider) {
        try {
            const adapter = this.getAdapter(provider);
            return adapter.supportsFileType(fileType);
        }
        catch {
            return false;
        }
    }
};
exports.AiFilesService = AiFilesService;
exports.AiFilesService = AiFilesService = AiFilesService_1 = __decorate([
    (0, common_1.Injectable)()
], AiFilesService);
//# sourceMappingURL=ai-files.service.js.map