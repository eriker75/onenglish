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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiFilesTestController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nestjs_form_data_1 = require("nestjs-form-data");
const ai_files_service_1 = require("../ai-files.service");
const process_audio_dto_1 = require("../dto/process-audio.dto");
const process_image_dto_1 = require("../dto/process-image.dto");
const responses_dto_1 = require("../dto/responses.dto");
const file_type_enum_1 = require("../enums/file-type.enum");
let AiFilesTestController = class AiFilesTestController {
    aiFilesService;
    constructor(aiFilesService) {
        this.aiFilesService = aiFilesService;
    }
    getProviders() {
        const providers = this.aiFilesService.getAvailableProviders();
        return {
            providers,
            count: providers.length,
        };
    }
    getCapabilities() {
        const providers = this.aiFilesService.getAvailableProviders();
        const provider = providers[0] || 'google_genai';
        return {
            provider,
            capabilities: {
                audio: this.aiFilesService.providerSupportsFileType(file_type_enum_1.FileType.AUDIO, provider),
                image: this.aiFilesService.providerSupportsFileType(file_type_enum_1.FileType.IMAGE, provider),
                video: this.aiFilesService.providerSupportsFileType(file_type_enum_1.FileType.VIDEO, provider),
                document: this.aiFilesService.providerSupportsFileType(file_type_enum_1.FileType.DOCUMENT, provider),
            },
        };
    }
    async validateSpelling(dto) {
        const audioInput = this.aiFilesService.filePathToFileInput(dto.audio.path, this.getMimeTypeFromFile(dto.audio.path, 'audio'), file_type_enum_1.FileType.AUDIO);
        const result = await this.aiFilesService.validateSpellingFromAudio(audioInput, dto.expectedWord, dto.provider);
        return {
            success: result.success,
            isCorrect: result.data.isCorrect,
            speltWord: result.data.speltWord,
            transcription: result.data.transcription,
            analysis: result.data.analysis,
            provider: result.provider,
            model: result.model,
            error: result.error,
        };
    }
    async processAudio(dto) {
        const audioInput = this.aiFilesService.filePathToFileInput(dto.audio.path, this.getMimeTypeFromFile(dto.audio.path, 'audio'), file_type_enum_1.FileType.AUDIO);
        const result = await this.aiFilesService.processSingleFile(audioInput, dto.systemPrompt, dto.userPrompt, 0.2, dto.provider);
        return result;
    }
    async createStory(dto) {
        const imageInputs = dto.images.map((img) => this.aiFilesService.filePathToFileInput(img.path, this.getMimeTypeFromFile(img.path, 'image'), file_type_enum_1.FileType.IMAGE));
        const result = await this.aiFilesService.createStoryFromImages(imageInputs, dto.storyType || 'short', dto.additionalInstructions, dto.provider);
        return {
            success: result.success,
            story: result.data,
            provider: result.provider,
            model: result.model,
            error: result.error,
        };
    }
    async processImages(dto) {
        let images = dto.images;
        if (!Array.isArray(images)) {
            images = images ? [images] : [];
        }
        const imageInputs = images.map((img) => this.aiFilesService.filePathToFileInput(img.path, this.getMimeTypeFromFile(img.path, 'image'), file_type_enum_1.FileType.IMAGE));
        const result = await this.aiFilesService.processMultipleFiles({
            files: imageInputs,
            systemPrompt: dto.systemPrompt,
            userPrompt: dto.userPrompt,
        }, dto.provider);
        return result;
    }
    async analyzeImages(dto) {
        const imageInputs = dto.images.map((img) => this.aiFilesService.filePathToFileInput(img.path, this.getMimeTypeFromFile(img.path, 'image'), file_type_enum_1.FileType.IMAGE));
        const result = await this.aiFilesService.analyzeImages(imageInputs, dto.analysisType || 'describe', dto.provider);
        return result;
    }
    getMimeTypeFromFile(filePath, fileType) {
        const ext = filePath.split('.').pop()?.toLowerCase();
        if (fileType === 'audio') {
            const audioTypes = {
                mp3: file_type_enum_1.SupportedMimeType.AUDIO_MP3,
                wav: file_type_enum_1.SupportedMimeType.AUDIO_WAV,
                ogg: file_type_enum_1.SupportedMimeType.AUDIO_OGG,
                flac: file_type_enum_1.SupportedMimeType.AUDIO_FLAC,
                m4a: file_type_enum_1.SupportedMimeType.AUDIO_M4A,
            };
            return audioTypes[ext || 'mp3'] || file_type_enum_1.SupportedMimeType.AUDIO_MP3;
        }
        if (fileType === 'image') {
            const imageTypes = {
                jpg: file_type_enum_1.SupportedMimeType.IMAGE_JPEG,
                jpeg: file_type_enum_1.SupportedMimeType.IMAGE_JPEG,
                png: file_type_enum_1.SupportedMimeType.IMAGE_PNG,
                webp: file_type_enum_1.SupportedMimeType.IMAGE_WEBP,
                gif: file_type_enum_1.SupportedMimeType.IMAGE_GIF,
            };
            return imageTypes[ext || 'jpg'] || file_type_enum_1.SupportedMimeType.IMAGE_JPEG;
        }
        if (fileType === 'video') {
            const videoTypes = {
                mp4: file_type_enum_1.SupportedMimeType.VIDEO_MP4,
                webm: file_type_enum_1.SupportedMimeType.VIDEO_WEBM,
                mov: file_type_enum_1.SupportedMimeType.VIDEO_MOV,
            };
            return videoTypes[ext || 'mp4'] || file_type_enum_1.SupportedMimeType.VIDEO_MP4;
        }
        return file_type_enum_1.SupportedMimeType.AUDIO_MP3;
    }
};
exports.AiFilesTestController = AiFilesTestController;
__decorate([
    (0, common_1.Get)('providers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available AI providers' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of available providers',
        schema: {
            type: 'object',
            properties: {
                providers: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['google_genai'],
                },
                count: { type: 'number', example: 1 },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiFilesTestController.prototype, "getProviders", null);
__decorate([
    (0, common_1.Get)('capabilities'),
    (0, swagger_1.ApiOperation)({ summary: 'Check provider capabilities' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Provider capabilities by file type',
        schema: {
            type: 'object',
            properties: {
                provider: { type: 'string', example: 'google_genai' },
                capabilities: {
                    type: 'object',
                    properties: {
                        audio: { type: 'boolean', example: true },
                        image: { type: 'boolean', example: true },
                        video: { type: 'boolean', example: true },
                        document: { type: 'boolean', example: false },
                    },
                },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AiFilesTestController.prototype, "getCapabilities", null);
__decorate([
    (0, common_1.Post)('validate-spelling'),
    (0, swagger_1.ApiOperation)({
        summary: 'Validate word spelling from audio recording',
        description: 'Upload an audio file where a person spells a word letter by letter. ' +
            'The AI will transcribe the letters and validate if the spelling is correct.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Spelling validation result',
        type: responses_dto_1.SpellingValidationResponseDto,
    }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [process_audio_dto_1.ValidateSpellingDto]),
    __metadata("design:returntype", Promise)
], AiFilesTestController.prototype, "validateSpelling", null);
__decorate([
    (0, common_1.Post)('process-audio'),
    (0, swagger_1.ApiOperation)({
        summary: 'Process audio with custom prompt',
        description: 'Upload an audio file and provide a custom system prompt for AI processing. ' +
            'Use this for custom audio analysis, transcription, or any audio-related task.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Audio processing result',
        type: responses_dto_1.FileProcessingResponseDto,
    }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [process_audio_dto_1.ProcessAudioDto]),
    __metadata("design:returntype", Promise)
], AiFilesTestController.prototype, "processAudio", null);
__decorate([
    (0, common_1.Post)('create-story'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create story from images',
        description: 'Upload one or more images and the AI will create a story that connects them. ' +
            'Perfect for creative writing exercises or image-based comprehension.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Story creation result',
        schema: {
            type: 'object',
            properties: {
                success: { type: 'boolean', example: true },
                story: {
                    type: 'string',
                    example: 'Once upon a time, there was a beautiful landscape...',
                },
                provider: { type: 'string', example: 'google_genai' },
                model: { type: 'string', example: 'gemini-2.0-flash-exp' },
                error: { type: 'string' },
            },
        },
    }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [process_image_dto_1.CreateStoryFromImagesDto]),
    __metadata("design:returntype", Promise)
], AiFilesTestController.prototype, "createStory", null);
__decorate([
    (0, common_1.Post)('process-images'),
    (0, swagger_1.ApiOperation)({
        summary: 'Process images with custom prompt',
        description: 'Upload one or more images and provide a custom system prompt for AI processing. ' +
            'Use this for image description, analysis, comparison, or any image-related task.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Image processing result',
        type: responses_dto_1.FileProcessingResponseDto,
    }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [process_image_dto_1.ProcessImagesDto]),
    __metadata("design:returntype", Promise)
], AiFilesTestController.prototype, "processImages", null);
__decorate([
    (0, common_1.Post)('analyze-images'),
    (0, swagger_1.ApiOperation)({
        summary: 'Analyze images (describe, compare, find connections)',
        description: 'Upload images and choose an analysis type: describe each image, ' +
            'compare them, or find connections between them.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Image analysis result',
        type: responses_dto_1.FileProcessingResponseDto,
    }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiFilesTestController.prototype, "analyzeImages", null);
exports.AiFilesTestController = AiFilesTestController = __decorate([
    (0, swagger_1.ApiTags)('AI Files - Testing'),
    (0, common_1.Controller)('ai-files/test'),
    __metadata("design:paramtypes", [ai_files_service_1.AiFilesService])
], AiFilesTestController);
//# sourceMappingURL=ai-files-test.controller.js.map