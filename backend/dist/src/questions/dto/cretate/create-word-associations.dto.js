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
exports.CreateWordAssociationsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const base_question_dto_1 = require("./base-question.dto");
class CreateWordAssociationsDto extends base_question_dto_1.BaseCreateQuestionDto {
    content;
    configuration;
}
exports.CreateWordAssociationsDto = CreateWordAssociationsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Journey',
        description: 'Target word for associations',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWordAssociationsDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { totalAssociations: 20 },
        description: 'Configuration including total associations expected',
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateWordAssociationsDto.prototype, "configuration", void 0);
//# sourceMappingURL=create-word-associations.dto.js.map