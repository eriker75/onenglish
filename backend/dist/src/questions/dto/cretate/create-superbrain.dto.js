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
exports.CreateSuperbrainDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const base_question_dto_1 = require("./base-question.dto");
class CreateSuperbrainDto extends base_question_dto_1.BaseCreateQuestionDto {
    content;
}
exports.CreateSuperbrainDto = CreateSuperbrainDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'What do bees make?',
        description: 'Question prompt for audio response',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSuperbrainDto.prototype, "content", void 0);
//# sourceMappingURL=create-superbrain.dto.js.map