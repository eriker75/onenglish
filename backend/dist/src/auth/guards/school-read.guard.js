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
var SchoolReadGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchoolReadGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_service_1 = require("../../database/prisma.service");
const school_read_decorator_1 = require("../decorators/school-read.decorator");
let SchoolReadGuard = SchoolReadGuard_1 = class SchoolReadGuard {
    reflector;
    prisma;
    logger = new common_1.Logger(SchoolReadGuard_1.name);
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const skipCheck = this.reflector.get(school_read_decorator_1.SKIP_SCHOOL_READ_CHECK, context.getHandler());
        if (skipCheck) {
            this.logger.log('Skipping school read check for this endpoint');
            return true;
        }
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        if (!user) {
            throw new common_1.BadRequestException('User not found in request');
        }
        const userRoles = await this.getUserRoles(user.id);
        if (userRoles.includes('admin')) {
            this.logger.log(`Admin ${user.id} bypassing school read restriction`);
            return true;
        }
        if (userRoles.includes('student')) {
            this.logger.log(`Student ${user.id} allowed to read`);
            return true;
        }
        if (userRoles.includes('teacher') || userRoles.includes('coordinator')) {
            return await this.validateSchoolAccess(user.id, userRoles, req);
        }
        return true;
    }
    async validateSchoolAccess(userId, userRoles, req) {
        let userSchoolId = null;
        if (userRoles.includes('coordinator')) {
            const coordinator = await this.prisma.coordinator.findUnique({
                where: { id: userId },
                select: { schoolId: true },
            });
            if (!coordinator) {
                throw new common_1.ForbiddenException('Coordinator profile not found');
            }
            userSchoolId = coordinator.schoolId;
        }
        else if (userRoles.includes('teacher')) {
            const teacher = await this.prisma.teacher.findUnique({
                where: { id: userId },
                select: { schoolId: true },
            });
            if (!teacher) {
                throw new common_1.ForbiddenException('Teacher profile not found');
            }
            userSchoolId = teacher.schoolId;
        }
        if (!userSchoolId) {
            throw new common_1.ForbiddenException('User must be assigned to a school to access this resource');
        }
        const resourceId = req.params.id;
        if (resourceId) {
            return await this.validateSingleResourceAccess(resourceId, userSchoolId, req);
        }
        req.userSchoolId = userSchoolId;
        this.logger.log(`User ${userId} restricted to school ${userSchoolId} for list access`);
        return true;
    }
    async validateSingleResourceAccess(resourceId, userSchoolId, req) {
        const path = req.route?.path || req.url;
        let resourceSchoolId = null;
        if (path.includes('/students/')) {
            const student = await this.prisma.student.findUnique({
                where: { id: resourceId },
                select: { schoolId: true },
            });
            resourceSchoolId = student?.schoolId || null;
        }
        else if (path.includes('/teachers/')) {
            const teacher = await this.prisma.teacher.findUnique({
                where: { id: resourceId },
                select: { schoolId: true },
            });
            resourceSchoolId = teacher?.schoolId || null;
        }
        else if (path.includes('/coordinators/')) {
            const coordinator = await this.prisma.coordinator.findUnique({
                where: { id: resourceId },
                select: { schoolId: true },
            });
            resourceSchoolId = coordinator?.schoolId || null;
        }
        else {
            return true;
        }
        if (!resourceSchoolId) {
            return true;
        }
        if (resourceSchoolId !== userSchoolId) {
            throw new common_1.ForbiddenException('You can only access resources from your own school');
        }
        this.logger.log(`User authorized to access resource ${resourceId} in school ${userSchoolId}`);
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
exports.SchoolReadGuard = SchoolReadGuard;
exports.SchoolReadGuard = SchoolReadGuard = SchoolReadGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], SchoolReadGuard);
//# sourceMappingURL=school-read.guard.js.map