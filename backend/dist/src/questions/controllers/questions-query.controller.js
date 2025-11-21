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
exports.QuestionsQueryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const questions_service_1 = require("../services/questions.service");
const client_1 = require("@prisma/client");
const entities_1 = require("../entities");
let QuestionsQueryController = class QuestionsQueryController {
    questionsService;
    constructor(questionsService) {
        this.questionsService = questionsService;
    }
    findAll(challengeId, stage) {
        return this.questionsService.findAll({ challengeId, stage });
    }
    findByChallengeId(challengeId, stage, type) {
        const filters = {};
        if (stage) {
            filters.stage = stage;
        }
        if (type && type.trim() !== '') {
            filters.type = type;
        }
        return this.questionsService.findByChallengeId(challengeId, filters);
    }
    getSchoolStats(schoolId, questionId) {
        return this.questionsService.getSchoolStats(schoolId, questionId);
    }
    findOne(id) {
        return this.questionsService.findOne(id);
    }
};
exports.QuestionsQueryController = QuestionsQueryController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all questions with optional filters',
        description: 'Retrieves all root-level questions (without parent) with optional filters by challengeId or stage.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'challengeId',
        required: false,
        description: 'Filter by challenge ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'stage',
        required: false,
        enum: client_1.QuestionStage,
        description: 'Filter by question stage',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns filtered questions with sub-questions included',
        type: [entities_1.Question],
    }),
    __param(0, (0, common_1.Query)('challengeId')),
    __param(1, (0, common_1.Query)('stage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], QuestionsQueryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('challenge/:challengeId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all questions for a specific challenge',
        description: 'Retrieves all active, non-deleted questions for a challenge with optional filters by stage or type. Each question is formatted according to its type for optimal frontend consumption.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'stage',
        required: false,
        enum: client_1.QuestionStage,
        description: 'Filter by question stage (optional)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        description: 'Filter by question type (optional). Examples: image_to_multiple_choices, wordbox, spelling, unscramble, etc.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns formatted questions with sub-questions included',
        type: [entities_1.Question],
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - challenge not found',
    }),
    __param(0, (0, common_1.Param)('challengeId')),
    __param(1, (0, common_1.Query)('stage')),
    __param(2, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], QuestionsQueryController.prototype, "findByChallengeId", null);
__decorate([
    (0, common_1.Get)('schools/:schoolId/stats'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get question statistics for a school',
        description: 'Retrieves aggregated statistics for questions answered by students from a specific school. Includes total attempts, correct answers, average time, and success rate.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'questionId',
        required: false,
        description: 'Optional: filter stats for a specific question',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns aggregated question statistics',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    questionId: { type: 'string' },
                    questionText: { type: 'string' },
                    questionType: { type: 'string' },
                    totalAttempts: { type: 'number' },
                    correctAnswers: { type: 'number' },
                    averageTime: {
                        type: 'number',
                        description: 'Average time in seconds',
                    },
                    successRate: {
                        type: 'number',
                        description: 'Success percentage (0-100)',
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'School not found',
    }),
    __param(0, (0, common_1.Param)('schoolId')),
    __param(1, (0, common_1.Query)('questionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], QuestionsQueryController.prototype, "getSchoolStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a question by ID',
        description: 'Retrieves a single question with all related data including sub-questions, parent question, and challenge.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the question with full details',
        type: entities_1.Question,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Question not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuestionsQueryController.prototype, "findOne", null);
exports.QuestionsQueryController = QuestionsQueryController = __decorate([
    (0, swagger_1.ApiTags)('Questions - Query'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('questions'),
    __metadata("design:paramtypes", [questions_service_1.QuestionsService])
], QuestionsQueryController);
//# sourceMappingURL=questions-query.controller.js.map