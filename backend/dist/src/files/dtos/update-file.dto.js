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
exports.UpdateFileDto = void 0;
const nestjs_form_data_1 = require("nestjs-form-data");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const file_type_detector_util_1 = require("../utils/file-type-detector.util");
class UpdateFileDto {
    file;
    fileId;
}
exports.UpdateFileDto = UpdateFileDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: 'string',
        format: 'binary',
        description: 'New file to replace the old one. Type will be automatically detected from extension and MIME type.',
        example: 'new-file.png',
    }),
    (0, nestjs_form_data_1.IsFile)(),
    (0, nestjs_form_data_1.MaxFileSize)(50 * 1024 * 1024),
    (0, nestjs_form_data_1.HasMimeType)((0, file_type_detector_util_1.getSupportedMimeTypes)()),
    __metadata("design:type", nestjs_form_data_1.FileSystemStoredFile)
], UpdateFileDto.prototype, "file", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the existing file to replace',
        example: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateFileDto.prototype, "fileId", void 0);
//# sourceMappingURL=update-file.dto.js.map