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
exports.ImportFileDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const nestjs_form_data_1 = require("nestjs-form-data");
class ImportFileDto {
    file;
}
exports.ImportFileDto = ImportFileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'CSV or Excel file to import (max 100MB). Supported formats: .csv, .xlsx, .xls',
        type: 'string',
        format: 'binary',
        required: true,
        example: 'file.csv or file.xlsx',
    }),
    (0, nestjs_form_data_1.IsFile)(),
    (0, nestjs_form_data_1.MaxFileSize)(100 * 1024 * 1024),
    (0, nestjs_form_data_1.HasMimeType)([
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]),
    __metadata("design:type", nestjs_form_data_1.FileSystemStoredFile)
], ImportFileDto.prototype, "file", void 0);
//# sourceMappingURL=import-file.dto.js.map