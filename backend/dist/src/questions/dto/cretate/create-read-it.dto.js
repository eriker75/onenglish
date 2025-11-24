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
exports.CreateReadItDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const base_question_dto_1 = require("./base-question.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
class CreateReadItDto extends base_question_dto_1.BaseCreateQuestionWithoutStageDto {
    content;
    subQuestions;
    parentQuestionId;
    image;
}
exports.CreateReadItDto = CreateReadItDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Reading passage text content',
        example: 'Emma travels to school by bus every weekday. On weekends, she enjoys hiking with her friends in the hills.',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReadItDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'JSON string array of sub-questions. Each sub-question must have: content (string), options ([true, false]), answer (boolean), points (number)',
        example: JSON.stringify([
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
        ]),
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
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
], CreateReadItDto.prototype, "image", void 0);
//# sourceMappingURL=create-read-it.dto.js.map