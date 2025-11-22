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
exports.CreateReadItDto = exports.SubQuestionDto = exports.PassageDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const base_question_dto_1 = require("./base-question.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
class PassageDto {
    image;
    text;
}
exports.PassageDto = PassageDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        example: 'image-url-or-id',
        description: 'Optional image ID or URL'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PassageDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        example: 'Emma travels to school by bus every weekday. On weekends, she enjoys hiking with her friends in the hills.',
        description: 'Passage text content'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PassageDto.prototype, "text", void 0);
class SubQuestionDto {
    content;
    options;
    answer;
    points;
}
exports.SubQuestionDto = SubQuestionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Emma travels to school by bus every day.',
        description: 'Sub-question statement',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubQuestionDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [Boolean],
        example: [true, false],
        description: 'True/False options',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsBoolean)({ each: true }),
    __metadata("design:type", Array)
], SubQuestionDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Correct answer (true or false)',
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SubQuestionDto.prototype, "answer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5,
        description: 'Points awarded for this sub-question',
        minimum: 0,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], SubQuestionDto.prototype, "points", void 0);
class CreateReadItDto extends base_question_dto_1.BaseCreateQuestionWithoutStageDto {
    content;
    subQuestions;
    parentQuestionId;
    media;
}
exports.CreateReadItDto = CreateReadItDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [PassageDto],
        description: 'Reading passages (can include images and/or text)',
        example: [
            {
                text: 'Emma travels to school by bus every weekday. On weekends, she enjoys hiking with her friends in the hills.',
            },
        ],
    }),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            }
            catch {
                return value;
            }
        }
        return value;
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PassageDto),
    __metadata("design:type", Array)
], CreateReadItDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [SubQuestionDto],
        description: 'True/False sub-questions about the passage (parent points will be auto-calculated as sum of sub-question points)',
        example: [
            {
                content: 'Emma travels to school by bus every day.',
                options: [true, false],
                answer: true,
                points: 5,
            },
            {
                content: 'She hikes alone on weekends.',
                options: [true, false],
                answer: false,
                points: 5,
            },
        ],
    }),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            }
            catch {
                return value;
            }
        }
        return value;
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SubQuestionDto),
    __metadata("design:type", Array)
], CreateReadItDto.prototype, "subQuestions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Parent question ID for sub-questions',
        example: '507f1f77-bcf8-6cd7-9943-9101abcd5678',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === '' || value === null || value === undefined) {
            return undefined;
        }
        return value;
    }),
    __metadata("design:type", String)
], CreateReadItDto.prototype, "parentQuestionId", void 0);
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
], CreateReadItDto.prototype, "media", void 0);
//# sourceMappingURL=create-read-it.dto.js.map