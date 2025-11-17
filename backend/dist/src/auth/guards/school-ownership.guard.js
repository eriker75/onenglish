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
var SchoolOwnershipGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchoolOwnershipGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_service_1 = require("../../database/prisma.service");
let SchoolOwnershipGuard = SchoolOwnershipGuard_1 = class SchoolOwnershipGuard {
    reflector;
    prisma;
    logger = new common_1.Logger(SchoolOwnershipGuard_1.name);
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        if (!user) {
            throw new common_1.BadRequestException('User not found in request');
        }
        const userRoles = await this.getUserRoles(user.id);
        if (userRoles.includes('admin')) {
            this.logger.log(`Admin ${user.id} bypassing school ownership check`);
            return true;
        }
        if (!userRoles.includes('coordinator')) {
            throw new common_1.ForbiddenException('Only coordinators and admins can perform this action');
        }
        const coordinator = await this.prisma.coordinator.findUnique({
            where: { id: user.id },
            select: { schoolId: true },
        });
        if (!coordinator) {
            throw new common_1.ForbiddenException('Coordinator profile not found');
        }
        if (!coordinator.schoolId) {
            throw new common_1.ForbiddenException('Coordinator must be assigned to a school');
        }
        const body = req.body;
        const targetSchoolId = body.schoolId;
        if (!targetSchoolId) {
            throw new common_1.BadRequestException('schoolId is required in the request body');
        }
        if (coordinator.schoolId !== targetSchoolId) {
            throw new common_1.ForbiddenException('Coordinators can only add members to their own school');
        }
        this.logger.log(`Coordinator ${user.id} authorized for school ${targetSchoolId}`);
        return true;
    }
    async getUserRoles(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        return user.roles.map((userRole) => userRole.role.name);
    }
};
exports.SchoolOwnershipGuard = SchoolOwnershipGuard;
exports.SchoolOwnershipGuard = SchoolOwnershipGuard = SchoolOwnershipGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], SchoolOwnershipGuard);
//# sourceMappingURL=school-ownership.guard.js.map