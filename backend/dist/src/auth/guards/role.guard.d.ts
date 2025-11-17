import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
export declare class UserRoleGuard implements CanActivate {
    private readonly reflector;
    private readonly prisma;
    private readonly logger;
    constructor(reflector: Reflector, prisma: PrismaService);
    private getUserRoles;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
