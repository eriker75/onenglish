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
const client_1 = require("@prisma/client");
const question_media_service_1 = require("./question-media.service");
const question_formatter_service_1 = require("./question-formatter.service");
let QuestionUpdateService = class QuestionUpdateService {
    prisma;
    questionMediaService;
    questionFormatterService;
    constructor(prisma, questionMediaService, questionFormatterService) {
        this.prisma = prisma;
        this.questionMediaService = questionMediaService;
        this.questionFormatterService = questionFormatterService;
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
        const { gridWidth, gridHeight, maxWords, maxAssociations, ...restData } = updateData;
        const grammarQuestionTypes = [
            'unscramble',
            'tenses',
            'read_it',
            'tag_it',
            'report_it',
        ];
        const listeningQuestionTypes = [
            'word_match',
            'gossip',
            'topic_based_audio',
            'lyrics_training',
        ];
        const writingQuestionTypes = [
            'sentence_maker',
            'fast_test',
            'tales',
        ];
        const speakingQuestionTypes = [
            'superbrain',
            'tell_me_about_it',
            'debate',
        ];
        const { media, image, audio, video, images, audios, subQuestions, challengeId, stage, ...questionData } = restData;
        if (grammarQuestionTypes.includes(question.type)) {
            questionData.stage = client_1.QuestionStage.GRAMMAR;
        }
        if (listeningQuestionTypes.includes(question.type)) {
            questionData.stage = client_1.QuestionStage.LISTENING;
        }
        if (writingQuestionTypes.includes(question.type)) {
            questionData.stage = client_1.QuestionStage.WRITING;
        }
        if (speakingQuestionTypes.includes(question.type)) {
            questionData.stage = client_1.QuestionStage.SPEAKING;
        }
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
        await this.prisma.question.update({
            where: { id: questionId },
            data: questionData,
        });
        const singleFile = media || image || audio || video;
        if (singleFile && !Array.isArray(singleFile)) {
            const uploadedFile = await this.questionMediaService.uploadSingleFile(singleFile);
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
        const multipleFiles = images || audios || (Array.isArray(media) ? media : null);
        if (multipleFiles && Array.isArray(multipleFiles)) {
            const uploadedFiles = await Promise.all(multipleFiles.map((file) => this.questionMediaService.uploadSingleFile(file)));
            await this.prisma.questionMedia.deleteMany({
                where: { questionId },
            });
            await this.questionMediaService.attachMediaFiles(questionId, uploadedFiles.map((file, index) => ({
                id: file.id,
                context: 'main',
                position: index,
            })));
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
        if (question.type === 'word_associations' && maxAssociations !== undefined) {
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
            await upsertConfig('maxAssociations', maxAssociations);
        }
        if (subQuestions !== undefined && (question.type === 'read_it' || question.type === 'topic_based_audio')) {
            let parsedSubQuestions;
            try {
                parsedSubQuestions = typeof subQuestions === 'string'
                    ? JSON.parse(subQuestions)
                    : subQuestions;
            }
            catch (error) {
                throw new common_1.BadRequestException('subQuestions must be a valid JSON string array');
            }
            if (!Array.isArray(parsedSubQuestions) || parsedSubQuestions.length === 0) {
                throw new common_1.BadRequestException('Must provide at least one sub-question');
            }
            parsedSubQuestions.forEach((sub, index) => {
                if (question.type === 'read_it') {
                    if (!sub.content || typeof sub.content !== 'string') {
                        throw new common_1.BadRequestException(`Sub-question ${index + 1}: content is required and must be a string`);
                    }
                    if (!Array.isArray(sub.options) || sub.options.length !== 2) {
                        throw new common_1.BadRequestException(`Sub-question ${index + 1}: options must be an array with exactly 2 boolean values [true, false]`);
                    }
                    if (typeof sub.options[0] !== 'boolean' ||
                        typeof sub.options[1] !== 'boolean') {
                        throw new common_1.BadRequestException(`Sub-question ${index + 1}: options must contain only boolean values`);
                    }
                    if (typeof sub.answer !== 'boolean') {
                        throw new common_1.BadRequestException(`Sub-question ${index + 1}: answer is required and must be a boolean`);
                    }
                    if (!sub.options.includes(sub.answer)) {
                        throw new common_1.BadRequestException(`Sub-question ${index + 1}: answer must match one of the provided options`);
                    }
                    if (!sub.points || typeof sub.points !== 'number') {
                        throw new common_1.BadRequestException(`Sub-question ${index + 1}: points is required and must be a number`);
                    }
                    if (sub.points < 0) {
                        throw new common_1.BadRequestException(`Sub-question ${index + 1}: points cannot be negative`);
                    }
                }
                else if (question.type === 'topic_based_audio') {
                    if (!sub.text || typeof sub.text !== 'string') {
                        throw new common_1.BadRequestException(`Sub-question ${index + 1}: text is required and must be a string`);
                    }
                    if (!sub.points || typeof sub.points !== 'number') {
                        throw new common_1.BadRequestException(`Sub-question ${index + 1}: points is required and must be a number`);
                    }
                    if (!Array.isArray(sub.options) || sub.options.length < 2) {
                        throw new common_1.BadRequestException(`Sub-question ${index + 1}: must provide at least 2 options`);
                    }
                    if (!sub.answer || typeof sub.answer !== 'string') {
                        throw new common_1.BadRequestException(`Sub-question ${index + 1}: answer is required and must be a string`);
                    }
                    if (!sub.options.includes(sub.answer)) {
                        throw new common_1.BadRequestException(`Sub-question ${index + 1}: answer must match one of the provided options`);
                    }
                }
            });
            await this.prisma.question.deleteMany({
                where: { parentQuestionId: questionId },
            });
            const subQuestionType = question.type === 'read_it'
                ? 'read_it_subquestion'
                : 'topic_based_audio_subquestion';
            await this.prisma.question.createMany({
                data: parsedSubQuestions.map((sub, index) => {
                    if (question.type === 'read_it') {
                        return {
                            challengeId: question.challengeId,
                            stage: question.stage,
                            position: index + 1,
                            type: subQuestionType,
                            points: sub.points,
                            timeLimit: 0,
                            maxAttempts: 0,
                            text: sub.content,
                            instructions: 'Select true or false',
                            validationMethod: 'AUTO',
                            content: sub.content,
                            options: JSON.parse(JSON.stringify(sub.options)),
                            answer: sub.answer,
                            parentQuestionId: questionId,
                        };
                    }
                    else {
                        return {
                            challengeId: question.challengeId,
                            stage: question.stage,
                            position: index + 1,
                            type: subQuestionType,
                            points: sub.points,
                            timeLimit: 0,
                            maxAttempts: 0,
                            text: 'Sub-question',
                            content: sub.text,
                            instructions: 'Select the correct option',
                            validationMethod: 'AUTO',
                            options: JSON.parse(JSON.stringify(sub.options)),
                            answer: sub.answer,
                            parentQuestionId: questionId,
                        };
                    }
                }),
            });
            const totalPoints = parsedSubQuestions.reduce((sum, sub) => sum + sub.points, 0);
            await this.prisma.question.update({
                where: { id: questionId },
                data: { points: totalPoints },
            });
        }
        if (question.parentQuestionId && updateData.points !== undefined) {
            await this.recalculateParentPoints(question.parentQuestionId);
        }
        const questionWithRelations = await this.prisma.question.findUnique({
            where: { id: questionId },
            include: {
                questionMedia: {
                    include: {
                        mediaFile: true,
                    },
                    orderBy: {
                        position: 'asc',
                    },
                },
                configurations: true,
                subQuestions: {
                    include: {
                        questionMedia: {
                            include: {
                                mediaFile: true,
                            },
                        },
                        configurations: true,
                    },
                },
                challenge: true,
                parentQuestion: true,
            },
        });
        if (!questionWithRelations) {
            throw new common_1.NotFoundException('Question not found after update');
        }
        const enrichedQuestion = this.questionMediaService.enrichQuestionWithMedia(questionWithRelations);
        const formattedQuestion = this.questionFormatterService.formatQuestion(enrichedQuestion);
        if (!formattedQuestion) {
            throw new common_1.BadRequestException('Failed to format question. Invalid question type or data.');
        }
        return formattedQuestion;
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
        question_media_service_1.QuestionMediaService,
        question_formatter_service_1.QuestionFormatterService])
], QuestionUpdateService);
//# sourceMappingURL=question-update.service.js.map