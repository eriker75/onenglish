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
exports.QuestionsUpdateController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nestjs_form_data_1 = require("nestjs-form-data");
const question_update_service_1 = require("../services/question-update.service");
const update_1 = require("../dto/update");
let QuestionsUpdateController = class QuestionsUpdateController {
    updateService;
    constructor(updateService) {
        this.updateService = updateService;
    }
    updateImageToMultipleChoices(id, dto) {
        return this.updateService.updateQuestion(id, dto);
    }
    updateWordbox(id, dto) {
        return this.updateService.updateQuestion(id, dto);
    }
    updateSpelling(id, dto) {
        return this.updateService.updateQuestion(id, dto);
    }
    updateWordAssociations(id, dto) {
        return this.updateService.updateQuestion(id, dto);
    }
    updateUnscramble(id, dto) {
        return this.updateService.updateQuestion(id, dto);
    }
    updateTenses(id, dto) {
        return this.updateService.updateQuestion(id, dto);
    }
    updateTagIt(id, dto) {
        return this.updateService.updateQuestion(id, dto);
    }
    updateReportIt(id, dto) {
        return this.updateService.updateQuestion(id, dto);
    }
    updateReadIt(id, dto) {
        return this.updateService.updateQuestion(id, dto);
    }
    updateWordMatch(id, dto) {
        return this.updateService.updateQuestion(id, dto);
    }
    updateGossip(id, dto) {
        return this.updateService.updateQuestion(id, dto);
    }
    updateTopicBasedAudio(id, dto) {
        return this.updateService.updateQuestion(id, dto);
    }
    updateLyricsTraining(id, dto) {
        return this.updateService.updateQuestion(id, dto);
    }
    updateSentenceMaker(id, dto) {
        return this.updateService.updateQuestion(id, dto);
    }
    updateFastTest(id, dto) {
        return this.updateService.updateQuestion(id, dto);
    }
    updateTales(id, dto) {
        return this.updateService.updateQuestion(id, dto);
    }
    updateSuperbrain(id, dto) {
        return this.updateService.updateQuestion(id, dto);
    }
    updateTellMeAboutIt(id, dto) {
        return this.updateService.updateQuestion(id, dto);
    }
    updateDebate(id, dto) {
        return this.updateService.updateQuestion(id, dto);
    }
    bulkUpdateQuestions(dto) {
        return this.updateService.bulkUpdateQuestions(dto.updates);
    }
    async deleteQuestion(id) {
        await this.updateService.deleteQuestion(id);
        return { message: 'Question deleted successfully' };
    }
};
exports.QuestionsUpdateController = QuestionsUpdateController;
__decorate([
    (0, common_1.Patch)('image_to_multiple_choices/:id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update image_to_multiple_choices question',
        description: 'Update an image to multiple choices question.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_1.UpdateImageToMultipleChoicesDto]),
    __metadata("design:returntype", void 0)
], QuestionsUpdateController.prototype, "updateImageToMultipleChoices", null);
__decorate([
    (0, common_1.Patch)('wordbox/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update wordbox question',
        description: 'Update a wordbox question.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_1.UpdateWordboxDto]),
    __metadata("design:returntype", void 0)
], QuestionsUpdateController.prototype, "updateWordbox", null);
__decorate([
    (0, common_1.Patch)('spelling/:id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update spelling question',
        description: 'Update a spelling question.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_1.UpdateSpellingDto]),
    __metadata("design:returntype", void 0)
], QuestionsUpdateController.prototype, "updateSpelling", null);
__decorate([
    (0, common_1.Patch)('word_associations/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update word_associations question',
        description: 'Update a word associations question.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_1.UpdateWordAssociationsDto]),
    __metadata("design:returntype", void 0)
], QuestionsUpdateController.prototype, "updateWordAssociations", null);
__decorate([
    (0, common_1.Patch)('unscramble/:id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update unscramble question',
        description: 'Update an unscramble question.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_1.UpdateUnscrambleDto]),
    __metadata("design:returntype", void 0)
], QuestionsUpdateController.prototype, "updateUnscramble", null);
__decorate([
    (0, common_1.Patch)('tenses/:id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update tenses question',
        description: 'Update a tenses question.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_1.UpdateTensesDto]),
    __metadata("design:returntype", void 0)
], QuestionsUpdateController.prototype, "updateTenses", null);
__decorate([
    (0, common_1.Patch)('tag_it/:id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update tag_it question',
        description: 'Update a tag it question.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_1.UpdateTagItDto]),
    __metadata("design:returntype", void 0)
], QuestionsUpdateController.prototype, "updateTagIt", null);
__decorate([
    (0, common_1.Patch)('report_it/:id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update report_it question',
        description: 'Update a report it question.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_1.UpdateReportItDto]),
    __metadata("design:returntype", void 0)
], QuestionsUpdateController.prototype, "updateReportIt", null);
__decorate([
    (0, common_1.Patch)('read_it/:id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update read_it question',
        description: 'Update a read it question. Parent points are auto-calculated from sub-questions.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_1.UpdateReadItDto]),
    __metadata("design:returntype", void 0)
], QuestionsUpdateController.prototype, "updateReadIt", null);
__decorate([
    (0, common_1.Patch)('word_match/:id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update word_match question',
        description: 'Update a word match question.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_1.UpdateWordMatchDto]),
    __metadata("design:returntype", void 0)
], QuestionsUpdateController.prototype, "updateWordMatch", null);
__decorate([
    (0, common_1.Patch)('gossip/:id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update gossip question',
        description: 'Update a gossip question.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_1.UpdateGossipDto]),
    __metadata("design:returntype", void 0)
], QuestionsUpdateController.prototype, "updateGossip", null);
__decorate([
    (0, common_1.Patch)('topic_based_audio/:id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update topic_based_audio question',
        description: 'Update a topic based audio question. Parent points are auto-calculated from sub-questions.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_1.UpdateTopicBasedAudioDto]),
    __metadata("design:returntype", void 0)
], QuestionsUpdateController.prototype, "updateTopicBasedAudio", null);
__decorate([
    (0, common_1.Patch)('lyrics_training/:id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update lyrics_training question',
        description: 'Update a lyrics training question.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_1.UpdateLyricsTrainingDto]),
    __metadata("design:returntype", void 0)
], QuestionsUpdateController.prototype, "updateLyricsTraining", null);
__decorate([
    (0, common_1.Patch)('sentence_maker/:id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update sentence_maker question',
        description: 'Update a sentence maker question.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_1.UpdateSentenceMakerDto]),
    __metadata("design:returntype", void 0)
], QuestionsUpdateController.prototype, "updateSentenceMaker", null);
__decorate([
    (0, common_1.Patch)('fast_test/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update fast_test question',
        description: 'Update a fast test question.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_1.UpdateFastTestDto]),
    __metadata("design:returntype", void 0)
], QuestionsUpdateController.prototype, "updateFastTest", null);
__decorate([
    (0, common_1.Patch)('tales/:id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update tales question',
        description: 'Update a tales question.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_1.UpdateTalesDto]),
    __metadata("design:returntype", void 0)
], QuestionsUpdateController.prototype, "updateTales", null);
__decorate([
    (0, common_1.Patch)('superbrain/:id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update superbrain question',
        description: 'Update a superbrain question.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_1.UpdateSuperbrainDto]),
    __metadata("design:returntype", void 0)
], QuestionsUpdateController.prototype, "updateSuperbrain", null);
__decorate([
    (0, common_1.Patch)('tell_me_about_it/:id'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update tell_me_about_it question',
        description: 'Update a tell me about it question.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_1.UpdateTellMeAboutItDto]),
    __metadata("design:returntype", void 0)
], QuestionsUpdateController.prototype, "updateTellMeAboutIt", null);
__decorate([
    (0, common_1.Patch)('debate/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update debate question',
        description: 'Update a debate question.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Question ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Question not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_1.UpdateDebateDto]),
    __metadata("design:returntype", void 0)
], QuestionsUpdateController.prototype, "updateDebate", null);
__decorate([
    (0, common_1.Patch)('bulk'),
    (0, swagger_1.ApiOperation)({
        summary: 'Bulk update multiple questions',
        description: 'Update multiple questions in a single request. Each update can modify different fields.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Questions updated successfully',
        schema: {
            type: 'array',
            items: { type: 'object' },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - invalid data',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_1.BulkUpdateQuestionsDto]),
    __metadata("design:returntype", void 0)
], QuestionsUpdateController.prototype, "bulkUpdateQuestions", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a question',
        description: 'Delete a question. If the question has sub-questions, they will be deleted as well (cascade). If this is a sub-question, the parent points will be recalculated.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Question ID',
        type: 'string',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Question deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Question not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestionsUpdateController.prototype, "deleteQuestion", null);
exports.QuestionsUpdateController = QuestionsUpdateController = __decorate([
    (0, swagger_1.ApiTags)('Questions - Update'),
    (0, common_1.Controller)('questions'),
    __metadata("design:paramtypes", [question_update_service_1.QuestionUpdateService])
], QuestionsUpdateController);
//# sourceMappingURL=questions-update.controller.js.map