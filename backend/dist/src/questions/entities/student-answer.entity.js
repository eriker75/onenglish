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
exports.StudentAnswer = void 0;
const swagger_1 = require("@nestjs/swagger");
class StudentAnswer {
    id;
    studentId;
    questionId;
    challengeId;
    userAnswer;
    isCorrect;
    attemptNumber;
    timeSpent;
    pointsEarned;
    feedbackEnglish;
    feedbackSpanish;
    audioUrl;
    answeredAt;
    createdAt;
    updatedAt;
}
exports.StudentAnswer = StudentAnswer;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student answer unique identifier',
        example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    __metadata("design:type", String)
], StudentAnswer.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student ID who answered',
        example: '550e8400-e29b-41d4-a716-446655440001',
    }),
    __metadata("design:type", String)
], StudentAnswer.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Question ID that was answered',
        example: '550e8400-e29b-41d4-a716-446655440002',
    }),
    __metadata("design:type", String)
], StudentAnswer.prototype, "questionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Challenge ID this answer belongs to',
        example: '550e8400-e29b-41d4-a716-446655440003',
    }),
    __metadata("design:type", String)
], StudentAnswer.prototype, "challengeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User answer (flexible JSON structure)',
        example: 'Apple',
    }),
    __metadata("design:type", Object)
], StudentAnswer.prototype, "userAnswer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the answer is correct',
        example: true,
    }),
    __metadata("design:type", Boolean)
], StudentAnswer.prototype, "isCorrect", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Attempt number',
        example: 1,
    }),
    __metadata("design:type", Number)
], StudentAnswer.prototype, "attemptNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Time spent answering in seconds',
        example: 35,
    }),
    __metadata("design:type", Number)
], StudentAnswer.prototype, "timeSpent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Points earned for this answer',
        example: 10,
    }),
    __metadata("design:type", Number)
], StudentAnswer.prototype, "pointsEarned", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'AI feedback in English',
        example: 'Great job! Your answer is correct.',
    }),
    __metadata("design:type", String)
], StudentAnswer.prototype, "feedbackEnglish", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'AI feedback in Spanish',
        example: '¡Buen trabajo! Tu respuesta es correcta.',
    }),
    __metadata("design:type", String)
], StudentAnswer.prototype, "feedbackSpanish", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Audio URL for speaking questions',
        example: 'https://example.com/audio/answer123.mp3',
    }),
    __metadata("design:type", String)
], StudentAnswer.prototype, "audioUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'When the answer was submitted',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], StudentAnswer.prototype, "answeredAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], StudentAnswer.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-01-15T10:30:00Z',
    }),
    __metadata("design:type", Date)
], StudentAnswer.prototype, "updatedAt", void 0);
//# sourceMappingURL=student-answer.entity.js.map