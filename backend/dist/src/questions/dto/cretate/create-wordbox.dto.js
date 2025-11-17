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
exports.CreateWordboxDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const base_question_dto_1 = require("./base-question.dto");
class CreateWordboxDto extends base_question_dto_1.BaseCreateQuestionDto {
    content;
    configuration;
}
exports.CreateWordboxDto = CreateWordboxDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'array',
        items: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
        example: [
            ['A', 'B', 'C'],
            ['S', 'T', 'O'],
            ['A', 'C', 'D'],
        ],
        description: '2D array representing the letter grid',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    __metadata("design:type", Array)
], CreateWordboxDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: { gridWidth: 3, gridHeight: 3 },
        description: 'Grid configuration settings',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateWordboxDto.prototype, "configuration", void 0);
//# sourceMappingURL=create-wordbox.dto.js.map