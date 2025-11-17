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
exports.Coordinator = void 0;
const swagger_1 = require("@nestjs/swagger");
class Coordinator {
    id;
    firstName;
    lastName;
    email;
    phone;
    bio;
    avatar;
    isActive;
    schoolId;
    userId;
    createdAt;
    updatedAt;
}
exports.Coordinator = Coordinator;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Coordinator unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], Coordinator.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Coordinator first name',
        example: 'Maria',
    }),
    __metadata("design:type", String)
], Coordinator.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Coordinator last name',
        example: 'Rodriguez',
    }),
    __metadata("design:type", String)
], Coordinator.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Coordinator email address',
        example: 'maria.rodriguez@example.com',
    }),
    __metadata("design:type", String)
], Coordinator.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Coordinator phone number',
        example: '+1234567890',
    }),
    __metadata("design:type", Object)
], Coordinator.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Coordinator biography',
        example: 'Academic coordinator with 15 years of experience',
    }),
    __metadata("design:type", Object)
], Coordinator.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Coordinator avatar URL',
        example: 'https://example.com/avatar.jpg',
    }),
    __metadata("design:type", Object)
], Coordinator.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the coordinator is active',
        example: true,
    }),
    __metadata("design:type", Boolean)
], Coordinator.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'School ID the coordinator belongs to',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", Object)
], Coordinator.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID associated with the coordinator',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], Coordinator.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2025-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], Coordinator.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2025-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], Coordinator.prototype, "updatedAt", void 0);
//# sourceMappingURL=coordinator.entity.js.map