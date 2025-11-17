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
exports.QuestionMediaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const file_service_1 = require("../../files/services/file.service");
let QuestionMediaService = class QuestionMediaService {
    prisma;
    fileService;
    constructor(prisma, fileService) {
        this.prisma = prisma;
        this.fileService = fileService;
    }
    async uploadSingleFile(file) {
        return this.fileService.saveFile(file);
    }
    async uploadMultipleFiles(files) {
        return Promise.all(files.map((file) => this.fileService.saveFile(file)));
    }
    async attachMediaFiles(questionId, mediaIds) {
        if (!mediaIds.length)
            return;
        const mediaAttachments = mediaIds.map((media, index) => ({
            questionId,
            mediaFileId: media.id,
            position: media.position ?? index,
            context: media.context ?? 'main',
        }));
        await this.prisma.questionMedia.createMany({
            data: mediaAttachments,
        });
    }
    async detachAllMediaFiles(questionId) {
        await this.prisma.questionMedia.deleteMany({
            where: { questionId },
        });
    }
    async replaceMediaFiles(questionId, mediaIds) {
        await this.detachAllMediaFiles(questionId);
        await this.attachMediaFiles(questionId, mediaIds);
    }
    async getQuestionMedia(questionId) {
        return this.prisma.questionMedia.findMany({
            where: { questionId },
            include: { mediaFile: true },
            orderBy: { position: 'asc' },
        });
    }
    enrichQuestionWithMedia(question) {
        if (!question)
            return question;
        const media = question.questionMedia?.map((qm) => ({
            id: qm.mediaFile.id,
            url: qm.mediaFile.url,
            type: qm.mediaFile.type,
            filename: qm.mediaFile.filename,
            mimeType: qm.mediaFile.mimeType,
            size: qm.mediaFile.size,
            position: qm.position,
            context: qm.context,
        })) || [];
        const configurations = question.configurations?.reduce((acc, config) => {
            acc[config.metaKey] = config.metaValue;
            return acc;
        }, {}) || {};
        const enrichedSubQuestions = question.subQuestions?.map((sub) => this.enrichQuestionWithMedia(sub)) ||
            [];
        const { questionMedia: _questionMedia, ...questionData } = question;
        return {
            ...questionData,
            media,
            configurations,
            subQuestions: enrichedSubQuestions,
        };
    }
    enrichQuestionsWithMedia(questions) {
        return questions.map((q) => this.enrichQuestionWithMedia(q));
    }
};
exports.QuestionMediaService = QuestionMediaService;
exports.QuestionMediaService = QuestionMediaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        file_service_1.FileService])
], QuestionMediaService);
//# sourceMappingURL=question-media.service.js.map