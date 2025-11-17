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
exports.CreateLyricsTrainingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const base_question_dto_1 = require("./base-question.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
class CreateLyricsTrainingDto extends base_question_dto_1.BaseCreateQuestionDto {
    media;
    answer;
    options;
}
exports.CreateLyricsTrainingDto = CreateLyricsTrainingDto;
__decorate([
    (0, nestjs_form_data_1.IsFile)(),
    (0, nestjs_form_data_1.MaxFileSize)(10e6),
    (0, nestjs_form_data_1.HasMimeType)(['audio/mpeg', 'audio/wav', 'video/mp4', 'video/webm']),
    (0, swagger_1.ApiProperty)({
        type: 'string',
        format: 'binary',
        description: 'Video/audio file of the song',
    }),
    __metadata("design:type", nestjs_form_data_1.FileSystemStoredFile)
], CreateLyricsTrainingDto.prototype, "media", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'dark',
        description: 'Correct word in the lyrics',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLyricsTrainingDto.prototype, "answer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        example: ['light', 'dark', 'bright', 'night'],
        description: 'Word options',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(2),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateLyricsTrainingDto.prototype, "options", void 0);
//# sourceMappingURL=create-lyrics-training.dto.js.map