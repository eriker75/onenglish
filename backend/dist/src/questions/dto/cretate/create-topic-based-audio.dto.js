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
exports.CreateTopicBasedAudioDto = exports.AudioSubQuestionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const base_question_dto_1 = require("./base-question.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
class AudioSubQuestionDto {
    text;
    points;
    options;
    answer;
}
exports.AudioSubQuestionDto = AudioSubQuestionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'What is the main topic discussed in the audio?',
        description: 'Sub-question text',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AudioSubQuestionDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 8,
        minimum: 0,
        description: 'Points for this sub-question',
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], AudioSubQuestionDto.prototype, "points", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        description: 'Answer options for this sub-question',
        example: [
            'Travel plans',
            'Business meeting',
            'Weather forecast',
            'Sports event',
        ],
    }),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            }
            catch {
                return value.split(',').map((item) => item.trim());
            }
        }
        return value;
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(2),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AudioSubQuestionDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Business meeting',
        description: 'Correct answer (must match one of the options)',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AudioSubQuestionDto.prototype, "answer", void 0);
class CreateTopicBasedAudioDto extends (0, swagger_1.OmitType)(base_question_dto_1.BaseCreateQuestionWithoutStageDto, [
    'points',
]) {
    points;
    audio;
    subQuestions;
    parentQuestionId;
}
exports.CreateTopicBasedAudioDto = CreateTopicBasedAudioDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Points value - Auto-calculated from sub-questions sum. If provided, it will be overwritten.',
        example: 0,
        minimum: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Transform)(({ value }) => (value === '' ? undefined : value)),
    __metadata("design:type", Number)
], CreateTopicBasedAudioDto.prototype, "points", void 0);
__decorate([
    (0, nestjs_form_data_1.IsFile)(),
    (0, nestjs_form_data_1.MaxFileSize)(10e6),
    (0, nestjs_form_data_1.HasMimeType)(['audio/mpeg', 'audio/wav', 'audio/ogg']),
    (0, swagger_1.ApiProperty)({
        type: 'string',
        format: 'binary',
        description: 'Audio file for the topic',
    }),
    __metadata("design:type", nestjs_form_data_1.FileSystemStoredFile)
], CreateTopicBasedAudioDto.prototype, "audio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'JSON string array of sub-questions',
        example: JSON.stringify([
            {
                text: 'What is the main topic discussed in the audio?',
                points: 8,
                options: [
                    'Travel plans',
                    'Business meeting',
                    'Weather forecast',
                    'Sports event',
                ],
                answer: 'Business meeting',
            },
            {
                text: 'When will the meeting take place?',
                points: 8,
                options: [
                    'Monday morning',
                    'Tuesday afternoon',
                    'Wednesday evening',
                    'Thursday night',
                ],
                answer: 'Monday morning',
            },
        ]),
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTopicBasedAudioDto.prototype, "subQuestions", void 0);
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
], CreateTopicBasedAudioDto.prototype, "parentQuestionId", void 0);
//# sourceMappingURL=create-topic-based-audio.dto.js.map