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
exports.QuestionsAnswerController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nestjs_form_data_1 = require("nestjs-form-data");
const prisma_service_1 = require("../../database/prisma.service");
const question_validation_service_1 = require("../services/question-validation.service");
const auth_decorator_1 = require("../../auth/decorators/auth.decorator");
const get_user_decorator_1 = require("../../auth/decorators/get-user.decorator");
const enums_1 = require("../../common/definitions/enums");
const answer_1 = require("../dto/answer");
let QuestionsAnswerController = class QuestionsAnswerController {
    prisma;
    validationService;
    constructor(prisma, validationService) {
        this.prisma = prisma;
        this.validationService = validationService;
    }
    async processAnswer(questionId, userId, userAnswer, timeSpent, audioFile) {
        const question = await this.prisma.question.findUnique({
            where: { id: questionId },
            select: { id: true, challengeId: true, maxAttempts: true, type: true },
        });
        if (!question) {
            throw new common_1.BadRequestException('Question not found');
        }
        const student = await this.prisma.student.findFirst({
            where: { userId },
        });
        if (!student) {
            throw new common_1.BadRequestException('Student profile not found');
        }
        const previousAttempts = await this.prisma.studentAnswer.count({
            where: {
                questionId,
                studentId: student.id,
            },
        });
        if (previousAttempts >= question.maxAttempts) {
            throw new common_1.BadRequestException(`Maximum attempts (${question.maxAttempts}) reached for this question`);
        }
        const validation = await this.validationService.validateAnswer(questionId, userAnswer, audioFile);
        const studentAnswer = await this.prisma.studentAnswer.create({
            data: {
                studentId: student.id,
                questionId: question.id,
                challengeId: question.challengeId,
                userAnswer: audioFile ? { audioUrl: 'temp-url' } : userAnswer,
                isCorrect: validation.isCorrect,
                pointsEarned: validation.pointsEarned,
                attemptNumber: previousAttempts + 1,
                timeSpent: timeSpent || 0,
                feedbackEnglish: validation.feedbackEnglish,
                feedbackSpanish: validation.feedbackSpanish,
                audioUrl: audioFile ? `temp-audio-url-${Date.now()}` : null,
            },
        });
        return {
            success: true,
            isCorrect: validation.isCorrect,
            pointsEarned: validation.pointsEarned,
            feedbackEnglish: validation.feedbackEnglish,
            feedbackSpanish: validation.feedbackSpanish,
            details: validation.details,
            studentAnswer: {
                id: studentAnswer.id,
                questionId: studentAnswer.questionId,
                studentId: studentAnswer.studentId,
                isCorrect: studentAnswer.isCorrect,
                pointsEarned: studentAnswer.pointsEarned,
                attemptNumber: studentAnswer.attemptNumber,
                timeSpent: studentAnswer.timeSpent,
            },
        };
    }
    async answerImageToMultipleChoices(id, dto, userId) {
        return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
    }
    async answerWordbox(id, dto, userId) {
        return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
    }
    async answerSpelling(id, dto, userId) {
        if (!dto.audio) {
            throw new common_1.BadRequestException('Audio file is required');
        }
        return this.processAnswer(id, userId, null, dto.timeSpent, dto.audio);
    }
    async answerWordAssociations(id, dto, userId) {
        return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
    }
    async answerUnscramble(id, dto, userId) {
        return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
    }
    async answerTenses(id, dto, userId) {
        return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
    }
    async answerTagIt(id, dto, userId) {
        return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
    }
    async answerReportIt(id, dto, userId) {
        return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
    }
    async answerReadIt(id, dto, userId) {
        return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
    }
    async answerWordMatch(id, dto, userId) {
        return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
    }
    async answerGossip(id, dto, userId) {
        if (!dto.audio) {
            throw new common_1.BadRequestException('Audio file is required');
        }
        return this.processAnswer(id, userId, null, dto.timeSpent, dto.audio);
    }
    async answerTopicBasedAudio(id, dto, userId) {
        return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
    }
    async answerLyricsTraining(id, dto, userId) {
        return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
    }
    async answerSentenceMaker(id, dto, userId) {
        return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
    }
    async answerFastTest(id, dto, userId) {
        return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
    }
    async answerTales(id, dto, userId) {
        return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
    }
    async answerSuperbrain(id, dto, userId) {
        if (!dto.audio) {
            throw new common_1.BadRequestException('Audio file is required');
        }
        return this.processAnswer(id, userId, null, dto.timeSpent, dto.audio);
    }
    async answerTellMeAboutIt(id, dto, userId) {
        if (!dto.audio) {
            throw new common_1.BadRequestException('Audio file is required');
        }
        return this.processAnswer(id, userId, null, dto.timeSpent, dto.audio);
    }
    async answerDebate(id, dto, userId) {
        if (!dto.audio) {
            throw new common_1.BadRequestException('Audio file is required');
        }
        return this.processAnswer(id, userId, dto.stance, dto.timeSpent, dto.audio);
    }
};
exports.QuestionsAnswerController = QuestionsAnswerController;
__decorate([
    (0, common_1.Post)('image_to_multiple_choices/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Answer image_to_multiple_choices question',
        description: 'Submit answer for an image to multiple choices question.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Answer submitted and validated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, answer_1.AnswerImageToMultipleChoicesDto, String]),
    __metadata("design:returntype", Promise)
], QuestionsAnswerController.prototype, "answerImageToMultipleChoices", null);
__decorate([
    (0, common_1.Post)('wordbox/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Answer wordbox question',
        description: 'Submit answer for a wordbox question.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Answer submitted and validated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, answer_1.AnswerWordboxDto, String]),
    __metadata("design:returntype", Promise)
], QuestionsAnswerController.prototype, "answerWordbox", null);
__decorate([
    (0, common_1.Post)('spelling/:id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Answer spelling question with audio',
        description: 'Submit audio recording spelling the word letter-by-letter.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Answer submitted and validated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, answer_1.AnswerAudioQuestionDto, String]),
    __metadata("design:returntype", Promise)
], QuestionsAnswerController.prototype, "answerSpelling", null);
__decorate([
    (0, common_1.Post)('word_associations/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Answer word_associations question',
        description: 'Submit array of associated words.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Answer submitted and validated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, answer_1.AnswerWordAssociationsDto, String]),
    __metadata("design:returntype", Promise)
], QuestionsAnswerController.prototype, "answerWordAssociations", null);
__decorate([
    (0, common_1.Post)('unscramble/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Answer unscramble question',
        description: 'Submit words in correct order.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Answer submitted and validated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, answer_1.AnswerUnscrambleDto, String]),
    __metadata("design:returntype", Promise)
], QuestionsAnswerController.prototype, "answerUnscramble", null);
__decorate([
    (0, common_1.Post)('tenses/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Answer tenses question',
        description: 'Submit selected verb tense.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Answer submitted and validated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, answer_1.AnswerTensesDto, String]),
    __metadata("design:returntype", Promise)
], QuestionsAnswerController.prototype, "answerTenses", null);
__decorate([
    (0, common_1.Post)('tag_it/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Answer tag_it question',
        description: 'Submit array of selected tags.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Answer submitted and validated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, answer_1.AnswerTagItDto, String]),
    __metadata("design:returntype", Promise)
], QuestionsAnswerController.prototype, "answerTagIt", null);
__decorate([
    (0, common_1.Post)('report_it/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Answer report_it question',
        description: 'Submit written report/paragraph.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Answer submitted and validated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, answer_1.AnswerReportItDto, String]),
    __metadata("design:returntype", Promise)
], QuestionsAnswerController.prototype, "answerReportIt", null);
__decorate([
    (0, common_1.Post)('read_it/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Answer read_it question',
        description: 'Submit answers for all sub-questions (true/false).',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Answer submitted and validated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, answer_1.AnswerReadItDto, String]),
    __metadata("design:returntype", Promise)
], QuestionsAnswerController.prototype, "answerReadIt", null);
__decorate([
    (0, common_1.Post)('word_match/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Answer word_match question',
        description: 'Submit word-to-audio matches.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Answer submitted and validated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, answer_1.AnswerWordMatchDto, String]),
    __metadata("design:returntype", Promise)
], QuestionsAnswerController.prototype, "answerWordMatch", null);
__decorate([
    (0, common_1.Post)('gossip/:id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Answer gossip question with audio',
        description: 'Submit audio recording repeating what you heard.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Answer submitted and validated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, answer_1.AnswerAudioQuestionDto, String]),
    __metadata("design:returntype", Promise)
], QuestionsAnswerController.prototype, "answerGossip", null);
__decorate([
    (0, common_1.Post)('topic_based_audio/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Answer topic_based_audio question',
        description: 'Submit answers for all sub-questions based on audio.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Answer submitted and validated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, answer_1.AnswerTopicBasedAudioDto, String]),
    __metadata("design:returntype", Promise)
], QuestionsAnswerController.prototype, "answerTopicBasedAudio", null);
__decorate([
    (0, common_1.Post)('lyrics_training/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Answer lyrics_training question',
        description: 'Submit missing words filled in from song lyrics.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Answer submitted and validated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, answer_1.AnswerLyricsTrainingDto, String]),
    __metadata("design:returntype", Promise)
], QuestionsAnswerController.prototype, "answerLyricsTraining", null);
__decorate([
    (0, common_1.Post)('sentence_maker/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Answer sentence_maker question',
        description: 'Submit written sentence describing images.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Answer submitted and validated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, answer_1.AnswerSentenceMakerDto, String]),
    __metadata("design:returntype", Promise)
], QuestionsAnswerController.prototype, "answerSentenceMaker", null);
__decorate([
    (0, common_1.Post)('fast_test/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Answer fast_test question',
        description: 'Submit quick answer or completion.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Answer submitted and validated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, answer_1.AnswerFastTestDto, String]),
    __metadata("design:returntype", Promise)
], QuestionsAnswerController.prototype, "answerFastTest", null);
__decorate([
    (0, common_1.Post)('tales/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Answer tales question',
        description: 'Submit creative story based on images.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Answer submitted and validated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, answer_1.AnswerTalesDto, String]),
    __metadata("design:returntype", Promise)
], QuestionsAnswerController.prototype, "answerTales", null);
__decorate([
    (0, common_1.Post)('superbrain/:id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Answer superbrain question with audio',
        description: 'Submit audio recording responding to the prompt.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Answer submitted and validated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, answer_1.AnswerAudioQuestionDto, String]),
    __metadata("design:returntype", Promise)
], QuestionsAnswerController.prototype, "answerSuperbrain", null);
__decorate([
    (0, common_1.Post)('tell_me_about_it/:id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Answer tell_me_about_it question with audio',
        description: 'Submit audio recording telling a story.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Answer submitted and validated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, answer_1.AnswerAudioQuestionDto, String]),
    __metadata("design:returntype", Promise)
], QuestionsAnswerController.prototype, "answerTellMeAboutIt", null);
__decorate([
    (0, common_1.Post)('debate/:id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Answer debate question with audio and stance',
        description: 'Submit audio recording with your argument and your stance (support or oppose).',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Answer submitted and validated successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, answer_1.AnswerDebateDto, String]),
    __metadata("design:returntype", Promise)
], QuestionsAnswerController.prototype, "answerDebate", null);
exports.QuestionsAnswerController = QuestionsAnswerController = __decorate([
    (0, swagger_1.ApiTags)('Questions - Answer'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, auth_decorator_1.Auth)(enums_1.ValidRole.STUDENT),
    (0, common_1.Controller)('questions/answer'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        question_validation_service_1.QuestionValidationService])
], QuestionsAnswerController);
//# sourceMappingURL=questions-answer.controller.js.map