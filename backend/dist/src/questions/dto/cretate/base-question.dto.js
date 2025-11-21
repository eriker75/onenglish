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
exports.BaseCreateQuestionDto = exports.BaseCreateQuestionWithoutStageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class BaseCreateQuestionWithoutStageDto {
    challengeId;
    points;
    timeLimit = 60;
    maxAttempts = 1;
    text;
    instructions;
}
exports.BaseCreateQuestionWithoutStageDto = BaseCreateQuestionWithoutStageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Challenge ID',
        example: '507f1f77-bcf8-6cd7-9943-9101abcd1234',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseCreateQuestionWithoutStageDto.prototype, "challengeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Points value for correct answer',
        example: 10,
        minimum: 0,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseCreateQuestionWithoutStageDto.prototype, "points", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Time limit in seconds',
        example: 60,
        default: 60,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseCreateQuestionWithoutStageDto.prototype, "timeLimit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum attempts allowed',
        example: 1,
        default: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], BaseCreateQuestionWithoutStageDto.prototype, "maxAttempts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Question text/prompt. If not provided, a default text will be assigned based on question type.',
        example: 'Match the image to the correct English word.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseCreateQuestionWithoutStageDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Instructions for answering the question. If not provided, default instructions will be assigned based on question type.',
        example: 'Select the correct option that represents the image.',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseCreateQuestionWithoutStageDto.prototype, "instructions", void 0);
class BaseCreateQuestionDto extends BaseCreateQuestionWithoutStageDto {
    stage;
}
exports.BaseCreateQuestionDto = BaseCreateQuestionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.QuestionStage,
        example: 'VOCABULARY',
        description: 'Question stage/category',
    }),
    (0, class_validator_1.IsEnum)(client_1.QuestionStage),
    __metadata("design:type", String)
], BaseCreateQuestionDto.prototype, "stage", void 0);
//# sourceMappingURL=base-question.dto.js.map