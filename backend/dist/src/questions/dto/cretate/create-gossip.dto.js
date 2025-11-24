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
exports.CreateGossipDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const base_question_dto_1 = require("./base-question.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
class CreateGossipDto extends base_question_dto_1.BaseCreateQuestionWithoutStageDto {
    audio;
    answer;
}
exports.CreateGossipDto = CreateGossipDto;
__decorate([
    (0, nestjs_form_data_1.IsFile)(),
    (0, nestjs_form_data_1.MaxFileSize)(10e6),
    (0, nestjs_form_data_1.HasMimeType)(['audio/mpeg', 'audio/wav', 'audio/ogg']),
    (0, swagger_1.ApiProperty)({
        type: 'string',
        format: 'binary',
        description: 'Audio file to transcribe',
    }),
    __metadata("design:type", nestjs_form_data_1.FileSystemStoredFile)
], CreateGossipDto.prototype, "audio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'The meeting has been moved to Monday morning.',
        description: 'Expected transcription',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGossipDto.prototype, "answer", void 0);
//# sourceMappingURL=create-gossip.dto.js.map