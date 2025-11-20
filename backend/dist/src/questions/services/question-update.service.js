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
const question_media_service_1 = require("./question-media.service");
let QuestionUpdateService = class QuestionUpdateService {
    prisma;
    questionMediaService;
    constructor(prisma, questionMediaService) {
        this.prisma = prisma;
        this.questionMediaService = questionMediaService;
    }
    validateWordboxGrid(grid) {
        if (!grid || !Array.isArray(grid) || grid.length === 0) {
            throw new common_1.BadRequestException('Invalid wordbox grid structure');
        }
        const allLetters = grid
            .flat()
            .map((letter) => letter.toLowerCase());
        const letterSet = new Set(allLetters);
        if (letterSet.size !== allLetters.length) {
            const letterCounts = {};
            for (const letter of allLetters) {
                letterCounts[letter] = (letterCounts[letter] || 0) + 1;
            }
            const repeatedLetters = Object.entries(letterCounts)
                .filter(([_, count]) => count > 1)
                .map(([letter, count]) => `'${letter.toUpperCase()}' (${count} times)`)
                .join(', ');
            throw new common_1.BadRequestException(`Repeated letters found in wordbox grid: ${repeatedLetters}. Each letter must appear only once.`);
        }
    }
    async updateQuestion(questionId, updateData) {
        const question = await this.prisma.question.findUnique({
            where: { id: questionId },
            include: { parentQuestion: true },
        });
        if (!question) {
            throw new common_1.NotFoundException('Question not found');
        }
        if (question.deletedAt !== null) {
            throw new common_1.BadRequestException('Cannot update a deleted question. This question was deleted and is archived for data integrity.');
        }
        const { gridWidth, gridHeight, maxWords, ...restData } = updateData;
        const { media, challengeId, stage, ...questionData } = restData;
        const multipleChoiceTypes = [
            'image_to_multiple_choices',
            'word_match',
            'fast_test',
            'lyrics_training',
        ];
        if (multipleChoiceTypes.includes(question.type)) {
            const finalOptions = questionData.options || question.options;
            const finalAnswer = questionData.answer || question.answer;
            if (Array.isArray(finalOptions) && finalAnswer) {
                const isValid = question.type === 'image_to_multiple_choices'
                    ? finalOptions
                        .map((opt) => opt.toLowerCase())
                        .includes(finalAnswer.toLowerCase())
                    : finalOptions.includes(finalAnswer);
                if (!isValid) {
                    throw new common_1.BadRequestException(`Answer "${finalAnswer}" must be one of the options: ${finalOptions.join(', ')}`);
                }
            }
        }
        if (question.type === 'wordbox' && questionData.content) {
            this.validateWordboxGrid(questionData.content);
        }
        const updatedQuestion = await this.prisma.question.update({
            where: { id: questionId },
            data: questionData,
        });
        if (media) {
            const uploadedFile = await this.questionMediaService.uploadSingleFile(media);
            await this.prisma.questionMedia.deleteMany({
                where: { questionId },
            });
            await this.questionMediaService.attachMediaFiles(questionId, [
                {
                    id: uploadedFile.id,
                    context: 'main',
                    position: 0,
                },
            ]);
        }
        if (question.type === 'wordbox' &&
            (gridWidth !== undefined ||
                gridHeight !== undefined ||
                maxWords !== undefined)) {
            const existingConfigs = await this.prisma.questionConfiguration.findMany({
                where: { questionId },
            });
            const upsertConfig = async (key, value) => {
                const existing = existingConfigs.find((c) => c.metaKey === key);
                if (existing) {
                    await this.prisma.questionConfiguration.update({
                        where: { id: existing.id },
                        data: { metaValue: String(value) },
                    });
                }
                else {
                    await this.prisma.questionConfiguration.create({
                        data: {
                            questionId,
                            metaKey: key,
                            metaValue: String(value),
                        },
                    });
                }
            };
            if (gridWidth !== undefined) {
                await upsertConfig('gridWidth', gridWidth);
            }
            if (gridHeight !== undefined) {
                await upsertConfig('gridHeight', gridHeight);
            }
            if (maxWords !== undefined) {
                await upsertConfig('maxWords', maxWords);
            }
        }
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
    calculatePointsFromSubQuestions(subQuestions) {
        return subQuestions.reduce((sum, sq) => sum + (sq.points || 0), 0);
    }
    async updateTopicBasedAudioSubquestion(id, updateData) {
        const question = await this.prisma.question.findUnique({
            where: { id },
        });
        if (!question) {
            throw new common_1.NotFoundException('Subquestion not found');
        }
        if (question.deletedAt !== null) {
            throw new common_1.BadRequestException('Cannot update a deleted question. This question was deleted and is archived for data integrity.');
        }
        if (question.type !== 'topic_based_audio_subquestion') {
            throw new common_1.BadRequestException('Question must be of type topic_based_audio_subquestion');
        }
        const finalOptions = updateData.options || question.options;
        const finalAnswer = updateData.answer || question.answer;
        if (Array.isArray(finalOptions) && !finalOptions.includes(finalAnswer)) {
            throw new common_1.BadRequestException('Answer must be one of the options');
        }
        const updatedQuestion = await this.prisma.question.update({
            where: { id },
            data: updateData,
        });
        if (question.parentQuestionId && updateData.points !== undefined) {
            await this.recalculateParentPoints(question.parentQuestionId);
        }
        return updatedQuestion;
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
                studentAnswers: true,
            },
        });
        if (!question) {
            throw new common_1.NotFoundException('Question not found');
        }
        const hasAnswers = question.studentAnswers && question.studentAnswers.length > 0;
        if (hasAnswers) {
            await this.prisma.question.update({
                where: { id: questionId },
                data: {
                    deletedAt: new Date(),
                    isActive: false,
                },
            });
            if (question.subQuestions && question.subQuestions.length > 0) {
                await this.prisma.question.updateMany({
                    where: { parentQuestionId: questionId },
                    data: {
                        deletedAt: new Date(),
                        isActive: false,
                    },
                });
            }
        }
        else {
            await this.prisma.question.delete({
                where: { id: questionId },
            });
        }
        if (question.parentQuestionId) {
            await this.recalculateParentPoints(question.parentQuestionId);
        }
    }
};
exports.QuestionUpdateService = QuestionUpdateService;
exports.QuestionUpdateService = QuestionUpdateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        question_media_service_1.QuestionMediaService])
], QuestionUpdateService);
//# sourceMappingURL=question-update.service.js.map