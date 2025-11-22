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
exports.CreateTensesDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const base_question_dto_1 = require("./base-question.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
var ValidTenses;
(function (ValidTenses) {
    ValidTenses["PRESENT_SIMPLE"] = "present_simple";
    ValidTenses["PAST_SIMPLE"] = "past_simple";
    ValidTenses["FUTURE_SIMPLE"] = "future_simple";
    ValidTenses["PRESENT_CONTINUOUS"] = "present_continuous";
    ValidTenses["PAST_CONTINUOUS"] = "past_continuous";
    ValidTenses["FUTURE_CONTINUOUS"] = "future_continuous";
    ValidTenses["PRESENT_PERFECT"] = "present_perfect";
    ValidTenses["PAST_PERFECT"] = "past_perfect";
    ValidTenses["FUTURE_PERFECT"] = "future_perfect";
})(ValidTenses || (ValidTenses = {}));
class CreateTensesDto extends base_question_dto_1.BaseCreateQuestionWithoutStageDto {
    content;
    options;
    answer;
    media;
}
exports.CreateTensesDto = CreateTensesDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'She does her homework before dinner every day.',
        description: 'Sentence to identify tense from',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTensesDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ValidTenses,
        isArray: true,
        example: [
            ValidTenses.FUTURE_CONTINUOUS,
            ValidTenses.PAST_CONTINUOUS,
            ValidTenses.PAST_PERFECT,
            ValidTenses.PRESENT_CONTINUOUS,
        ],
        description: 'Tense options for multiple choice',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(2),
    (0, class_validator_1.IsEnum)(ValidTenses, { each: true }),
    __metadata("design:type", Array)
], CreateTensesDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ValidTenses,
        example: ValidTenses.PRESENT_SIMPLE,
        description: 'Correct tense',
    }),
    (0, class_validator_1.IsEnum)(ValidTenses),
    __metadata("design:type", String)
], CreateTensesDto.prototype, "answer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: 'string',
        format: 'binary',
        required: false,
        description: 'Optional reference image (image/jpeg, image/png, image/webp, image/svg+xml, image/gif, image/avif)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, nestjs_form_data_1.IsFile)(),
    (0, nestjs_form_data_1.MaxFileSize)(5e6),
    (0, nestjs_form_data_1.HasMimeType)([
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/svg+xml',
        'image/gif',
        'image/avif',
    ]),
    __metadata("design:type", nestjs_form_data_1.FileSystemStoredFile)
], CreateTensesDto.prototype, "media", void 0);
//# sourceMappingURL=create-tenses.dto.js.map