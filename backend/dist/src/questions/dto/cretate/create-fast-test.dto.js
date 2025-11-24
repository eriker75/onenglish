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
exports.CreateFastTestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const base_question_dto_1 = require("./base-question.dto");
class CreateFastTestDto extends base_question_dto_1.BaseCreateQuestionWithoutStageDto {
    content;
    options;
    answer;
}
exports.CreateFastTestDto = CreateFastTestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        example: ['I enjoy', 'to the beach'],
        description: 'Sentence parts with a gap',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(2),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateFastTestDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        example: ['going', 'go', 'gone', 'going to'],
        description: 'Options to complete the sentence',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(2),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateFastTestDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'going',
        description: 'Correct option',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFastTestDto.prototype, "answer", void 0);
//# sourceMappingURL=create-fast-test.dto.js.map