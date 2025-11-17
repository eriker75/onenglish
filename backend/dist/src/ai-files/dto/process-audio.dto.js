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
exports.ValidateSpellingDto = exports.ProcessAudioDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const nestjs_form_data_1 = require("nestjs-form-data");
class ProcessAudioDto {
    audio;
    systemPrompt;
    userPrompt;
    provider;
}
exports.ProcessAudioDto = ProcessAudioDto;
__decorate([
    (0, nestjs_form_data_1.IsFile)(),
    (0, nestjs_form_data_1.MaxFileSize)(10e6),
    (0, nestjs_form_data_1.HasMimeType)(['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac']),
    (0, swagger_1.ApiProperty)({
        type: 'string',
        format: 'binary',
        description: 'Audio file to process',
    }),
    __metadata("design:type", nestjs_form_data_1.FileSystemStoredFile)
], ProcessAudioDto.prototype, "audio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'System prompt for AI processing',
        example: 'You are a spelling validation assistant...',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProcessAudioDto.prototype, "systemPrompt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional user prompt',
        example: 'Validate the spelling',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcessAudioDto.prototype, "userPrompt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Provider to use (gemini, openai, etc.)',
        example: 'google_genai',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProcessAudioDto.prototype, "provider", void 0);
class ValidateSpellingDto {
    audio;
    expectedWord;
    provider;
}
exports.ValidateSpellingDto = ValidateSpellingDto;
__decorate([
    (0, nestjs_form_data_1.IsFile)(),
    (0, nestjs_form_data_1.MaxFileSize)(10e6),
    (0, nestjs_form_data_1.HasMimeType)(['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac']),
    (0, swagger_1.ApiProperty)({
        type: 'string',
        format: 'binary',
        description: 'Audio file with spelling',
    }),
    __metadata("design:type", nestjs_form_data_1.FileSystemStoredFile)
], ValidateSpellingDto.prototype, "audio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Expected word',
        example: 'beautiful',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidateSpellingDto.prototype, "expectedWord", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Provider to use',
        example: 'google_genai',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ValidateSpellingDto.prototype, "provider", void 0);
//# sourceMappingURL=process-audio.dto.js.map