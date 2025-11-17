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
    title;
    slug;
    description;
    category;
    level;
    difficulty;
    totalPoints;
    isPublished;
    isActive;
    createdAt;
    updatedAt;
}
exports.Challenge = Challenge;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Challenge ID' }),
    __metadata("design:type", String)
], Challenge.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Challenge title' }),
    __metadata("design:type", String)
], Challenge.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Challenge slug (unique)' }),
    __metadata("design:type", String)
], Challenge.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Challenge description', required: false, nullable: true }),
    __metadata("design:type", Object)
], Challenge.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Challenge category',
        enum: ['listening', 'speaking', 'grammar', 'vocabulary', 'mixed'],
    }),
    __metadata("design:type", String)
], Challenge.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Challenge level',
        enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
    }),
    __metadata("design:type", String)
], Challenge.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Challenge difficulty',
        enum: ['easy', 'medium', 'hard'],
    }),
    __metadata("design:type", String)
], Challenge.prototype, "difficulty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total points for the challenge' }),
    __metadata("design:type", Number)
], Challenge.prototype, "totalPoints", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the challenge is published' }),
    __metadata("design:type", Boolean)
], Challenge.prototype, "isPublished", void 0);
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
//# sourceMappingURL=challenge.entity.js.map