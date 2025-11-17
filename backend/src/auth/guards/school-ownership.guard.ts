import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../database/prisma.service';
import { AuthenticatedRequest } from '../../common/definitions/interfaces/request.types';

@Injectable()
export class SchoolOwnershipGuard implements CanActivate {
  private readonly logger = new Logger(SchoolOwnershipGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = req.user;

    if (!user) {
      throw new BadRequestException('User not found in request');
    }

    // Get user roles
    const userRoles = await this.getUserRoles(user.id);

    // Admin can do anything
    if (userRoles.includes('admin')) {
      this.logger.log(`Admin ${user.id} bypassing school ownership check`);
      return true;
    }

    // Check if user is a coordinator
    if (!userRoles.includes('coordinator')) {
      throw new ForbiddenException(
        'Only coordinators and admins can perform this action',
      );
    }

    // Get coordinator's school
    const coordinator = await this.prisma.coordinator.findUnique({
      where: { id: user.id },
      select: { schoolId: true },
    });

    if (!coordinator) {
      throw new ForbiddenException('Coordinator profile not found');
    }

    if (!coordinator.schoolId) {
      throw new ForbiddenException('Coordinator must be assigned to a school');
    }

    // Get the schoolId from request body
    const body = req.body;
    const targetSchoolId = body.schoolId;

    if (!targetSchoolId) {
      throw new BadRequestException('schoolId is required in the request body');
    }

    // Verify coordinator belongs to the same school
    if (coordinator.schoolId !== targetSchoolId) {
      throw new ForbiddenException(
        'Coordinators can only add members to their own school',
      );
    }

    this.logger.log(
      `Coordinator ${user.id} authorized for school ${targetSchoolId}`,
    );
    return true;
  }

  private async getUserRoles(userId: string): Promise<string[]> {
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
      throw new BadRequestException('User not found');
    }

    return user.roles.map((userRole: any) => userRole.role.name);
  }
}
