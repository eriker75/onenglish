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
exports.CreateChallengeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateChallengeDto {
    grade;
    type;
    isDemo;
    exactDate;
    stage;
    isActive;
}
exports.CreateChallengeDto = CreateChallengeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Grade level',
        enum: ['5th_grade', '6th_grade', '1st_year', '2nd_year', '3rd_year', '4th_year', '5th_year'],
        example: '5th_grade',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(['5th_grade', '6th_grade', '1st_year', '2nd_year', '3rd_year', '4th_year', '5th_year']),
    __metadata("design:type", String)
], CreateChallengeDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Challenge type',
        enum: ['regular', 'bilingual'],
        example: 'bilingual',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(['regular', 'bilingual']),
    __metadata("design:type", String)
], CreateChallengeDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the challenge is a demo',
        default: false,
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateChallengeDto.prototype, "isDemo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Exact date of the challenge in ISO 8601 format (YYYY-MM-DD)',
        required: false,
        example: '2024-06-15',
        type: String,
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateChallengeDto.prototype, "exactDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Challenge stage',
        enum: ['Regional', 'State', 'National'],
        required: false,
        example: 'National',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['Regional', 'State', 'National']),
    __metadata("design:type", String)
], CreateChallengeDto.prototype, "stage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the challenge is active',
        default: true,
        example: true,
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateChallengeDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-challenge.dto.js.map