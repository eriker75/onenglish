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
exports.Challenge = void 0;
const swagger_1 = require("@nestjs/swagger");
class Challenge {
    id;
    name;
    grade;
    type;
    isDemo;
    year;
    exactDate;
    stage;
    isActive;
    createdAt;
    updatedAt;
    totalQuestions;
    totalTime;
}
exports.Challenge = Challenge;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Challenge ID' }),
    __metadata("design:type", String)
], Challenge.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Challenge name' }),
    __metadata("design:type", String)
], Challenge.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Grade level',
        enum: [
            '5th_grade',
            '6th_grade',
            '1st_year',
            '2nd_year',
            '3rd_year',
            '4th_year',
            '5th_year',
        ],
    }),
    __metadata("design:type", String)
], Challenge.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Challenge type',
        enum: ['regular', 'bilingual'],
    }),
    __metadata("design:type", String)
], Challenge.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the challenge is a demo' }),
    __metadata("design:type", Boolean)
], Challenge.prototype, "isDemo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Year of the challenge',
        required: false,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Challenge.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Exact date of the challenge',
        required: false,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Challenge.prototype, "exactDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Challenge stage',
        enum: ['Regional', 'State', 'National'],
        required: false,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Challenge.prototype, "stage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the challenge is active' }),
    __metadata("design:type", Boolean)
], Challenge.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation date' }),
    __metadata("design:type", Date)
], Challenge.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update date' }),
    __metadata("design:type", Date)
], Challenge.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of questions (computed)' }),
    __metadata("design:type", Number)
], Challenge.prototype, "totalQuestions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total time in minutes (computed)' }),
    __metadata("design:type", Number)
], Challenge.prototype, "totalTime", void 0);
//# sourceMappingURL=challenge.entity.js.map