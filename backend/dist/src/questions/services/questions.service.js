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
const client_1 = require("@prisma/client");
const _1 = require(".");
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
    getDefaultValidationMethod(questionType) {
        const defaultValidationMethods = {
            image_to_multiple_choices: client_1.ValidationMethod.AUTO,
            wordbox: client_1.ValidationMethod.IA,
            spelling: client_1.ValidationMethod.IA,
            word_associations: client_1.ValidationMethod.IA,
            unscramble: client_1.ValidationMethod.AUTO,
            tenses: client_1.ValidationMethod.AUTO,
            tag_it: client_1.ValidationMethod.AUTO,
            report_it: client_1.ValidationMethod.IA,
            read_it: client_1.ValidationMethod.AUTO,
            word_match: client_1.ValidationMethod.AUTO,
            gossip: client_1.ValidationMethod.IA,
            topic_based_audio: client_1.ValidationMethod.AUTO,
            lyrics_training: client_1.ValidationMethod.AUTO,
            sentence_maker: client_1.ValidationMethod.IA,
            fast_test: client_1.ValidationMethod.AUTO,
            tales: client_1.ValidationMethod.IA,
            superbrain: client_1.ValidationMethod.IA,
            tell_me_about_it: client_1.ValidationMethod.IA,
            debate: client_1.ValidationMethod.IA,
        };
        return defaultValidationMethods[questionType] || client_1.ValidationMethod.AUTO;
    }
    getDefaultText(questionType) {
        const defaultTexts = {
            image_to_multiple_choices: 'What is shown in the image?',
            wordbox: 'Form as many valid English words as you can using the letters in the grid.',
            spelling: 'Spell the word shown in the image letter by letter.',
            word_associations: 'Write words related to the given topic.',
            unscramble: 'Put the words in the correct order to form a sentence.',
            tenses: 'Identify the verb tense used in the sentence.',
            tag_it: 'Select all the words that belong to the indicated category.',
            report_it: 'Convert the direct speech into reported speech.',
            read_it: 'Read the text and answer the questions below.',
            word_match: 'Match each word with its corresponding audio pronunciation.',
            gossip: 'Listen to the audio and repeat what you heard.',
            topic_based_audio: 'Listen to the audio and answer the questions below.',
            lyrics_training: 'Listen to the song and fill in the missing words.',
            sentence_maker: 'Create a sentence describing the images shown.',
            fast_test: 'Complete the sentence with the correct word.',
            tales: 'Write a creative story based on the images provided.',
            superbrain: 'Answer the question with a complete spoken response.',
            tell_me_about_it: 'Tell a story about what you see in the images.',
            debate: 'Present your argument for or against the given statement.',
        };
        return defaultTexts[questionType] || 'Complete the question.';
    }
    getDefaultInstructions(questionType) {
        const defaultInstructions = {
            image_to_multiple_choices: 'Select the correct option that matches the image.',
            wordbox: 'Use the letters in the grid to form valid English words. You can move horizontally or vertically.',
            spelling: 'Say each letter clearly, one by one (e.g., C-A-T).',
            word_associations: 'Think of words that are related or associated with the given topic.',
            unscramble: 'Arrange the words to create a grammatically correct sentence.',
            tenses: 'Choose the tense that best describes the verb usage in the sentence.',
            tag_it: 'Select all words that fit the specified grammatical category.',
            report_it: 'Rewrite the sentence converting direct speech to reported speech.',
            read_it: 'Read carefully and determine if each statement is true or false.',
            word_match: 'Listen to each audio clip and match it with the correct word.',
            gossip: 'Listen carefully and repeat exactly what you heard.',
            topic_based_audio: 'Listen to the audio and answer each question based on what you heard.',
            lyrics_training: 'Listen to the song and type the missing words.',
            sentence_maker: 'Write a complete sentence that describes what you see in the images.',
            fast_test: 'Fill in the blank with the appropriate word.',
            tales: 'Use your creativity to write a story inspired by the images.',
            superbrain: 'Speak clearly and provide a complete answer to the question.',
            tell_me_about_it: 'Look at the images and tell a story about what you see.',
            debate: 'Present a clear argument with reasons supporting your position.',
        };
        return (defaultInstructions[questionType] || 'Follow the instructions carefully.');
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
                text: dto.text || this.getDefaultText(questionType),
                instructions: dto.instructions || this.getDefaultInstructions(questionType),
                validationMethod: this.getDefaultValidationMethod(questionType),
                options: dto.options,
                answer: dto.answer,
            },
        });
        await this.questionMediaService.attachMediaFiles(question.id, [
            { id: uploadedFile.id, context: 'main', position: 0 },
        ]);
        return this.findOne(question.id);
    }
    async createWordbox(dto) {
        await this.validateChallenge(dto.challengeId);
        if (!Array.isArray(dto.content) || dto.content.length === 0) {
            throw new common_1.BadRequestException('Content must be a non-empty 2D array');
        }
        const rowLength = dto.content[0].length;
        const isValid = dto.content.every((row) => Array.isArray(row) &&
            row.length === rowLength &&
            row.every((cell) => typeof cell === 'string'));
        if (!isValid) {
            throw new common_1.BadRequestException('Content must be a valid 2D array of strings with consistent row length');
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
                text: dto.text || this.getDefaultText(questionType),
                instructions: dto.instructions || this.getDefaultInstructions(questionType),
                validationMethod: this.getDefaultValidationMethod(questionType),
                content: dto.content,
            },
        });
        if (dto.configuration) {
            const configs = Object.entries(dto.configuration).map(([key, value]) => ({
                metaKey: key,
                metaValue: String(value),
            }));
            await this.attachConfigurations(question.id, configs);
        }
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
                text: dto.text || this.getDefaultText(questionType),
                instructions: dto.instructions || this.getDefaultInstructions(questionType),
                validationMethod: this.getDefaultValidationMethod(questionType),
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
                text: dto.text || this.getDefaultText(questionType),
                instructions: dto.instructions || this.getDefaultInstructions(questionType),
                validationMethod: this.getDefaultValidationMethod(questionType),
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
                text: dto.text || this.getDefaultText(questionType),
                instructions: dto.instructions || this.getDefaultInstructions(questionType),
                validationMethod: this.getDefaultValidationMethod(questionType),
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
                text: dto.text || this.getDefaultText(questionType),
                instructions: dto.instructions || this.getDefaultInstructions(questionType),
                validationMethod: this.getDefaultValidationMethod(questionType),
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
                text: dto.text || this.getDefaultText(questionType),
                instructions: dto.instructions || this.getDefaultInstructions(questionType),
                validationMethod: this.getDefaultValidationMethod(questionType),
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
                text: dto.text || this.getDefaultText(questionType),
                instructions: dto.instructions || this.getDefaultInstructions(questionType),
                validationMethod: this.getDefaultValidationMethod(questionType),
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
                    text: dto.text || this.getDefaultText(questionType),
                    instructions: dto.instructions || this.getDefaultInstructions(questionType),
                    validationMethod: this.getDefaultValidationMethod(questionType),
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
                text: dto.text || this.getDefaultText(questionType),
                instructions: dto.instructions || this.getDefaultInstructions(questionType),
                validationMethod: this.getDefaultValidationMethod(questionType),
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
                text: dto.text || this.getDefaultText(questionType),
                instructions: dto.instructions || this.getDefaultInstructions(questionType),
                validationMethod: this.getDefaultValidationMethod(questionType),
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
        if (!Array.isArray(dto.subQuestions) || dto.subQuestions.length === 0) {
            throw new common_1.BadRequestException('Must provide at least one sub-question');
        }
        dto.subQuestions.forEach((sub, index) => {
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
                    text: dto.text || this.getDefaultText(questionType),
                    instructions: dto.instructions || this.getDefaultInstructions(questionType),
                    validationMethod: this.getDefaultValidationMethod(questionType),
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
                data: dto.subQuestions.map((sub, index) => ({
                    challengeId: dto.challengeId,
                    stage: dto.stage,
                    phase: dto.phase,
                    position: index + 1,
                    type: 'multiple_choice',
                    points: sub.points,
                    timeLimit: 0,
                    maxAttempts: 0,
                    text: sub.text,
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
                text: dto.text || this.getDefaultText(questionType),
                instructions: dto.instructions || this.getDefaultInstructions(questionType),
                validationMethod: this.getDefaultValidationMethod(questionType),
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
                text: dto.text || this.getDefaultText(questionType),
                instructions: dto.instructions || this.getDefaultInstructions(questionType),
                validationMethod: this.getDefaultValidationMethod(questionType),
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
                text: dto.text || this.getDefaultText(questionType),
                instructions: dto.instructions || this.getDefaultInstructions(questionType),
                validationMethod: this.getDefaultValidationMethod(questionType),
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
                text: dto.text || this.getDefaultText(questionType),
                instructions: dto.instructions || this.getDefaultInstructions(questionType),
                validationMethod: this.getDefaultValidationMethod(questionType),
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
                text: dto.text || this.getDefaultText(questionType),
                instructions: dto.instructions || this.getDefaultInstructions(questionType),
                validationMethod: this.getDefaultValidationMethod(questionType),
                content: dto.content,
            },
        });
    }
    async createTellMeAboutIt(dto) {
        await this.validateChallenge(dto.challengeId);
        if (!dto.content || dto.content.trim().length === 0) {
            throw new common_1.BadRequestException('Content must be a non-empty string');
        }
        const questionType = 'tell_me_about_it';
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
                text: dto.text || this.getDefaultText(questionType),
                instructions: dto.instructions || this.getDefaultInstructions(questionType),
                validationMethod: this.getDefaultValidationMethod(questionType),
                content: dto.content,
            },
        });
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
                text: dto.text || this.getDefaultText(questionType),
                instructions: dto.instructions || this.getDefaultInstructions(questionType),
                validationMethod: this.getDefaultValidationMethod(questionType),
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
        const whereClause = questionId ? `AND q.id = '${questionId}'` : '';
        return this.prisma.$queryRawUnsafe(`
      SELECT
        q.id as "questionId",
        q.text as "questionText",
        q.type as "questionType",
        COUNT(sa.id)::int as "totalAttempts",
        SUM(CASE WHEN sa."isCorrect" THEN 1 ELSE 0 END)::int as "correctAnswers",
        ROUND(AVG(sa."timeSpent"))::int as "averageTime",
        ROUND(AVG(CASE WHEN sa."isCorrect" THEN 100 ELSE 0 END), 2) as "successRate"
      FROM questions q
      INNER JOIN student_answers sa ON sa."questionId" = q.id
      INNER JOIN students s ON s.id = sa."studentId"
      WHERE s."schoolId" = '${schoolId}'
      ${whereClause}
      GROUP BY q.id, q.text, q.type
      ORDER BY "totalAttempts" DESC
    `);
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