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
exports.Student = void 0;
const swagger_1 = require("@nestjs/swagger");
class Student {
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
exports.Student = Student;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student unique identifier',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], Student.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student first name',
        example: 'John',
    }),
    __metadata("design:type", String)
], Student.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student last name',
        example: 'Doe',
    }),
    __metadata("design:type", String)
], Student.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Student email address',
        example: 'john.doe@example.com',
    }),
    __metadata("design:type", String)
], Student.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Student phone number',
        example: '+1234567890',
    }),
    __metadata("design:type", Object)
], Student.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Student biography',
        example: 'Passionate about learning English',
    }),
    __metadata("design:type", Object)
], Student.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Student avatar URL',
        example: 'https://example.com/avatar.jpg',
    }),
    __metadata("design:type", Object)
], Student.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the student is active',
        example: true,
    }),
    __metadata("design:type", Boolean)
], Student.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'School ID the student belongs to',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", Object)
], Student.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User ID associated with the student',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], Student.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2025-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], Student.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2025-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], Student.prototype, "updatedAt", void 0);
//# sourceMappingURL=student.entity.js.map