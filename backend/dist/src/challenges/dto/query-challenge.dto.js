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
exports.QueryChallengeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const pagination_dto_1 = require("../../common/dtos/pagination.dto");
class QueryChallengeDto extends pagination_dto_1.PaginationDto {
    grade;
    type;
    stage;
    isDemo;
    isActive;
    year;
    exactDate;
    search;
    name;
}
exports.QueryChallengeDto = QueryChallengeDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Filter by grade',
        enum: ['5th_grade', '6th_grade', '1st_year', '2nd_year', '3rd_year', '4th_year', '5th_year'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['5th_grade', '6th_grade', '1st_year', '2nd_year', '3rd_year', '4th_year', '5th_year']),
    __metadata("design:type", String)
], QueryChallengeDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Filter by type',
        enum: ['regular', 'bilingual'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['regular', 'bilingual']),
    __metadata("design:type", String)
], QueryChallengeDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Filter by stage',
        enum: ['Regional', 'State', 'National'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['Regional', 'State', 'National']),
    __metadata("design:type", String)
], QueryChallengeDto.prototype, "stage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Filter by demo status',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], QueryChallengeDto.prototype, "isDemo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Filter by active status',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], QueryChallengeDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Filter by year',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], QueryChallengeDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Filter by exact date (ISO 8601 format)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryChallengeDto.prototype, "exactDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Search by name',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryChallengeDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Filter by name',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryChallengeDto.prototype, "name", void 0);
//# sourceMappingURL=query-challenge.dto.js.map