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
exports.AdminsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const crypto_service_1 = require("../auth/services/crypto.service");
let AdminsService = class AdminsService {
    prisma;
    cryptoService;
    constructor(prisma, cryptoService) {
        this.prisma = prisma;
        this.cryptoService = cryptoService;
    }
    async create(dto) {
        try {
            const existingAdmin = await this.prisma.admin.findUnique({
                where: { email: dto.email },
            });
            if (existingAdmin) {
                throw new common_1.ConflictException(`Admin with email ${dto.email} already exists`);
            }
            const user = await this.prisma.user.findUnique({
                where: { id: dto.userId },
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${dto.userId} not found`);
            }
            const existingAdminByUser = await this.prisma.admin.findUnique({
                where: { id: dto.userId },
            });
            if (existingAdminByUser) {
                throw new common_1.ConflictException('User already has an admin profile');
            }
            let adminRole = await this.prisma.role.findUnique({
                where: { name: 'admin' },
            });
            if (!adminRole) {
                adminRole = await this.prisma.role.create({
                    data: {
                        name: 'admin',
                        description: 'Admin role',
                    },
                });
            }
            const updateData = {};
            if (dto.username) {
                const existingUsername = await this.prisma.user.findUnique({
                    where: { username: dto.username },
                });
                if (existingUsername && existingUsername.id !== dto.userId) {
                    throw new common_1.ConflictException(`Username ${dto.username} is already taken`);
                }
                updateData.username = dto.username;
            }
            if (dto.password) {
                updateData.password = this.cryptoService.hashDataForStorage(dto.password);
            }
            if (Object.keys(updateData).length > 0) {
                await this.prisma.user.update({
                    where: { id: dto.userId },
                    data: updateData,
                });
            }
            const existingRole = await this.prisma.userRole.findFirst({
                where: {
                    userId: dto.userId,
                    roleId: adminRole.id,
                },
            });
            if (!existingRole) {
                await this.prisma.userRole.create({
                    data: {
                        userId: dto.userId,
                        roleId: adminRole.id,
                    },
                });
            }
            const admin = await this.prisma.admin.create({
                data: {
                    id: dto.userId,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    email: dto.email,
                    phone: dto.phone,
                    avatar: dto.avatar,
                    bio: dto.bio,
                    isActive: dto.isActive ?? true,
                    userId: dto.userId,
                },
            });
            return admin;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to create admin: ${error.message}`);
        }
    }
    async findAll() {
        try {
            const admins = await this.prisma.admin.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return admins;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch admins: ${error.message}`);
        }
    }
    async findOne(id) {
        try {
            const admin = await this.prisma.admin.findUnique({
                where: { id },
                include: {
                    user: {
                        select: {
                            email: true,
                            username: true,
                            isActive: true,
                            isOnline: true,
                            lastLoginAt: true,
                        },
                    },
                },
            });
            if (!admin) {
                throw new common_1.NotFoundException(`Admin with ID ${id} not found`);
            }
            return admin;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to fetch admin: ${error.message}`);
        }
    }
    async update(id, dto) {
        try {
            await this.findOne(id);
            if (dto.email) {
                const existingAdmin = await this.prisma.admin.findUnique({
                    where: { email: dto.email },
                });
                if (existingAdmin && existingAdmin.id !== id) {
                    throw new common_1.ConflictException(`Admin with email ${dto.email} already exists`);
                }
            }
            const admin = await this.prisma.admin.update({
                where: { id },
                data: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    email: dto.email,
                    phone: dto.phone,
                    avatar: dto.avatar,
                    bio: dto.bio,
                    isActive: dto.isActive,
                },
            });
            return admin;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to update admin: ${error.message}`);
        }
    }
    async remove(id) {
        try {
            const admin = await this.prisma.admin.findUnique({
                where: { id },
            });
            if (!admin) {
                throw new common_1.NotFoundException(`Admin with ID ${id} not found`);
            }
            const deletedAdmin = await this.prisma.admin.delete({
                where: { id },
            });
            return deletedAdmin;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to delete admin: ${error.message}`);
        }
    }
    async findActive() {
        try {
            const admins = await this.prisma.admin.findMany({
                where: { isActive: true },
                orderBy: {
                    lastName: 'asc',
                },
            });
            return admins;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch active admins: ${error.message}`);
        }
    }
};
exports.AdminsService = AdminsService;
exports.AdminsService = AdminsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        crypto_service_1.CryptoService])
], AdminsService);
//# sourceMappingURL=admins.service.js.map