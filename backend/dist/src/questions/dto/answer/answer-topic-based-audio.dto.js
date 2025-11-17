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
exports.AnswerTopicBasedAudioDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class AnswerTopicBasedAudioDto {
    userAnswer;
    timeSpent;
}
exports.AnswerTopicBasedAudioDto = AnswerTopicBasedAudioDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Object mapping sub-question IDs to their answers',
        example: {
            'sub-question-id-1': 'answer text 1',
            'sub-question-id-2': 'answer text 2',
            'sub-question-id-3': 'answer text 3',
        },
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], AnswerTopicBasedAudioDto.prototype, "userAnswer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Time spent on the question in seconds',
        example: 150,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], AnswerTopicBasedAudioDto.prototype, "timeSpent", void 0);
//# sourceMappingURL=answer-topic-based-audio.dto.js.map