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
exports.AnswerWordAssociationsDto = exports.AnswerWordboxDto = exports.AnswerWithSubQuestionsDto = exports.AnswerTextDto = exports.AnswerMultipleSelectionDto = exports.AnswerMultipleChoiceDto = exports.AnswerAudioQuestionDto = exports.AnswerQuestionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const nestjs_form_data_1 = require("nestjs-form-data");
class AnswerQuestionDto {
    userAnswer;
}
exports.AnswerQuestionDto = AnswerQuestionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "The student's answer to the question",
        example: 'cat',
        oneOf: [
            { type: 'string', example: 'cat' },
            { type: 'array', items: { type: 'string' }, example: ['going', 'to'] },
            {
                type: 'object',
                example: { 'sub-question-id-1': 'true', 'sub-question-id-2': 'false' },
            },
        ],
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], AnswerQuestionDto.prototype, "userAnswer", void 0);
class AnswerAudioQuestionDto {
    audio;
    timeSpent;
}
exports.AnswerAudioQuestionDto = AnswerAudioQuestionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        format: 'binary',
        description: 'Audio file (mp3, wav, ogg, flac, m4a)',
    }),
    (0, nestjs_form_data_1.IsFile)(),
    (0, nestjs_form_data_1.MaxFileSize)(10 * 1024 * 1024),
    (0, nestjs_form_data_1.HasMimeType)([
        'audio/mpeg',
        'audio/wav',
        'audio/ogg',
        'audio/flac',
        'audio/mp4',
    ]),
    __metadata("design:type", nestjs_form_data_1.FileSystemStoredFile)
], AnswerAudioQuestionDto.prototype, "audio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Time spent on the question in seconds',
        example: 120,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AnswerAudioQuestionDto.prototype, "timeSpent", void 0);
class AnswerMultipleChoiceDto {
    userAnswer;
}
exports.AnswerMultipleChoiceDto = AnswerMultipleChoiceDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The selected option',
        example: 'cat',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AnswerMultipleChoiceDto.prototype, "userAnswer", void 0);
class AnswerMultipleSelectionDto {
    userAnswer;
}
exports.AnswerMultipleSelectionDto = AnswerMultipleSelectionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of selected options',
        example: ['option1', 'option2'],
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], AnswerMultipleSelectionDto.prototype, "userAnswer", void 0);
class AnswerTextDto {
    userAnswer;
}
exports.AnswerTextDto = AnswerTextDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Text answer from the student',
        example: 'The cat is on the table',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AnswerTextDto.prototype, "userAnswer", void 0);
class AnswerWithSubQuestionsDto {
    userAnswer;
}
exports.AnswerWithSubQuestionsDto = AnswerWithSubQuestionsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Object mapping sub-question IDs to their answers',
        example: {
            'sub-question-id-1': 'true',
            'sub-question-id-2': 'false',
            'sub-question-id-3': 'option_a',
        },
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], AnswerWithSubQuestionsDto.prototype, "userAnswer", void 0);
class AnswerWordboxDto {
    userAnswer;
    timeSpent;
}
exports.AnswerWordboxDto = AnswerWordboxDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of words formed by the student',
        example: ['cat', 'hat', 'bat'],
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], AnswerWordboxDto.prototype, "userAnswer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Time spent on the question in seconds',
        example: 120,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AnswerWordboxDto.prototype, "timeSpent", void 0);
class AnswerWordAssociationsDto {
    userAnswer;
    timeSpent;
}
exports.AnswerWordAssociationsDto = AnswerWordAssociationsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of associated words provided by the student',
        example: ['ocean', 'waves', 'sand', 'vacation'],
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], AnswerWordAssociationsDto.prototype, "userAnswer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Time spent on the question in seconds',
        example: 90,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AnswerWordAssociationsDto.prototype, "timeSpent", void 0);
//# sourceMappingURL=answer-question.dto.js.map