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
exports.Question = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class Question {
    id;
    challengeId;
    stage;
    position;
    type;
    points;
    timeLimit;
    maxAttempts;
    text;
    instructions;
    validationMethod;
    content;
    options;
    answer;
    configuration;
    parentQuestionId;
    createdAt;
    updatedAt;
}
exports.Question = Question;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Question unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    __metadata("design:type", String)
], Question.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Challenge ID this question belongs to',
        example: '550e8400-e29b-41d4-a716-446655440001',
    }),
    __metadata("design:type", String)
], Question.prototype, "challengeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.QuestionStage,
        description: 'Question stage/category',
        example: 'VOCABULARY',
    }),
    __metadata("design:type", String)
], Question.prototype, "stage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Position/order within the challenge',
        example: 1,
    }),
    __metadata("design:type", Number)
], Question.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Question type',
        example: 'image_to_multiple_choices',
    }),
    __metadata("design:type", String)
], Question.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Points value for correct answer',
        example: 10,
    }),
    __metadata("design:type", Number)
], Question.prototype, "points", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Time limit in seconds',
        example: 45,
    }),
    __metadata("design:type", Number)
], Question.prototype, "timeLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum attempts allowed',
        example: 2,
    }),
    __metadata("design:type", Number)
], Question.prototype, "maxAttempts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Question text/prompt',
        example: 'Match the image to the correct English word.',
    }),
    __metadata("design:type", String)
], Question.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Instructions for answering the question',
        example: 'Select the correct option that represents the image.',
    }),
    __metadata("design:type", String)
], Question.prototype, "instructions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: client_1.ValidationMethod,
        description: 'Validation method',
        example: 'AUTO',
    }),
    __metadata("design:type", String)
], Question.prototype, "validationMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Question content (flexible JSON structure)',
        example: { type: 'image', id: '550e8400-e29b-41d4-a716-446655440002' },
    }),
    __metadata("design:type", Object)
], Question.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Answer options (flexible JSON structure)',
        example: ['Apple', 'Orange', 'Grapes', 'Banana'],
    }),
    __metadata("design:type", Object)
], Question.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Expected answer (flexible JSON structure)',
        example: 'Apple',
    }),
    __metadata("design:type", Object)
], Question.prototype, "answer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional configuration (flexible JSON structure)',
        example: { gridWidth: 3, gridHeight: 3 },
    }),
    __metadata("design:type", Object)
], Question.prototype, "configuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Parent question ID for sub-questions',
        example: '550e8400-e29b-41d4-a716-446655440003',
    }),
    __metadata("design:type", String)
], Question.prototype, "parentQuestionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], Question.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], Question.prototype, "updatedAt", void 0);
//# sourceMappingURL=question.entity.js.map