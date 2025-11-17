"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nestjs_form_data_1 = require("nestjs-form-data");
const questions_service_1 = require("../services/questions.service");
const client_1 = require("@prisma/client");
const QuestionDtos = __importStar(require("../dto"));
const entities_1 = require("../entities");
let QuestionsController = class QuestionsController {
    questionsService;
    constructor(questionsService) {
        this.questionsService = questionsService;
    }
    createImageToMultipleChoices(dto) {
        return this.questionsService.createImageToMultipleChoices(dto);
    }
    createWordbox(dto) {
        return this.questionsService.createWordbox(dto);
    }
    createSpelling(dto) {
        return this.questionsService.createSpelling(dto);
    }
    createWordAssociations(dto) {
        return this.questionsService.createWordAssociations(dto);
    }
    createUnscramble(dto) {
        return this.questionsService.createUnscramble(dto);
    }
    createTenses(dto) {
        return this.questionsService.createTenses(dto);
    }
    createTagIt(dto) {
        return this.questionsService.createTagIt(dto);
    }
    createReportIt(dto) {
        return this.questionsService.createReportIt(dto);
    }
    createReadIt(dto) {
        return this.questionsService.createReadIt(dto);
    }
    createWordMatch(dto) {
        return this.questionsService.createWordMatch(dto);
    }
    createGossip(dto) {
        return this.questionsService.createGossip(dto);
    }
    createTopicBasedAudio(dto) {
        return this.questionsService.createTopicBasedAudio(dto);
    }
    createLyricsTraining(dto) {
        return this.questionsService.createLyricsTraining(dto);
    }
    createSentenceMaker(dto) {
        return this.questionsService.createSentenceMaker(dto);
    }
    createFastTest(dto) {
        return this.questionsService.createFastTest(dto);
    }
    createTales(dto) {
        return this.questionsService.createTales(dto);
    }
    createSuperbrain(dto) {
        return this.questionsService.createSuperbrain(dto);
    }
    createTellMeAboutIt(dto) {
        return this.questionsService.createTellMeAboutIt(dto);
    }
    createDebate(dto) {
        return this.questionsService.createDebate(dto);
    }
    findAll(challengeId, stage, phase) {
        return this.questionsService.findAll({ challengeId, stage, phase });
    }
    findOne(id) {
        return this.questionsService.findOne(id);
    }
    getSchoolStats(schoolId, questionId) {
        return this.questionsService.getSchoolStats(schoolId, questionId);
    }
};
exports.QuestionsController = QuestionsController;
__decorate([
    (0, common_1.Post)('create/image_to_multiple_choices'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create an image to multiple choices question',
        description: 'Creates a vocabulary question where students match an image to the correct word from multiple options. Default validation method: AUTO.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Question created successfully',
        type: entities_1.Question,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuestionDtos.CreateImageToMultipleChoicesDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "createImageToMultipleChoices", null);
__decorate([
    (0, common_1.Post)('create/wordbox'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a wordbox question',
        description: 'Creates a vocabulary question where students build a word using a grid of letters. Default validation method: IA.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Question created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuestionDtos.CreateWordboxDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "createWordbox", null);
__decorate([
    (0, common_1.Post)('create/spelling'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a spelling question',
        description: 'Creates a vocabulary question where students spell the name of an object shown in an image or heard in audio. Default validation method: IA.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Question created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuestionDtos.CreateSpellingDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "createSpelling", null);
__decorate([
    (0, common_1.Post)('create/word_associations'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a word associations question',
        description: 'Creates a vocabulary question where students connect a target word with related concepts. Default validation method: IA.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Question created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuestionDtos.CreateWordAssociationsDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "createWordAssociations", null);
__decorate([
    (0, common_1.Post)('create/unscramble'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create an unscramble sentence question',
        description: 'Creates a grammar question where students reorder scrambled words to form a correct sentence. Default validation method: AUTO.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Question created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuestionDtos.CreateUnscrambleDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "createUnscramble", null);
__decorate([
    (0, common_1.Post)('create/tenses'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a verb tenses question',
        description: 'Creates a grammar question where students identify or select the correct verb tense. Default validation method: AUTO.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Question created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuestionDtos.CreateTensesDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "createTenses", null);
__decorate([
    (0, common_1.Post)('create/tag_it'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a tag question',
        description: 'Creates a grammar question where students complete a sentence with the correct question tag. Default validation method: AUTO.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Question created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuestionDtos.CreateTagItDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "createTagIt", null);
__decorate([
    (0, common_1.Post)('create/report_it'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a reported speech question',
        description: 'Creates a grammar question where students convert direct speech to reported speech. Default validation method: IA.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Question created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuestionDtos.CreateReportItDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "createReportIt", null);
__decorate([
    (0, common_1.Post)('create/read_it'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a reading comprehension question with sub-questions',
        description: 'Creates a grammar/reading question where students read a passage and answer true/false sub-questions. Default validation method: AUTO.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Question and sub-questions created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuestionDtos.CreateReadItDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "createReadIt", null);
__decorate([
    (0, common_1.Post)('create/word_match'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a word match listening question',
        description: 'Creates a listening question where students match audio to the correct word. Default validation method: AUTO.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Question created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuestionDtos.CreateWordMatchDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "createWordMatch", null);
__decorate([
    (0, common_1.Post)('create/gossip'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a gossip (transcription) question',
        description: 'Creates a listening question where students transcribe audio into English text. Default validation method: IA.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Question created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuestionDtos.CreateGossipDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "createGossip", null);
__decorate([
    (0, common_1.Post)('create/topic_based_audio'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a topic-based audio question with sub-questions',
        description: 'Creates a listening question where students listen to audio and answer multiple-choice sub-questions. Default validation method: AUTO.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Question and sub-questions created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuestionDtos.CreateTopicBasedAudioDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "createTopicBasedAudio", null);
__decorate([
    (0, common_1.Post)('create/lyrics_training'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a lyrics training question',
        description: 'Creates a listening question where students complete lyrics after listening to a song clip. Default validation method: AUTO.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Question created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuestionDtos.CreateLyricsTrainingDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "createLyricsTraining", null);
__decorate([
    (0, common_1.Post)('create/sentence_maker'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a sentence maker question',
        description: 'Creates a writing question where students create a sentence inspired by provided images. Default validation method: IA.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Question created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuestionDtos.CreateSentenceMakerDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "createSentenceMaker", null);
__decorate([
    (0, common_1.Post)('create/fast_test'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a fast test question',
        description: 'Creates a writing question where students complete a sentence by selecting the correct option. Default validation method: AUTO.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Question created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuestionDtos.CreateFastTestDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "createFastTest", null);
__decorate([
    (0, common_1.Post)('create/tales'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a tales (story writing) question',
        description: 'Creates a writing question where students write a short story based on provided images. Default validation method: IA.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Question created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuestionDtos.CreateTalesDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "createTales", null);
__decorate([
    (0, common_1.Post)('create/superbrain'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a superbrain question',
        description: 'Creates a speaking question where students respond to a prompt with a single audio response. Default validation method: IA.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Question created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuestionDtos.CreateSuperbrainDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "createSuperbrain", null);
__decorate([
    (0, common_1.Post)('create/tell_me_about_it'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a tell me about it question',
        description: 'Creates a speaking question where students create an audio story based on a prompt. Default validation method: IA.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Question created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuestionDtos.CreateTellMeAboutItDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "createTellMeAboutIt", null);
__decorate([
    (0, common_1.Post)('create/debate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a debate question',
        description: 'Creates a speaking question where students defend or oppose a provided statement with an audio argument. Default validation method: IA.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Question created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation failed',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QuestionDtos.CreateDebateDto]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "createDebate", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all questions with optional filters',
        description: 'Retrieves all root-level questions (without parent) with optional filters by challengeId, stage, or phase.',
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
    (0, swagger_1.ApiQuery)({
        name: 'phase',
        required: false,
        description: 'Filter by phase identifier',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns filtered questions with sub-questions included',
        type: [entities_1.Question],
    }),
    __param(0, (0, common_1.Query)('challengeId')),
    __param(1, (0, common_1.Query)('stage')),
    __param(2, (0, common_1.Query)('phase')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "findAll", null);
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
], QuestionsController.prototype, "findOne", null);
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
], QuestionsController.prototype, "getSchoolStats", null);
exports.QuestionsController = QuestionsController = __decorate([
    (0, swagger_1.ApiTags)('Questions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('questions'),
    __metadata("design:paramtypes", [questions_service_1.QuestionsService])
], QuestionsController);
//# sourceMappingURL=questions.controller.js.map