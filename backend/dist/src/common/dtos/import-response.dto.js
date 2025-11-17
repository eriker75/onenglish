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
exports.ImportResponseDto = exports.RowErrorDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class RowErrorDto {
    row;
    error;
    data;
}
exports.RowErrorDto = RowErrorDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Row number where the error occurred',
        example: 5,
    }),
    __metadata("design:type", Number)
], RowErrorDto.prototype, "row", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Error message',
        example: 'Invalid email format',
    }),
    __metadata("design:type", String)
], RowErrorDto.prototype, "error", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Row data that caused the error',
        example: { firstName: 'John', email: 'invalid-email' },
    }),
    __metadata("design:type", Object)
], RowErrorDto.prototype, "data", void 0);
class ImportResponseDto {
    success;
    totalRows;
    successCount;
    errorCount;
    errors;
    message;
    processingTime;
}
exports.ImportResponseDto = ImportResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether the import was successful',
        example: true,
    }),
    __metadata("design:type", Boolean)
], ImportResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of rows processed',
        example: 100,
    }),
    __metadata("design:type", Number)
], ImportResponseDto.prototype, "totalRows", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of rows successfully imported',
        example: 95,
    }),
    __metadata("design:type", Number)
], ImportResponseDto.prototype, "successCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of rows that failed to import',
        example: 5,
    }),
    __metadata("design:type", Number)
], ImportResponseDto.prototype, "errorCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of errors encountered during import',
        type: [RowErrorDto],
    }),
    __metadata("design:type", Array)
], ImportResponseDto.prototype, "errors", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional message about the import',
        example: 'Import completed with 5 errors',
    }),
    __metadata("design:type", String)
], ImportResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Processing time in milliseconds',
        example: 1234,
    }),
    __metadata("design:type", Number)
], ImportResponseDto.prototype, "processingTime", void 0);
//# sourceMappingURL=import-response.dto.js.map