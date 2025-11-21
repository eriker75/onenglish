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
exports.BulkOperationResponseDto = exports.SchoolStatsResponseDto = exports.ValidationResponseDto = exports.QuestionResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class QuestionResponseDto {
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
    parentQuestionId;
    subQuestions;
    media;
    configurations;
    createdAt;
    updatedAt;
}
exports.QuestionResponseDto = QuestionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Question unique identifier',
        example: 'uuid-123',
    }),
    __metadata("design:type", String)
], QuestionResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Challenge ID this question belongs to',
        example: 'uuid-challenge-1',
    }),
    __metadata("design:type", String)
], QuestionResponseDto.prototype, "challengeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Question stage',
        enum: client_1.QuestionStage,
        example: client_1.QuestionStage.VOCABULARY,
    }),
    __metadata("design:type", String)
], QuestionResponseDto.prototype, "stage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Position within challenge',
        example: 1,
    }),
    __metadata("design:type", Number)
], QuestionResponseDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Question type',
        example: 'image_to_multiple_choices',
    }),
    __metadata("design:type", String)
], QuestionResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Points awarded for correct answer',
        example: 10,
    }),
    __metadata("design:type", Number)
], QuestionResponseDto.prototype, "points", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Time limit in seconds',
        example: 60,
    }),
    __metadata("design:type", Number)
], QuestionResponseDto.prototype, "timeLimit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum attempts allowed',
        example: 3,
    }),
    __metadata("design:type", Number)
], QuestionResponseDto.prototype, "maxAttempts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Question text',
        example: 'What is the name of this animal?',
    }),
    __metadata("design:type", String)
], QuestionResponseDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Instructions for answering',
        example: 'Select the correct option',
    }),
    __metadata("design:type", String)
], QuestionResponseDto.prototype, "instructions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Validation method',
        enum: client_1.ValidationMethod,
        example: client_1.ValidationMethod.AUTO,
    }),
    __metadata("design:type", String)
], QuestionResponseDto.prototype, "validationMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Flexible content field (structure varies by question type)',
    }),
    __metadata("design:type", Object)
], QuestionResponseDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Answer options (for multiple choice questions)',
        example: ['cat', 'dog', 'bird', 'fish'],
    }),
    __metadata("design:type", Object)
], QuestionResponseDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Parent question ID (if this is a sub-question)',
        example: 'uuid-parent-question',
    }),
    __metadata("design:type", String)
], QuestionResponseDto.prototype, "parentQuestionId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sub-questions (if this question has them)',
        type: [QuestionResponseDto],
    }),
    __metadata("design:type", Array)
], QuestionResponseDto.prototype, "subQuestions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Media files attached to this question',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id: { type: 'string' },
                type: { type: 'string', example: 'image' },
                url: { type: 'string', example: 'https://...' },
                filename: { type: 'string' },
                position: { type: 'number' },
                context: { type: 'string' },
            },
        },
    }),
    __metadata("design:type", Array)
], QuestionResponseDto.prototype, "media", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional configurations (key-value pairs)',
        example: { gridWidth: '4', minWords: '50' },
    }),
    __metadata("design:type", Object)
], QuestionResponseDto.prototype, "configurations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2025-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], QuestionResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2025-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], QuestionResponseDto.prototype, "updatedAt", void 0);
class ValidationResponseDto {
    success;
    isCorrect;
    pointsEarned;
    feedbackEnglish;
    feedbackSpanish;
    details;
    studentAnswer;
}
exports.ValidationResponseDto = ValidationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the operation was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ValidationResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the answer is correct',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ValidationResponseDto.prototype, "isCorrect", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Points earned for this answer',
        example: 10,
    }),
    __metadata("design:type", Number)
], ValidationResponseDto.prototype, "pointsEarned", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Feedback in English',
        example: 'Great job! Your answer is correct.',
    }),
    __metadata("design:type", String)
], ValidationResponseDto.prototype, "feedbackEnglish", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Feedback in Spanish',
        example: '¡Buen trabajo! Tu respuesta es correcta.',
    }),
    __metadata("design:type", String)
], ValidationResponseDto.prototype, "feedbackSpanish", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional validation details',
    }),
    __metadata("design:type", Object)
], ValidationResponseDto.prototype, "details", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student answer record',
        type: 'object',
        properties: {
            id: { type: 'string' },
            questionId: { type: 'string' },
            studentId: { type: 'string' },
            isCorrect: { type: 'boolean' },
            pointsEarned: { type: 'number' },
            attemptNumber: { type: 'number' },
            timeSpent: { type: 'number' },
        },
    }),
    __metadata("design:type", Object)
], ValidationResponseDto.prototype, "studentAnswer", void 0);
class SchoolStatsResponseDto {
    questionId;
    questionText;
    questionType;
    totalAttempts;
    correctAnswers;
    averageTime;
    successRate;
}
exports.SchoolStatsResponseDto = SchoolStatsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Question ID',
        example: 'uuid-123',
    }),
    __metadata("design:type", String)
], SchoolStatsResponseDto.prototype, "questionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Question text',
        example: 'What is the name of this animal?',
    }),
    __metadata("design:type", String)
], SchoolStatsResponseDto.prototype, "questionText", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Question type',
        example: 'image_to_multiple_choices',
    }),
    __metadata("design:type", String)
], SchoolStatsResponseDto.prototype, "questionType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of attempts',
        example: 150,
    }),
    __metadata("design:type", Number)
], SchoolStatsResponseDto.prototype, "totalAttempts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of correct answers',
        example: 120,
    }),
    __metadata("design:type", Number)
], SchoolStatsResponseDto.prototype, "correctAnswers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Average time spent in seconds',
        example: 45.5,
    }),
    __metadata("design:type", Number)
], SchoolStatsResponseDto.prototype, "averageTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Success rate percentage (0-100)',
        example: 80.0,
    }),
    __metadata("design:type", Number)
], SchoolStatsResponseDto.prototype, "successRate", void 0);
class BulkOperationResponseDto {
    successCount;
    failureCount;
    totalCount;
    errors;
    results;
}
exports.BulkOperationResponseDto = BulkOperationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of successful operations',
        example: 15,
    }),
    __metadata("design:type", Number)
], BulkOperationResponseDto.prototype, "successCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of failed operations',
        example: 2,
    }),
    __metadata("design:type", Number)
], BulkOperationResponseDto.prototype, "failureCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total operations attempted',
        example: 17,
    }),
    __metadata("design:type", Number)
], BulkOperationResponseDto.prototype, "totalCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of errors for failed operations',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                questionId: { type: 'string' },
                error: { type: 'string' },
            },
        },
    }),
    __metadata("design:type", Array)
], BulkOperationResponseDto.prototype, "errors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated questions',
        type: [QuestionResponseDto],
    }),
    __metadata("design:type", Array)
], BulkOperationResponseDto.prototype, "results", void 0);
//# sourceMappingURL=question-response.dto.js.map