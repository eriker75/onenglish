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
exports.StoryCreationResponseDto = exports.FileProcessingResponseDto = exports.SpellingValidationResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SpellingValidationResponseDto {
    success;
    isCorrect;
    speltWord;
    transcription;
    analysis;
    provider;
    model;
    error;
}
exports.SpellingValidationResponseDto = SpellingValidationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the operation was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], SpellingValidationResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the spelling is correct',
        example: true,
    }),
    __metadata("design:type", Boolean)
], SpellingValidationResponseDto.prototype, "isCorrect", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The word that was spelled',
        example: 'beautiful',
    }),
    __metadata("design:type", String)
], SpellingValidationResponseDto.prototype, "speltWord", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Raw transcription of letters heard',
        example: 'B-E-A-U-T-I-F-U-L',
    }),
    __metadata("design:type", String)
], SpellingValidationResponseDto.prototype, "transcription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Analysis of the spelling',
        example: 'Correct spelling of the word "beautiful"',
    }),
    __metadata("design:type", String)
], SpellingValidationResponseDto.prototype, "analysis", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Provider used for processing',
        example: 'google_genai',
    }),
    __metadata("design:type", String)
], SpellingValidationResponseDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Model used for processing',
        example: 'gemini-2.0-flash-exp',
    }),
    __metadata("design:type", String)
], SpellingValidationResponseDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Error message if operation failed',
        example: 'Invalid audio format',
    }),
    __metadata("design:type", String)
], SpellingValidationResponseDto.prototype, "error", void 0);
class FileProcessingResponseDto {
    success;
    data;
    provider;
    model;
    error;
}
exports.FileProcessingResponseDto = FileProcessingResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the operation was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], FileProcessingResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Processed data/result',
        example: 'The image shows a beautiful landscape...',
    }),
    __metadata("design:type", String)
], FileProcessingResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Provider used for processing',
        example: 'google_genai',
    }),
    __metadata("design:type", String)
], FileProcessingResponseDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Model used for processing',
        example: 'gemini-2.0-flash-exp',
    }),
    __metadata("design:type", String)
], FileProcessingResponseDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Error message if operation failed',
        example: 'File format not supported',
    }),
    __metadata("design:type", String)
], FileProcessingResponseDto.prototype, "error", void 0);
class StoryCreationResponseDto extends FileProcessingResponseDto {
    story;
}
exports.StoryCreationResponseDto = StoryCreationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Generated story',
        example: 'Once upon a time, there was a beautiful landscape where children played...',
    }),
    __metadata("design:type", String)
], StoryCreationResponseDto.prototype, "story", void 0);
//# sourceMappingURL=responses.dto.js.map