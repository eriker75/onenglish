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
exports.BulkUpdateQuestionsDto = exports.UpdateQuestionPointsDto = exports.UpdateQuestionTimeLimitDto = exports.UpdateQuestionInstructionsDto = exports.UpdateQuestionTextDto = exports.UpdateQuestionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class UpdateQuestionDto {
    text;
    instructions;
    timeLimit;
    maxAttempts;
    points;
    stage;
    position;
    content;
    options;
    answer;
}
exports.UpdateQuestionDto = UpdateQuestionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Question text',
        example: 'What is the name of this animal?',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateQuestionDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Instructions for answering the question',
        example: 'Select the correct option that matches the image',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateQuestionDto.prototype, "instructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Time limit in seconds',
        example: 60,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateQuestionDto.prototype, "timeLimit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum number of attempts allowed',
        example: 3,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateQuestionDto.prototype, "maxAttempts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Points awarded for correct answer (auto-calculated for questions with sub-questions)',
        example: 10,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateQuestionDto.prototype, "points", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Question stage',
        enum: client_1.QuestionStage,
        example: client_1.QuestionStage.VOCABULARY,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.QuestionStage),
    __metadata("design:type", String)
], UpdateQuestionDto.prototype, "stage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Position within the challenge',
        example: 1,
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateQuestionDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Question content (flexible JSON field)',
        example: {
            grid: [
                ['a', 'b'],
                ['c', 'd'],
            ],
        },
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateQuestionDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Answer options (for multiple choice questions)',
        example: ['cat', 'dog', 'bird', 'fish'],
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateQuestionDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Correct answer(s)',
        example: 'cat',
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateQuestionDto.prototype, "answer", void 0);
class UpdateQuestionTextDto {
    text;
}
exports.UpdateQuestionTextDto = UpdateQuestionTextDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'New question text',
        example: 'What is the name of this animal?',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateQuestionTextDto.prototype, "text", void 0);
class UpdateQuestionInstructionsDto {
    instructions;
}
exports.UpdateQuestionInstructionsDto = UpdateQuestionInstructionsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'New instructions',
        example: 'Select the correct option',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateQuestionInstructionsDto.prototype, "instructions", void 0);
class UpdateQuestionTimeLimitDto {
    timeLimit;
}
exports.UpdateQuestionTimeLimitDto = UpdateQuestionTimeLimitDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'New time limit in seconds',
        example: 90,
        minimum: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateQuestionTimeLimitDto.prototype, "timeLimit", void 0);
class UpdateQuestionPointsDto {
    points;
}
exports.UpdateQuestionPointsDto = UpdateQuestionPointsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'New points value',
        example: 15,
        minimum: 0,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateQuestionPointsDto.prototype, "points", void 0);
class BulkUpdateQuestionsDto {
    updates;
}
exports.BulkUpdateQuestionsDto = BulkUpdateQuestionsDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Array of question updates',
        example: [
            { questionId: 'uuid-1', data: { points: 10 } },
            { questionId: 'uuid-2', data: { timeLimit: 90 } },
        ],
        type: 'array',
        items: {
            type: 'object',
            properties: {
                questionId: { type: 'string' },
                data: { type: 'object' },
            },
        },
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], BulkUpdateQuestionsDto.prototype, "updates", void 0);
//# sourceMappingURL=update-question.dto.js.map