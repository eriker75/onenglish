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
exports.MediaFileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let MediaFileService = class MediaFileService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(attachmentData) {
        const { ...rest } = attachmentData;
        return this.prisma.mediaFile.create({
            data: {
                ...rest,
            },
        });
    }
    async findById(id) {
        const attachment = await this.prisma.mediaFile.findUnique({
            where: { id },
        });
        if (!attachment) {
            throw new common_1.NotFoundException('MediaFile not found');
        }
        return attachment;
    }
    async findByRandomName(pathName) {
        const attachment = await this.prisma.mediaFile.findFirst({
            where: { pathName },
        });
        if (!attachment) {
            throw new common_1.NotFoundException('MediaFile not found');
        }
        return attachment;
    }
    async update(pathName, updateData) {
        const attachment = await this.prisma.mediaFile.findFirst({
            where: { pathName },
        });
        if (!attachment) {
            throw new common_1.NotFoundException('MediaFile not found');
        }
        try {
            return await this.prisma.mediaFile.update({
                where: { id: attachment.id },
                data: updateData,
            });
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException('MediaFile not found');
            }
            throw error;
        }
    }
    async delete(pathName) {
        const attachment = await this.prisma.mediaFile.findFirst({
            where: { pathName },
        });
        if (!attachment) {
            throw new common_1.NotFoundException('MediaFile not found');
        }
        try {
            await this.prisma.mediaFile.delete({
                where: { id: attachment.id },
            });
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException('MediaFile not found');
            }
            throw error;
        }
    }
};
exports.MediaFileService = MediaFileService;
exports.MediaFileService = MediaFileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MediaFileService);
//# sourceMappingURL=media-file.service.js.map