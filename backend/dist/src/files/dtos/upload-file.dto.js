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
exports.UploadFileDto = void 0;
const nestjs_form_data_1 = require("nestjs-form-data");
const swagger_1 = require("@nestjs/swagger");
const file_type_detector_util_1 = require("../utils/file-type-detector.util");
class UploadFileDto {
    file;
}
exports.UploadFileDto = UploadFileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        format: 'binary',
        description: 'File to upload. Type will be automatically detected from extension and MIME type. Supported types: image, audio, document, video',
        example: 'file.png',
    }),
    (0, nestjs_form_data_1.IsFile)(),
    (0, nestjs_form_data_1.MaxFileSize)(50 * 1024 * 1024),
    (0, nestjs_form_data_1.HasMimeType)((0, file_type_detector_util_1.getSupportedMimeTypes)()),
    __metadata("design:type", nestjs_form_data_1.FileSystemStoredFile)
], UploadFileDto.prototype, "file", void 0);
//# sourceMappingURL=upload-file.dto.js.map