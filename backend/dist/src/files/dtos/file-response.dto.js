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
exports.DeleteFileResponseDto = exports.FileResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class FileResponseDto {
    id;
    url;
    filename;
    type;
}
exports.FileResponseDto = FileResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique ID of the file in the database',
        example: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8',
    }),
    __metadata("design:type", String)
], FileResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL of the uploaded/updated file',
        example: '/uploads/image/a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8.png',
    }),
    __metadata("design:type", String)
], FileResponseDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Random filename generated for the file',
        example: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8.png',
    }),
    __metadata("design:type", String)
], FileResponseDto.prototype, "filename", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Detected file type',
        example: 'image',
        enum: ['image', 'audio', 'document', 'video'],
    }),
    __metadata("design:type", String)
], FileResponseDto.prototype, "type", void 0);
class DeleteFileResponseDto {
    message;
}
exports.DeleteFileResponseDto = DeleteFileResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Success message',
        example: 'File deleted successfully',
    }),
    __metadata("design:type", String)
], DeleteFileResponseDto.prototype, "message", void 0);
//# sourceMappingURL=file-response.dto.js.map