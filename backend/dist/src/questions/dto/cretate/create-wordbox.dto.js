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
const class_transformer_1 = require("class-transformer");
const base_question_dto_1 = require("./base-question.dto");
let GridDimensionsMatchConstraint = class GridDimensionsMatchConstraint {
    validate(content, args) {
        const object = args.object;
        const { gridWidth, gridHeight } = object;
        if (!content || !Array.isArray(content)) {
            return false;
        }
        if (gridWidth === undefined || gridHeight === undefined) {
            return true;
        }
        if (content.length !== gridHeight) {
            return false;
        }
        return content.every((row) => Array.isArray(row) && row.length === gridWidth);
    }
    defaultMessage(args) {
        const object = args.object;
        const { gridWidth, gridHeight } = object;
        return `Grid content must match dimensions ${gridWidth}x${gridHeight}. Expected ${gridHeight} rows with ${gridWidth} columns each.`;
    }
};
GridDimensionsMatchConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'GridDimensionsMatch', async: false })
], GridDimensionsMatchConstraint);
class CreateWordboxDto extends base_question_dto_1.BaseCreateQuestionDto {
    gridWidth;
    gridHeight;
    maxWords = 5;
    content;
}
exports.CreateWordboxDto = CreateWordboxDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 3,
        description: 'Width of the grid (number of columns)',
        minimum: 1,
        maximum: 10,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1, { message: 'Grid width must be at least 1' }),
    (0, class_validator_1.Max)(10, { message: 'Grid width cannot exceed 10' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateWordboxDto.prototype, "gridWidth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 3,
        description: 'Height of the grid (number of rows)',
        minimum: 1,
        maximum: 10,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1, { message: 'Grid height must be at least 1' }),
    (0, class_validator_1.Max)(10, { message: 'Grid height cannot exceed 10' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateWordboxDto.prototype, "gridHeight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5,
        default: 5,
        description: 'Maximum number of words the student needs to form to complete the challenge and advance to the next question',
        minimum: 1,
        maximum: 50,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1, { message: 'Max words must be at least 1' }),
    (0, class_validator_1.Max)(50, { message: 'Max words cannot exceed 50' }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateWordboxDto.prototype, "maxWords", void 0);
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
        description: '2D array representing the letter grid. Must match gridWidth x gridHeight dimensions.',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'Grid content cannot be empty' }),
    (0, class_validator_1.Validate)(GridDimensionsMatchConstraint),
    __metadata("design:type", Array)
], CreateWordboxDto.prototype, "content", void 0);
//# sourceMappingURL=create-wordbox.dto.js.map