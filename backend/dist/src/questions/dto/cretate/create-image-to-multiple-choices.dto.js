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
exports.CreateImageToMultipleChoicesDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const base_question_dto_1 = require("./base-question.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
class CreateImageToMultipleChoicesDto extends base_question_dto_1.BaseCreateQuestionDto {
    media;
    options;
    answer;
}
exports.CreateImageToMultipleChoicesDto = CreateImageToMultipleChoicesDto;
__decorate([
    (0, nestjs_form_data_1.IsFile)(),
    (0, nestjs_form_data_1.MaxFileSize)(5e6),
    (0, nestjs_form_data_1.HasMimeType)(['image/jpeg', 'image/png', 'image/webp']),
    (0, swagger_1.ApiProperty)({
        type: 'string',
        format: 'binary',
        description: 'Image file to upload',
    }),
    __metadata("design:type", nestjs_form_data_1.FileSystemStoredFile)
], CreateImageToMultipleChoicesDto.prototype, "media", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        example: ['Apple', 'Orange', 'Grapes', 'Banana'],
        description: 'Multiple choice options (minimum 2). For form-data, send as comma-separated string: "Apple,Orange,Grapes,Banana"',
    }),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return value.split(',').map((item) => item.trim());
        }
        return value;
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(2, { message: 'Must provide at least 2 options' }),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateImageToMultipleChoicesDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Apple',
        description: 'Correct answer (must be one of the options)',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateImageToMultipleChoicesDto.prototype, "answer", void 0);
//# sourceMappingURL=create-image-to-multiple-choices.dto.js.map