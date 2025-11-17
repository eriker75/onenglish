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
exports.CreateStoryFromImagesDto = exports.ProcessImagesDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const nestjs_form_data_1 = require("nestjs-form-data");
class ProcessImagesDto {
    images;
    systemPrompt;
    userPrompt;
    provider;
}
exports.ProcessImagesDto = ProcessImagesDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'array',
        items: { type: 'string', format: 'binary' },
        description: 'Image files to process',
    }),
    (0, nestjs_form_data_1.IsFiles)(),
    (0, nestjs_form_data_1.HasMimeType)(['image/jpeg', 'image/png', 'image/jpg', 'image/webp'], {
        each: true,
    }),
    __metadata("design:type", Array)
], ProcessImagesDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'System prompt for AI processing',
        example: 'You are a creative storytelling assistant...',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProcessImagesDto.prototype, "systemPrompt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User prompt',
        example: 'Create a story connecting these images',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcessImagesDto.prototype, "userPrompt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Provider to use',
        example: 'google_genai',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcessImagesDto.prototype, "provider", void 0);
class CreateStoryFromImagesDto {
    images;
    storyType;
    additionalInstructions;
    provider;
}
exports.CreateStoryFromImagesDto = CreateStoryFromImagesDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'array',
        items: { type: 'string', format: 'binary' },
        description: 'Images to create story from',
    }),
    (0, nestjs_form_data_1.IsFiles)(),
    (0, nestjs_form_data_1.HasMimeType)(['image/jpeg', 'image/png', 'image/jpg', 'image/webp'], {
        each: true,
    }),
    __metadata("design:type", Array)
], CreateStoryFromImagesDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Story type',
        enum: ['short', 'detailed'],
        default: 'short',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['short', 'detailed']),
    __metadata("design:type", String)
], CreateStoryFromImagesDto.prototype, "storyType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional instructions',
        example: 'Use simple English suitable for beginners',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStoryFromImagesDto.prototype, "additionalInstructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Provider to use',
        example: 'google_genai',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateStoryFromImagesDto.prototype, "provider", void 0);
//# sourceMappingURL=process-image.dto.js.map