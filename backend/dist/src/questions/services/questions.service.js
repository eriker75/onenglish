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
exports.QuestionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const _1 = require(".");
const helpers_1 = require("../helpers");
let QuestionsService = class QuestionsService {
    prisma;
    questionMediaService;
    questionFormatterService;
    constructor(prisma, questionMediaService, questionFormatterService) {
        this.prisma = prisma;
        this.questionMediaService = questionMediaService;
        this.questionFormatterService = questionFormatterService;
    }
    async calculateNextPosition(challengeId, stage, phase) {
        const maxPosition = await this.prisma.question.findFirst({
            where: {
                challengeId,
                stage,
                phase,
            },
            orderBy: {
                position: 'desc',
            },
            select: {
                position: true,
            },
        });
        return maxPosition ? maxPosition.position + 1 : 1;
    }
    async attachConfigurations(questionId, configurations) {
        if (!configurations?.length)
            return;
        await this.prisma.questionConfiguration.createMany({
            data: configurations.map((config) => ({
                questionId,
                ...config,
            })),
        });
    }
    async createImageToMultipleChoices(dto) {
        await this.validateChallenge(dto.challengeId);
        if (!dto.options.includes(dto.answer)) {
            throw new common_1.BadRequestException('Answer must be one of the options');
        }
        const questionType = 'image_to_multiple_choices';
        const position = await this.calculateNextPosition(dto.challengeId, dto.stage, dto.phase);
        const mediaFiles = Array.isArray(dto.media) ? dto.media : [dto.media];
        const uploadedFiles = await Promise.all(mediaFiles.map((file) => this.questionMediaService.uploadSingleFile(file)));
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage: dto.stage,
                phase: dto.phase,
                position,
                type: questionType,
                points: dto.points,
                timeLimit: dto.timeLimit,
                maxAttempts: dto.maxAttempts,
                text: dto.text || (0, helpers_1.getDefaultText)(questionType),
                instructions: dto.instructions || (0, helpers_1.getDefaultInstructions)(questionType),
                validationMethod: (0, helpers_1.getDefaultValidationMethod)(questionType),
                options: dto.options,
                answer: dto.answer,
            },
        });
        await this.questionMediaService.attachMediaFiles(question.id, uploadedFiles.map((file, index) => ({
            id: file.id,
            context: 'main',
            position: index,
        })));
        return this.findOne(question.id);
    }
    async createWordbox(dto) {
        await this.validateChallenge(dto.challengeId);
        const isValid = dto.content.every((row) => row.every((cell) => typeof cell === 'string'));
        if (!isValid) {
            throw new common_1.BadRequestException('All grid cells must be strings (single letters)');
        }
        const questionType = 'wordbox';
        const position = await this.calculateNextPosition(dto.challengeId, dto.stage, dto.phase);
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage: dto.stage,
                phase: dto.phase,
                position,
                type: questionType,
                points: dto.points,
                timeLimit: dto.timeLimit,
                maxAttempts: dto.maxAttempts,
                text: dto.text || (0, helpers_1.getDefaultText)(questionType),
                instructions: dto.instructions || (0, helpers_1.getDefaultInstructions)(questionType),
                validationMethod: (0, helpers_1.getDefaultValidationMethod)(questionType),
                content: dto.content,
            },
        });
        const configs = [
            { metaKey: 'gridWidth', metaValue: String(dto.gridWidth) },
            { metaKey: 'gridHeight', metaValue: String(dto.gridHeight) },
            { metaKey: 'maxWords', metaValue: String(dto.maxWords ?? 5) },
        ];
        await this.attachConfigurations(question.id, configs);
        return this.findOne(question.id);
    }
    async createSpelling(dto) {
        await this.validateChallenge(dto.challengeId);
        if (!dto.answer || dto.answer.trim().length === 0) {
            throw new common_1.BadRequestException('Answer must be a non-empty string');
        }
        const questionType = 'spelling';
        const position = await this.calculateNextPosition(dto.challengeId, dto.stage, dto.phase);
        const uploadedFile = await this.questionMediaService.uploadSingleFile(dto.media);
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage: dto.stage,
                phase: dto.phase,
                position,
                type: questionType,
                points: dto.points,
                timeLimit: dto.timeLimit,
                maxAttempts: dto.maxAttempts,
                text: dto.text || (0, helpers_1.getDefaultText)(questionType),
                instructions: dto.instructions || (0, helpers_1.getDefaultInstructions)(questionType),
                validationMethod: (0, helpers_1.getDefaultValidationMethod)(questionType),
                answer: dto.answer,
            },
        });
        await this.questionMediaService.attachMediaFiles(question.id, [
            { id: uploadedFile.id, context: 'main', position: 0 },
        ]);
        return this.findOne(question.id);
    }
    async createWordAssociations(dto) {
        await this.validateChallenge(dto.challengeId);
        if (!dto.content || dto.content.trim().length === 0) {
            throw new common_1.BadRequestException('Content must be a non-empty string');
        }
        if (!dto.configuration || !dto.configuration.totalAssociations) {
            throw new common_1.BadRequestException('Configuration must include totalAssociations');
        }
        const questionType = 'word_associations';
        const position = await this.calculateNextPosition(dto.challengeId, dto.stage, dto.phase);
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage: dto.stage,
                phase: dto.phase,
                position,
                type: questionType,
                points: dto.points,
                timeLimit: dto.timeLimit,
                maxAttempts: dto.maxAttempts,
                text: dto.text || (0, helpers_1.getDefaultText)(questionType),
                instructions: dto.instructions || (0, helpers_1.getDefaultInstructions)(questionType),
                validationMethod: (0, helpers_1.getDefaultValidationMethod)(questionType),
                content: dto.content,
            },
        });
        const configs = Object.entries(dto.configuration).map(([key, value]) => ({
            metaKey: key,
            metaValue: String(value),
        }));
        await this.attachConfigurations(question.id, configs);
        return this.findOne(question.id);
    }
    async createUnscramble(dto) {
        await this.validateChallenge(dto.challengeId);
        if (dto.content.length !== dto.answer.length) {
            throw new common_1.BadRequestException('Content and answer must have the same number of words');
        }
        const questionType = 'unscramble';
        const position = await this.calculateNextPosition(dto.challengeId, dto.stage, dto.phase);
        return this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage: dto.stage,
                phase: dto.phase,
                position,
                type: questionType,
                points: dto.points,
                timeLimit: dto.timeLimit,
                maxAttempts: dto.maxAttempts,
                text: dto.text || (0, helpers_1.getDefaultText)(questionType),
                instructions: dto.instructions || (0, helpers_1.getDefaultInstructions)(questionType),
                validationMethod: (0, helpers_1.getDefaultValidationMethod)(questionType),
                content: dto.content,
                answer: dto.answer,
            },
        });
    }
    async createTenses(dto) {
        await this.validateChallenge(dto.challengeId);
        if (!dto.options.includes(dto.answer)) {
            throw new common_1.BadRequestException('Answer must be one of the options');
        }
        const questionType = 'tenses';
        const position = await this.calculateNextPosition(dto.challengeId, dto.stage, dto.phase);
        return this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage: dto.stage,
                phase: dto.phase,
                position,
                type: questionType,
                points: dto.points,
                timeLimit: dto.timeLimit,
                maxAttempts: dto.maxAttempts,
                text: dto.text || (0, helpers_1.getDefaultText)(questionType),
                instructions: dto.instructions || (0, helpers_1.getDefaultInstructions)(questionType),
                validationMethod: (0, helpers_1.getDefaultValidationMethod)(questionType),
                content: dto.content,
                options: dto.options,
                answer: dto.answer,
            },
        });
    }
    async createTagIt(dto) {
        await this.validateChallenge(dto.challengeId);
        if (dto.answer.length === 0) {
            throw new common_1.BadRequestException('Must provide at least one valid answer');
        }
        const questionType = 'tag_it';
        const position = await this.calculateNextPosition(dto.challengeId, dto.stage, dto.phase);
        return this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage: dto.stage,
                phase: dto.phase,
                position,
                type: questionType,
                points: dto.points,
                timeLimit: dto.timeLimit,
                maxAttempts: dto.maxAttempts,
                text: dto.text || (0, helpers_1.getDefaultText)(questionType),
                instructions: dto.instructions || (0, helpers_1.getDefaultInstructions)(questionType),
                validationMethod: (0, helpers_1.getDefaultValidationMethod)(questionType),
                content: dto.content,
                answer: dto.answer,
            },
        });
    }
    async createReportIt(dto) {
        await this.validateChallenge(dto.challengeId);
        if (!dto.content || dto.content.trim().length === 0) {
            throw new common_1.BadRequestException('Content must be a non-empty string');
        }
        const questionType = 'report_it';
        const position = await this.calculateNextPosition(dto.challengeId, dto.stage, dto.phase);
        return this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage: dto.stage,
                phase: dto.phase,
                position,
                type: questionType,
                points: dto.points,
                timeLimit: dto.timeLimit,
                maxAttempts: dto.maxAttempts,
                text: dto.text || (0, helpers_1.getDefaultText)(questionType),
                instructions: dto.instructions || (0, helpers_1.getDefaultInstructions)(questionType),
                validationMethod: (0, helpers_1.getDefaultValidationMethod)(questionType),
                content: dto.content,
            },
        });
    }
    async createReadIt(dto) {
        await this.validateChallenge(dto.challengeId);
        if (!Array.isArray(dto.content) || dto.content.length === 0) {
            throw new common_1.BadRequestException('Content must be a non-empty array of passages');
        }
        if (!Array.isArray(dto.subQuestions) || dto.subQuestions.length === 0) {
            throw new common_1.BadRequestException('Must provide at least one sub-question');
        }
        if (dto.parentQuestionId) {
            const parentQuestion = await this.prisma.question.findUnique({
                where: { id: dto.parentQuestionId },
            });
            if (!parentQuestion) {
                throw new common_1.NotFoundException(`Parent question with ID ${dto.parentQuestionId} not found`);
            }
        }
        const questionType = 'read_it';
        const position = await this.calculateNextPosition(dto.challengeId, dto.stage, dto.phase);
        return this.prisma.$transaction(async (tx) => {
            const totalPoints = dto.subQuestions.reduce((sum, sub) => sum + sub.points, 0);
            const parent = await tx.question.create({
                data: {
                    challengeId: dto.challengeId,
                    stage: dto.stage,
                    phase: dto.phase,
                    position,
                    type: questionType,
                    points: totalPoints,
                    timeLimit: dto.timeLimit,
                    maxAttempts: dto.maxAttempts,
                    text: dto.text || (0, helpers_1.getDefaultText)(questionType),
                    instructions: dto.instructions || (0, helpers_1.getDefaultInstructions)(questionType),
                    validationMethod: (0, helpers_1.getDefaultValidationMethod)(questionType),
                    content: JSON.parse(JSON.stringify(dto.content)),
                    parentQuestionId: dto.parentQuestionId,
                },
            });
            await tx.question.createMany({
                data: dto.subQuestions.map((sub, index) => ({
                    challengeId: dto.challengeId,
                    stage: dto.stage,
                    phase: dto.phase,
                    position: index + 1,
                    type: 'true_false',
                    points: sub.points,
                    timeLimit: 0,
                    maxAttempts: 0,
                    text: sub.content,
                    instructions: 'Select true or false',
                    validationMethod: 'AUTO',
                    content: sub.content,
                    options: JSON.parse(JSON.stringify(sub.options)),
                    answer: sub.answer,
                    parentQuestionId: parent.id,
                })),
            });
            return tx.question.findUnique({
                where: { id: parent.id },
                include: { subQuestions: true },
            });
        });
    }
    async createWordMatch(dto) {
        await this.validateChallenge(dto.challengeId);
        if (!dto.options.includes(dto.answer)) {
            throw new common_1.BadRequestException('Answer must be one of the options');
        }
        const questionType = 'word_match';
        const position = await this.calculateNextPosition(dto.challengeId, dto.stage, dto.phase);
        const uploadedFiles = await Promise.all(dto.media.map((file) => this.questionMediaService.uploadSingleFile(file)));
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage: dto.stage,
                phase: dto.phase,
                position,
                type: questionType,
                points: dto.points,
                timeLimit: dto.timeLimit,
                maxAttempts: dto.maxAttempts,
                text: dto.text || (0, helpers_1.getDefaultText)(questionType),
                instructions: dto.instructions || (0, helpers_1.getDefaultInstructions)(questionType),
                validationMethod: (0, helpers_1.getDefaultValidationMethod)(questionType),
                options: dto.options,
                answer: dto.answer,
            },
        });
        await this.questionMediaService.attachMediaFiles(question.id, uploadedFiles.map((file, index) => ({
            id: file.id,
            position: index,
            context: 'main',
        })));
        return this.findOne(question.id);
    }
    async createGossip(dto) {
        await this.validateChallenge(dto.challengeId);
        if (!dto.answer || dto.answer.trim().length === 0) {
            throw new common_1.BadRequestException('Answer must be a non-empty string');
        }
        const questionType = 'gossip';
        const position = await this.calculateNextPosition(dto.challengeId, dto.stage, dto.phase);
        const uploadedFile = await this.questionMediaService.uploadSingleFile(dto.media);
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage: dto.stage,
                phase: dto.phase,
                position,
                type: questionType,
                points: dto.points,
                timeLimit: dto.timeLimit,
                maxAttempts: dto.maxAttempts,
                text: dto.text || (0, helpers_1.getDefaultText)(questionType),
                instructions: dto.instructions || (0, helpers_1.getDefaultInstructions)(questionType),
                validationMethod: (0, helpers_1.getDefaultValidationMethod)(questionType),
                answer: dto.answer,
            },
        });
        await this.questionMediaService.attachMediaFiles(question.id, [
            { id: uploadedFile.id, context: 'main', position: 0 },
        ]);
        return this.findOne(question.id);
    }
    async createTopicBasedAudio(dto) {
        await this.validateChallenge(dto.challengeId);
        let parsedSubQuestions;
        try {
            parsedSubQuestions = JSON.parse(dto.subQuestions);
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException('subQuestions must be a valid JSON string array');
        }
        if (!Array.isArray(parsedSubQuestions) || parsedSubQuestions.length === 0) {
            throw new common_1.BadRequestException('Must provide at least one sub-question');
        }
        parsedSubQuestions.forEach((sub, index) => {
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
        });
        if (dto.parentQuestionId) {
            const parentQuestion = await this.prisma.question.findUnique({
                where: { id: dto.parentQuestionId },
            });
            if (!parentQuestion) {
                throw new common_1.NotFoundException(`Parent question with ID ${dto.parentQuestionId} not found`);
            }
        }
        const questionType = 'topic_based_audio';
        const position = await this.calculateNextPosition(dto.challengeId, dto.stage, dto.phase);
        const uploadedFile = await this.questionMediaService.uploadSingleFile(dto.media);
        return this.prisma.$transaction(async (tx) => {
            const totalPoints = parsedSubQuestions.reduce((sum, sub) => sum + sub.points, 0);
            const parent = await tx.question.create({
                data: {
                    challengeId: dto.challengeId,
                    stage: dto.stage,
                    phase: dto.phase,
                    position,
                    type: questionType,
                    points: totalPoints,
                    timeLimit: dto.timeLimit,
                    maxAttempts: dto.maxAttempts,
                    text: dto.text || (0, helpers_1.getDefaultText)(questionType),
                    instructions: dto.instructions || (0, helpers_1.getDefaultInstructions)(questionType),
                    validationMethod: (0, helpers_1.getDefaultValidationMethod)(questionType),
                    parentQuestionId: dto.parentQuestionId,
                },
            });
            await tx.questionMedia.create({
                data: {
                    questionId: parent.id,
                    mediaFileId: uploadedFile.id,
                    position: 0,
                    context: 'main',
                },
            });
            await tx.question.createMany({
                data: parsedSubQuestions.map((sub, index) => ({
                    challengeId: dto.challengeId,
                    stage: dto.stage,
                    phase: dto.phase,
                    position: index + 1,
                    type: 'topic_based_audio_subquestion',
                    points: sub.points,
                    timeLimit: 0,
                    maxAttempts: 0,
                    text: 'Sub-question',
                    content: sub.text,
                    instructions: 'Select the correct option',
                    validationMethod: 'AUTO',
                    options: JSON.parse(JSON.stringify(sub.options)),
                    answer: sub.answer,
                    parentQuestionId: parent.id,
                })),
            });
            return tx.question.findUnique({
                where: { id: parent.id },
                include: { subQuestions: true },
            });
        });
    }
    async createTopicBasedAudioSubquestion(dto) {
        await this.validateChallenge(dto.challengeId);
        const parentQuestion = await this.prisma.question.findUnique({
            where: { id: dto.parentQuestionId },
        });
        if (!parentQuestion) {
            throw new common_1.NotFoundException(`Parent question with ID ${dto.parentQuestionId} not found`);
        }
        if (parentQuestion.type !== 'topic_based_audio') {
            throw new common_1.BadRequestException('Parent question must be of type topic_based_audio');
        }
        if (!dto.options.includes(dto.answer)) {
            throw new common_1.BadRequestException('Answer must be one of the options');
        }
        const questionType = 'topic_based_audio_subquestion';
        const lastSubQuestion = await this.prisma.question.findFirst({
            where: {
                parentQuestionId: dto.parentQuestionId,
            },
            orderBy: { position: 'desc' },
        });
        const position = lastSubQuestion ? lastSubQuestion.position + 1 : 1;
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage: dto.stage,
                phase: dto.phase,
                position,
                type: questionType,
                points: dto.points,
                timeLimit: dto.timeLimit || 0,
                maxAttempts: dto.maxAttempts || 0,
                text: dto.text || 'Sub-question',
                content: dto.content,
                instructions: dto.instructions || 'Select the correct option',
                validationMethod: (0, helpers_1.getDefaultValidationMethod)(questionType),
                options: dto.options,
                answer: dto.answer,
                parentQuestionId: dto.parentQuestionId,
            },
        });
        await this.recalculateParentPoints(dto.parentQuestionId);
        return this.findOne(question.id);
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
    async updateTopicBasedAudioSubquestion(id, dto) {
        const existingQuestion = await this.prisma.question.findUnique({
            where: { id },
        });
        if (!existingQuestion) {
            throw new common_1.NotFoundException(`Question with ID ${id} not found`);
        }
        if (existingQuestion.type !== 'topic_based_audio_subquestion') {
            throw new common_1.BadRequestException('Question must be of type topic_based_audio_subquestion');
        }
        const finalOptions = dto.options || existingQuestion.options;
        const finalAnswer = dto.answer || existingQuestion.answer;
        if (Array.isArray(finalOptions) && !finalOptions.includes(finalAnswer)) {
            throw new common_1.BadRequestException('Answer must be one of the options');
        }
        const updateData = {};
        if (dto.content !== undefined)
            updateData.content = dto.content;
        if (dto.points !== undefined)
            updateData.points = dto.points;
        if (dto.options !== undefined)
            updateData.options = dto.options;
        if (dto.answer !== undefined)
            updateData.answer = dto.answer;
        if (dto.text !== undefined)
            updateData.text = dto.text;
        if (dto.instructions !== undefined)
            updateData.instructions = dto.instructions;
        await this.prisma.question.update({
            where: { id },
            data: updateData,
        });
        if (existingQuestion.parentQuestionId && dto.points !== undefined) {
            await this.recalculateParentPoints(existingQuestion.parentQuestionId);
        }
        return this.findOne(id);
    }
    async createLyricsTraining(dto) {
        await this.validateChallenge(dto.challengeId);
        if (!dto.options.includes(dto.answer)) {
            throw new common_1.BadRequestException('Answer must be one of the options');
        }
        const questionType = 'lyrics_training';
        const position = await this.calculateNextPosition(dto.challengeId, dto.stage, dto.phase);
        const uploadedFile = await this.questionMediaService.uploadSingleFile(dto.media);
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage: dto.stage,
                phase: dto.phase,
                position,
                type: questionType,
                points: dto.points,
                timeLimit: dto.timeLimit,
                maxAttempts: dto.maxAttempts,
                text: dto.text || (0, helpers_1.getDefaultText)(questionType),
                instructions: dto.instructions || (0, helpers_1.getDefaultInstructions)(questionType),
                validationMethod: (0, helpers_1.getDefaultValidationMethod)(questionType),
                options: dto.options,
                answer: dto.answer,
            },
        });
        await this.questionMediaService.attachMediaFiles(question.id, [
            { id: uploadedFile.id, context: 'main', position: 0 },
        ]);
        return this.findOne(question.id);
    }
    async createSentenceMaker(dto) {
        await this.validateChallenge(dto.challengeId);
        const questionType = 'sentence_maker';
        const position = await this.calculateNextPosition(dto.challengeId, dto.stage, dto.phase);
        const uploadedFiles = await Promise.all(dto.media.map((file) => this.questionMediaService.uploadSingleFile(file)));
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage: dto.stage,
                phase: dto.phase,
                position,
                type: questionType,
                points: dto.points,
                timeLimit: dto.timeLimit,
                maxAttempts: dto.maxAttempts,
                text: dto.text || (0, helpers_1.getDefaultText)(questionType),
                instructions: dto.instructions || (0, helpers_1.getDefaultInstructions)(questionType),
                validationMethod: (0, helpers_1.getDefaultValidationMethod)(questionType),
            },
        });
        await this.questionMediaService.attachMediaFiles(question.id, uploadedFiles.map((file, index) => ({
            id: file.id,
            position: index,
            context: 'main',
        })));
        return this.findOne(question.id);
    }
    async createFastTest(dto) {
        await this.validateChallenge(dto.challengeId);
        if (!dto.options.includes(dto.answer)) {
            throw new common_1.BadRequestException('Answer must be one of the options');
        }
        const questionType = 'fast_test';
        const position = await this.calculateNextPosition(dto.challengeId, dto.stage, dto.phase);
        return this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage: dto.stage,
                phase: dto.phase,
                position,
                type: questionType,
                points: dto.points,
                timeLimit: dto.timeLimit,
                maxAttempts: dto.maxAttempts,
                text: dto.text || (0, helpers_1.getDefaultText)(questionType),
                instructions: dto.instructions || (0, helpers_1.getDefaultInstructions)(questionType),
                validationMethod: (0, helpers_1.getDefaultValidationMethod)(questionType),
                content: JSON.parse(JSON.stringify(dto.content)),
                options: JSON.parse(JSON.stringify(dto.options)),
                answer: dto.answer,
            },
        });
    }
    async createTales(dto) {
        await this.validateChallenge(dto.challengeId);
        const questionType = 'tales';
        const position = await this.calculateNextPosition(dto.challengeId, dto.stage, dto.phase);
        const uploadedFiles = await Promise.all(dto.media.map((file) => this.questionMediaService.uploadSingleFile(file)));
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage: dto.stage,
                phase: dto.phase,
                position,
                type: questionType,
                points: dto.points,
                timeLimit: dto.timeLimit,
                maxAttempts: dto.maxAttempts,
                text: dto.text || (0, helpers_1.getDefaultText)(questionType),
                instructions: dto.instructions || (0, helpers_1.getDefaultInstructions)(questionType),
                validationMethod: (0, helpers_1.getDefaultValidationMethod)(questionType),
            },
        });
        await this.questionMediaService.attachMediaFiles(question.id, uploadedFiles.map((file, index) => ({
            id: file.id,
            position: index,
            context: 'main',
        })));
        return this.findOne(question.id);
    }
    async createSuperbrain(dto) {
        await this.validateChallenge(dto.challengeId);
        if (!dto.content || dto.content.trim().length === 0) {
            throw new common_1.BadRequestException('Content must be a non-empty string');
        }
        const questionType = 'superbrain';
        const position = await this.calculateNextPosition(dto.challengeId, dto.stage, dto.phase);
        let uploadedFile = null;
        if (dto.media) {
            uploadedFile = await this.questionMediaService.uploadSingleFile(dto.media);
        }
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage: dto.stage,
                phase: dto.phase,
                position,
                type: questionType,
                points: dto.points,
                timeLimit: dto.timeLimit,
                maxAttempts: dto.maxAttempts,
                text: dto.text || (0, helpers_1.getDefaultText)(questionType),
                instructions: dto.instructions || (0, helpers_1.getDefaultInstructions)(questionType),
                validationMethod: (0, helpers_1.getDefaultValidationMethod)(questionType),
                content: dto.content,
            },
        });
        if (uploadedFile) {
            await this.questionMediaService.attachMediaFiles(question.id, [
                { id: uploadedFile.id, context: 'main', position: 0 },
            ]);
        }
        return this.findOne(question.id);
    }
    async createTellMeAboutIt(dto) {
        await this.validateChallenge(dto.challengeId);
        if (!dto.content || dto.content.trim().length === 0) {
            throw new common_1.BadRequestException('Content must be a non-empty string');
        }
        const questionType = 'tell_me_about_it';
        const position = await this.calculateNextPosition(dto.challengeId, dto.stage, dto.phase);
        let uploadedFile = null;
        if (dto.media) {
            uploadedFile = await this.questionMediaService.uploadSingleFile(dto.media);
        }
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage: dto.stage,
                phase: dto.phase,
                position,
                type: questionType,
                points: dto.points,
                timeLimit: dto.timeLimit,
                maxAttempts: dto.maxAttempts,
                text: dto.text || (0, helpers_1.getDefaultText)(questionType),
                instructions: dto.instructions || (0, helpers_1.getDefaultInstructions)(questionType),
                validationMethod: (0, helpers_1.getDefaultValidationMethod)(questionType),
                content: dto.content,
            },
        });
        if (uploadedFile) {
            await this.questionMediaService.attachMediaFiles(question.id, [
                { id: uploadedFile.id, context: 'main', position: 0 },
            ]);
        }
        return this.findOne(question.id);
    }
    async createDebate(dto) {
        await this.validateChallenge(dto.challengeId);
        if (!dto.content || dto.content.trim().length === 0) {
            throw new common_1.BadRequestException('Content must be a non-empty string');
        }
        const questionType = 'debate';
        const position = await this.calculateNextPosition(dto.challengeId, dto.stage, dto.phase);
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage: dto.stage,
                phase: dto.phase,
                position,
                type: questionType,
                points: dto.points,
                timeLimit: dto.timeLimit,
                maxAttempts: dto.maxAttempts,
                text: dto.text || (0, helpers_1.getDefaultText)(questionType),
                instructions: dto.instructions || (0, helpers_1.getDefaultInstructions)(questionType),
                validationMethod: (0, helpers_1.getDefaultValidationMethod)(questionType),
                content: dto.content,
            },
        });
        const updatedQuestion = await this.prisma.question.update({
            where: { id: question.id },
            data: {
                answer: dto.stance,
            },
        });
        await this.attachConfigurations(updatedQuestion.id, [
            {
                metaKey: 'minDuration',
                metaValue: '90',
            },
        ]);
        return this.findOne(updatedQuestion.id);
    }
    async findAll(filters) {
        const questions = await this.prisma.question.findMany({
            where: {
                challengeId: filters?.challengeId,
                stage: filters?.stage,
                phase: filters?.phase,
                parentQuestionId: null,
            },
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
            },
            orderBy: [{ stage: 'asc' }, { phase: 'asc' }, { position: 'asc' }],
        });
        const enrichedQuestions = questions.map((question) => this.questionMediaService.enrichQuestionWithMedia(question));
        return this.questionFormatterService.formatQuestions(enrichedQuestions);
    }
    async findOne(id) {
        const question = await this.prisma.question.findUnique({
            where: { id },
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
        if (!question) {
            throw new common_1.NotFoundException(`Question with ID ${id} not found`);
        }
        const enrichedQuestion = this.questionMediaService.enrichQuestionWithMedia(question);
        return this.questionFormatterService.formatQuestion(enrichedQuestion);
    }
    async getSchoolStats(schoolId, questionId) {
        const school = await this.prisma.school.findUnique({
            where: { id: schoolId },
        });
        if (!school) {
            throw new common_1.NotFoundException(`School with ID ${schoolId} not found`);
        }
        const whereCondition = {
            isActive: true,
            deletedAt: null,
            studentAnswers: {
                some: {
                    student: {
                        schoolId: schoolId,
                    },
                },
            },
        };
        if (questionId) {
            whereCondition.id = questionId;
        }
        const questions = await this.prisma.question.findMany({
            where: whereCondition,
            include: {
                studentAnswers: {
                    where: {
                        student: {
                            schoolId: schoolId,
                        },
                    },
                    select: {
                        id: true,
                        isCorrect: true,
                        timeSpent: true,
                    },
                },
            },
        });
        return questions
            .map((question) => {
            const totalAttempts = question.studentAnswers.length;
            const correctAnswers = question.studentAnswers.filter((sa) => sa.isCorrect).length;
            const averageTime = totalAttempts > 0
                ? Math.round(question.studentAnswers.reduce((sum, sa) => sum + (sa.timeSpent || 0), 0) / totalAttempts)
                : 0;
            const successRate = totalAttempts > 0
                ? parseFloat(((correctAnswers / totalAttempts) * 100).toFixed(2))
                : 0;
            return {
                questionId: question.id,
                questionText: question.text,
                questionType: question.type,
                totalAttempts,
                correctAnswers,
                averageTime,
                successRate,
            };
        })
            .sort((a, b) => b.totalAttempts - a.totalAttempts);
    }
    async validateChallenge(challengeId) {
        const challenge = await this.prisma.challenge.findUnique({
            where: { id: challengeId },
        });
        if (!challenge) {
            throw new common_1.BadRequestException(`Challenge with ID ${challengeId} not found`);
        }
    }
};
exports.QuestionsService = QuestionsService;
exports.QuestionsService = QuestionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        _1.QuestionMediaService,
        _1.QuestionFormatterService])
], QuestionsService);
//# sourceMappingURL=questions.service.js.map