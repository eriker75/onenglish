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
exports.School = void 0;
const swagger_1 = require("@nestjs/swagger");
class School {
    id;
    schoolId;
    name;
    code;
    type;
    email;
    phone;
    city;
    state;
    country;
    address;
    postalCode;
    website;
    description;
    isActive;
    createdAt;
    updatedAt;
}
exports.School = School;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School unique identifier (UUID)',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], School.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sequential school ID (friendly identifier for searches and display)',
        example: 1,
    }),
    __metadata("design:type", Number)
], School.prototype, "schoolId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School name',
        example: 'U.E. Colegio Los Arcos',
    }),
    __metadata("design:type", String)
], School.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Auto-generated school code (SCH0001, SCH0002, ..., SCH9999, SCH00001)',
        example: 'SCH0001',
    }),
    __metadata("design:type", String)
], School.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'School type',
        example: 'public',
    }),
    __metadata("design:type", String)
], School.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email address',
        example: 'contacto@colegiolosarcos.edu.ve',
    }),
    __metadata("design:type", String)
], School.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Phone number',
        example: '+58424-1234567',
    }),
    __metadata("design:type", String)
], School.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'City',
        example: 'Caracas',
    }),
    __metadata("design:type", String)
], School.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'State or province',
        example: 'Distrito Capital',
    }),
    __metadata("design:type", String)
], School.prototype, "state", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Country (defaults to Venezuela)',
        example: 'Venezuela',
    }),
    __metadata("design:type", String)
], School.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'School address',
        example: 'Av. Principal de Los Ruices',
    }),
    __metadata("design:type", Object)
], School.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Postal code',
        example: '1071',
    }),
    __metadata("design:type", Object)
], School.prototype, "postalCode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Website URL',
        example: 'https://www.colegiolosarcos.edu.ve',
    }),
    __metadata("design:type", Object)
], School.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'School description',
        example: 'Institución educativa de excelencia',
    }),
    __metadata("design:type", Object)
], School.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the school is active',
        example: true,
    }),
    __metadata("design:type", Boolean)
], School.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2025-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], School.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2025-01-01T00:00:00.000Z',
    }),
    __metadata("design:type", Date)
], School.prototype, "updatedAt", void 0);
//# sourceMappingURL=school.entity.js.map