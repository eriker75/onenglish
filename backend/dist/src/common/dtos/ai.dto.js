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
exports.AiTestResponseDto = exports.AiTestRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AiTestRequestDto {
    prompt;
}
exports.AiTestRequestDto = AiTestRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Prompt message that will be used to test the AI query flow',
        example: 'Explain the present perfect tense in simple terms.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AiTestRequestDto.prototype, "prompt", void 0);
class AiTestResponseDto {
    prompt;
    response;
}
exports.AiTestResponseDto = AiTestResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Original prompt received in the request',
        example: 'Explain the present perfect tense in simple terms.',
    }),
    __metadata("design:type", String)
], AiTestResponseDto.prototype, "prompt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mocked AI response that demonstrates the structure of a successful AI query',
        example: 'Present perfect describes actions that started in the past...',
    }),
    __metadata("design:type", String)
], AiTestResponseDto.prototype, "response", void 0);
//# sourceMappingURL=ai.dto.js.map