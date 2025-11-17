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
var UserRoleGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleGuard = void 0;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const role_decorator_1 = require("../decorators/role.decorator");
const prisma_service_1 = require("../../database/prisma.service");
let UserRoleGuard = UserRoleGuard_1 = class UserRoleGuard {
    reflector;
    prisma;
    logger = new common_1.Logger(UserRoleGuard_1.name);
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
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
    async canActivate(context) {
        const handlerRoles = this.reflector.get(role_decorator_1.META_ROLES, context.getHandler());
        const classRoles = this.reflector.get(role_decorator_1.META_ROLES, context.getClass());
        const validRoles = handlerRoles && handlerRoles.length > 0 ? handlerRoles : classRoles;
        if (!validRoles || validRoles.length === 0)
            return true;
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const userRoles = await this.getUserRoles(user.id);
        const hasValidRole = validRoles.some((role) => userRoles.includes(role));
        this.logger.log(JSON.stringify({
            userId: user.id,
            userRoles,
            classRoles,
            handlerRoles,
            effectiveRoles: validRoles,
            hasValidRole,
        }, null, 2));
        if (!hasValidRole) {
            const userName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
            throw new common_1.ForbiddenException(`User ${userName} needs one of these roles: [${validRoles.join(', ')}]`);
        }
        return true;
    }
};
exports.UserRoleGuard = UserRoleGuard;
exports.UserRoleGuard = UserRoleGuard = UserRoleGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], UserRoleGuard);
//# sourceMappingURL=role.guard.js.map