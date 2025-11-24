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
var QuestionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const client_1 = require("@prisma/client");
const _1 = require(".");
const helpers_1 = require("../helpers");
let QuestionsService = QuestionsService_1 = class QuestionsService {
    prisma;
    questionMediaService;
    questionFormatterService;
    logger = new common_1.Logger(QuestionsService_1.name);
    constructor(prisma, questionMediaService, questionFormatterService) {
        this.prisma = prisma;
        this.questionMediaService = questionMediaService;
        this.questionFormatterService = questionFormatterService;
    }
    async calculateNextPosition(challengeId, stage) {
        const maxPosition = await this.prisma.question.findFirst({
            where: {
                challengeId,
                stage,
                parentQuestionId: null,
                deletedAt: null,
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
    async createImageToMultipleChoices(dto) {
        await this.validateChallenge(dto.challengeId);
        const optionsLowerCase = dto.options.map((opt) => opt.toLowerCase());
        const answerLowerCase = dto.answer.toLowerCase();
        if (!optionsLowerCase.includes(answerLowerCase)) {
            throw new common_1.BadRequestException(`Answer "${dto.answer}" must be one of the options: ${dto.options.join(', ')}`);
        }
        const questionType = 'image_to_multiple_choices';
        const stage = client_1.QuestionStage.VOCABULARY;
        const position = await this.calculateNextPosition(dto.challengeId, stage);
        const uploadedFile = await this.questionMediaService.uploadSingleFile(dto.image);
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage,
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
                isActive: true,
                deletedAt: null,
            },
        });
        await this.questionMediaService.attachMediaFiles(question.id, [
            {
                id: uploadedFile.id,
                context: 'main',
                position: 0,
            },
        ]);
        return this.findOne(question.id);
    }
    async createWordbox(dto) {
        await this.validateChallenge(dto.challengeId);
        const isValid = dto.content.every((row) => row.every((cell) => typeof cell === 'string'));
        if (!isValid) {
            throw new common_1.BadRequestException('All grid cells must be strings (single letters)');
        }
        this.validateWordboxGrid(dto.content);
        const questionType = 'wordbox';
        const stage = client_1.QuestionStage.VOCABULARY;
        const position = await this.calculateNextPosition(dto.challengeId, stage);
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage,
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
        const stage = client_1.QuestionStage.VOCABULARY;
        const position = await this.calculateNextPosition(dto.challengeId, stage);
        const uploadedFile = await this.questionMediaService.uploadSingleFile(dto.image);
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage,
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
        const questionType = 'word_associations';
        const stage = client_1.QuestionStage.VOCABULARY;
        const position = await this.calculateNextPosition(dto.challengeId, stage);
        let uploadedFile = null;
        if (dto.image) {
            uploadedFile = await this.questionMediaService.uploadSingleFile(dto.image);
        }
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage,
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
        await this.attachConfigurations(question.id, [
            {
                metaKey: 'maxAssociations',
                metaValue: String(dto.maxAssociations ?? 10),
            },
        ]);
        return this.findOne(question.id);
    }
    async createUnscramble(dto) {
        await this.validateChallenge(dto.challengeId);
        if (dto.content.length !== dto.answer.length) {
            throw new common_1.BadRequestException('Content and answer must have the same number of words');
        }
        const questionType = 'unscramble';
        const stage = client_1.QuestionStage.GRAMMAR;
        const position = await this.calculateNextPosition(dto.challengeId, stage);
        let uploadedFile = null;
        if (dto.image) {
            uploadedFile = await this.questionMediaService.uploadSingleFile(dto.image);
        }
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage,
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
        if (uploadedFile) {
            await this.questionMediaService.attachMediaFiles(question.id, [
                { id: uploadedFile.id, context: 'main', position: 0 },
            ]);
        }
        return this.findOne(question.id);
    }
    async createTenses(dto) {
        await this.validateChallenge(dto.challengeId);
        if (!dto.options.includes(dto.answer)) {
            throw new common_1.BadRequestException('Answer must be one of the options');
        }
        const questionType = 'tenses';
        const stage = client_1.QuestionStage.GRAMMAR;
        const position = await this.calculateNextPosition(dto.challengeId, stage);
        let uploadedFile = null;
        if (dto.image) {
            uploadedFile = await this.questionMediaService.uploadSingleFile(dto.image);
        }
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage,
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
        if (uploadedFile) {
            await this.questionMediaService.attachMediaFiles(question.id, [
                { id: uploadedFile.id, context: 'main', position: 0 },
            ]);
        }
        return this.findOne(question.id);
    }
    async createTagIt(dto) {
        await this.validateChallenge(dto.challengeId);
        if (dto.answer.length === 0) {
            throw new common_1.BadRequestException('Must provide at least one valid answer');
        }
        const questionType = 'tag_it';
        const stage = client_1.QuestionStage.GRAMMAR;
        const position = await this.calculateNextPosition(dto.challengeId, stage);
        let uploadedFile = null;
        if (dto.image) {
            uploadedFile = await this.questionMediaService.uploadSingleFile(dto.image);
        }
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage,
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
        if (uploadedFile) {
            await this.questionMediaService.attachMediaFiles(question.id, [
                { id: uploadedFile.id, context: 'main', position: 0 },
            ]);
        }
        return this.findOne(question.id);
    }
    async createReportIt(dto) {
        await this.validateChallenge(dto.challengeId);
        if (!dto.content || dto.content.trim().length === 0) {
            throw new common_1.BadRequestException('Content must be a non-empty string');
        }
        const questionType = 'report_it';
        const stage = client_1.QuestionStage.GRAMMAR;
        const position = await this.calculateNextPosition(dto.challengeId, stage);
        let uploadedFile = null;
        if (dto.image) {
            uploadedFile = await this.questionMediaService.uploadSingleFile(dto.image);
        }
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage,
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
    async createReadIt(dto) {
        await this.validateChallenge(dto.challengeId);
        if (!dto.content || dto.content.trim().length === 0) {
            throw new common_1.BadRequestException('Content must be a non-empty string');
        }
        let parsedSubQuestions;
        try {
            parsedSubQuestions = JSON.parse(dto.subQuestions);
        }
        catch (error) {
            throw new common_1.BadRequestException('subQuestions must be a valid JSON string array');
        }
        if (!Array.isArray(parsedSubQuestions) || parsedSubQuestions.length === 0) {
            throw new common_1.BadRequestException('Must provide at least one sub-question');
        }
        parsedSubQuestions.forEach((sub, index) => {
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
        });
        if (dto.parentQuestionId) {
            const parentQuestion = await this.prisma.question.findUnique({
                where: { id: dto.parentQuestionId },
            });
            if (!parentQuestion) {
                throw new common_1.NotFoundException(`Parent question with ID ${dto.parentQuestionId} not found`);
            }
        }
        const questionType = 'read_it';
        const stage = client_1.QuestionStage.GRAMMAR;
        const position = await this.calculateNextPosition(dto.challengeId, stage);
        let uploadedFile = null;
        if (dto.image) {
            uploadedFile = await this.questionMediaService.uploadSingleFile(dto.image);
        }
        const parentId = await this.prisma.$transaction(async (tx) => {
            const totalPoints = parsedSubQuestions.reduce((sum, sub) => sum + sub.points, 0);
            const parent = await tx.question.create({
                data: {
                    challengeId: dto.challengeId,
                    stage,
                    position,
                    type: questionType,
                    points: totalPoints,
                    timeLimit: dto.timeLimit,
                    maxAttempts: dto.maxAttempts,
                    text: dto.text || (0, helpers_1.getDefaultText)(questionType),
                    instructions: dto.instructions || (0, helpers_1.getDefaultInstructions)(questionType),
                    validationMethod: (0, helpers_1.getDefaultValidationMethod)(questionType),
                    content: dto.content,
                    parentQuestionId: dto.parentQuestionId,
                },
            });
            if (uploadedFile) {
                await tx.questionMedia.create({
                    data: {
                        questionId: parent.id,
                        mediaFileId: uploadedFile.id,
                        position: 0,
                        context: 'main',
                    },
                });
            }
            await tx.question.createMany({
                data: parsedSubQuestions.map((sub, index) => ({
                    challengeId: dto.challengeId,
                    stage,
                    position: index + 1,
                    type: 'read_it_subquestion',
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
            return parent.id;
        });
        return this.findOne(parentId);
    }
    async createWordMatch(dto) {
        await this.validateChallenge(dto.challengeId);
        if (!dto.options.includes(dto.answer)) {
            throw new common_1.BadRequestException('Answer must be one of the options');
        }
        const questionType = 'word_match';
        const stage = client_1.QuestionStage.LISTENING;
        const position = await this.calculateNextPosition(dto.challengeId, stage);
        const uploadedFile = await this.questionMediaService.uploadSingleFile(dto.audio);
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage,
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
    async createGossip(dto) {
        await this.validateChallenge(dto.challengeId);
        if (!dto.answer || dto.answer.trim().length === 0) {
            throw new common_1.BadRequestException('Answer must be a non-empty string');
        }
        const questionType = 'gossip';
        const stage = client_1.QuestionStage.LISTENING;
        const position = await this.calculateNextPosition(dto.challengeId, stage);
        const uploadedFile = await this.questionMediaService.uploadSingleFile(dto.audio);
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage,
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
            if (!sub.content || typeof sub.content !== 'string') {
                throw new common_1.BadRequestException(`Sub-question ${index + 1}: content is required and must be a string`);
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
        const stage = client_1.QuestionStage.LISTENING;
        const position = await this.calculateNextPosition(dto.challengeId, stage);
        const uploadedFile = await this.questionMediaService.uploadSingleFile(dto.audio);
        const parentId = await this.prisma.$transaction(async (tx) => {
            const totalPoints = parsedSubQuestions.reduce((sum, sub) => sum + sub.points, 0);
            const parent = await tx.question.create({
                data: {
                    challengeId: dto.challengeId,
                    stage,
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
                    stage,
                    position: index + 1,
                    type: 'topic_based_audio_subquestion',
                    points: sub.points,
                    timeLimit: 0,
                    maxAttempts: 0,
                    text: 'Sub-question',
                    content: sub.content,
                    instructions: 'Select the correct option',
                    validationMethod: 'AUTO',
                    options: JSON.parse(JSON.stringify(sub.options)),
                    answer: sub.answer,
                    parentQuestionId: parent.id,
                })),
            });
            return parent.id;
        });
        return this.findOne(parentId);
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
    async createLyricsTraining(dto) {
        await this.validateChallenge(dto.challengeId);
        if (!dto.options.includes(dto.answer)) {
            throw new common_1.BadRequestException('Answer must be one of the options');
        }
        const questionType = 'lyrics_training';
        const stage = client_1.QuestionStage.LISTENING;
        const position = await this.calculateNextPosition(dto.challengeId, stage);
        const uploadedFile = await this.questionMediaService.uploadSingleFile(dto.video);
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage,
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
        const stage = client_1.QuestionStage.WRITING;
        const position = await this.calculateNextPosition(dto.challengeId, stage);
        const uploadedFiles = await Promise.all(dto.images.map((file) => this.questionMediaService.uploadSingleFile(file)));
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage,
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
        const stage = client_1.QuestionStage.WRITING;
        const position = await this.calculateNextPosition(dto.challengeId, stage);
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage,
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
        return this.findOne(question.id);
    }
    async createTales(dto) {
        await this.validateChallenge(dto.challengeId);
        const questionType = 'tales';
        const stage = client_1.QuestionStage.WRITING;
        const position = await this.calculateNextPosition(dto.challengeId, stage);
        const uploadedFiles = await Promise.all(dto.images.map((file) => this.questionMediaService.uploadSingleFile(file)));
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage,
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
        const stage = client_1.QuestionStage.SPEAKING;
        const position = await this.calculateNextPosition(dto.challengeId, stage);
        let uploadedFile = null;
        if (dto.image) {
            uploadedFile = await this.questionMediaService.uploadSingleFile(dto.image);
        }
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage,
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
        const stage = client_1.QuestionStage.SPEAKING;
        const position = await this.calculateNextPosition(dto.challengeId, stage);
        let uploadedFile = null;
        if (dto.image) {
            uploadedFile = await this.questionMediaService.uploadSingleFile(dto.image);
        }
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage,
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
        const stage = client_1.QuestionStage.SPEAKING;
        const position = await this.calculateNextPosition(dto.challengeId, stage);
        let uploadedFile = null;
        if (dto.image) {
            uploadedFile = await this.questionMediaService.uploadSingleFile(dto.image);
        }
        const question = await this.prisma.question.create({
            data: {
                challengeId: dto.challengeId,
                stage,
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
        if (uploadedFile) {
            await this.questionMediaService.attachMediaFiles(updatedQuestion.id, [
                { id: uploadedFile.id, context: 'main', position: 0 },
            ]);
        }
        return this.findOne(updatedQuestion.id);
    }
    async findAll(filters) {
        const questions = await this.prisma.question.findMany({
            where: {
                challengeId: filters?.challengeId,
                stage: filters?.stage,
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
            orderBy: [{ stage: 'asc' }, { type: 'asc' }, { position: 'asc' }],
        });
        const enrichedQuestions = questions.map((question) => this.questionMediaService.enrichQuestionWithMedia(question));
        return this.questionFormatterService.formatQuestions(enrichedQuestions);
    }
    async findByChallengeId(challengeId, filters) {
        await this.validateChallenge(challengeId);
        const where = {
            challengeId,
            parentQuestionId: null,
            deletedAt: null,
        };
        if (filters?.stage) {
            where.stage = filters.stage;
        }
        if (filters?.type && filters.type.trim() !== '') {
            where.type = filters.type;
        }
        const questions = await this.prisma.question.findMany({
            where,
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
                    orderBy: {
                        position: 'asc',
                    },
                },
                challenge: true,
            },
            orderBy: { position: 'asc' },
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
exports.QuestionsService = QuestionsService = QuestionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        _1.QuestionMediaService,
        _1.QuestionFormatterService])
], QuestionsService);
//# sourceMappingURL=questions.service.js.map