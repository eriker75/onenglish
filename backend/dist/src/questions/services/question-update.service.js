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
exports.QuestionUpdateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let QuestionUpdateService = class QuestionUpdateService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateQuestion(questionId, updateData) {
        const question = await this.prisma.question.findUnique({
            where: { id: questionId },
            include: { parentQuestion: true },
        });
        if (!question) {
            throw new common_1.NotFoundException('Question not found');
        }
        const updatedQuestion = await this.prisma.question.update({
            where: { id: questionId },
            data: updateData,
        });
        if (question.parentQuestionId && updateData.points !== undefined) {
            await this.recalculateParentPoints(question.parentQuestionId);
        }
        return updatedQuestion;
    }
    async recalculateParentPoints(parentQuestionId) {
        const subQuestions = await this.prisma.question.findMany({
            where: { parentQuestionId },
            select: { points: true },
        });
        const totalPoints = subQuestions.reduce((sum, sq) => sum + sq.points, 0);
        await this.prisma.question.update({
            where: { id: parentQuestionId },
            data: { points: totalPoints },
        });
    }
    async calculatePointsFromSubQuestions(subQuestions) {
        return subQuestions.reduce((sum, sq) => sum + (sq.points || 0), 0);
    }
    async updateQuestionText(questionId, text) {
        return this.updateQuestion(questionId, { text });
    }
    async updateQuestionInstructions(questionId, instructions) {
        return this.updateQuestion(questionId, { instructions });
    }
    async updateQuestionTimeLimit(questionId, timeLimit) {
        if (timeLimit < 1) {
            throw new common_1.BadRequestException('Time limit must be at least 1 second');
        }
        return this.updateQuestion(questionId, { timeLimit });
    }
    async updateQuestionMaxAttempts(questionId, maxAttempts) {
        if (maxAttempts < 1) {
            throw new common_1.BadRequestException('Max attempts must be at least 1');
        }
        return this.updateQuestion(questionId, { maxAttempts });
    }
    async updateQuestionPoints(questionId, points) {
        if (points < 0) {
            throw new common_1.BadRequestException('Points cannot be negative');
        }
        return this.updateQuestion(questionId, { points });
    }
    async updateQuestionContent(questionId, content) {
        return this.updateQuestion(questionId, { content });
    }
    async updateQuestionOptions(questionId, options) {
        return this.updateQuestion(questionId, { options });
    }
    async updateQuestionAnswer(questionId, answer) {
        return this.updateQuestion(questionId, { answer });
    }
    async updateQuestionPosition(questionId, position) {
        if (position < 1) {
            throw new common_1.BadRequestException('Position must be at least 1');
        }
        return this.updateQuestion(questionId, { position });
    }
    async updateQuestionPhase(questionId, phase) {
        const phaseRegex = /^phase_\d+$/;
        if (!phaseRegex.test(phase)) {
            throw new common_1.BadRequestException('Phase must follow format: phase_1, phase_2, etc.');
        }
        return this.updateQuestion(questionId, { phase });
    }
    async bulkUpdateQuestions(updates) {
        const results = [];
        for (const update of updates) {
            const result = await this.updateQuestion(update.questionId, update.data);
            results.push(result);
        }
        return results;
    }
    async deleteQuestion(questionId) {
        const question = await this.prisma.question.findUnique({
            where: { id: questionId },
            include: {
                subQuestions: true,
                parentQuestion: true,
            },
        });
        if (!question) {
            throw new common_1.NotFoundException('Question not found');
        }
        await this.prisma.question.delete({
            where: { id: questionId },
        });
        if (question.parentQuestionId) {
            await this.recalculateParentPoints(question.parentQuestionId);
        }
    }
};
exports.QuestionUpdateService = QuestionUpdateService;
exports.QuestionUpdateService = QuestionUpdateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuestionUpdateService);
//# sourceMappingURL=question-update.service.js.map