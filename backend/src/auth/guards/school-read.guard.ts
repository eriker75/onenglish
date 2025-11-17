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
import { SKIP_SCHOOL_READ_CHECK } from '../decorators/school-read.decorator';

/**
 * Guard to validate that teachers and coordinators can only read
 * data from their own school
 */
@Injectable()
export class SchoolReadGuard implements CanActivate {
  private readonly logger = new Logger(SchoolReadGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if endpoint has @SkipSchoolReadCheck()
    const skipCheck = this.reflector.get<boolean>(
      SKIP_SCHOOL_READ_CHECK,
      context.getHandler(),
    );

    if (skipCheck) {
      this.logger.log('Skipping school read check for this endpoint');
      return true;
    }

    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = req.user;

    if (!user) {
      throw new BadRequestException('User not found in request');
    }

    // Get user roles
    const userRoles = await this.getUserRoles(user.id);

    // Admin can read everything
    if (userRoles.includes('admin')) {
      this.logger.log(`Admin ${user.id} bypassing school read restriction`);
      return true;
    }

    // Students can read everything (for now)
    if (userRoles.includes('student')) {
      this.logger.log(`Student ${user.id} allowed to read`);
      return true;
    }

    // For teachers and coordinators, validate school ownership
    if (userRoles.includes('teacher') || userRoles.includes('coordinator')) {
      return await this.validateSchoolAccess(user.id, userRoles, req);
    }

    // Other roles: allow read access
    return true;
  }

  private async validateSchoolAccess(
    userId: string,
    userRoles: string[],
    req: AuthenticatedRequest,
  ): Promise<boolean> {
    let userSchoolId: string | null = null;

    // Get user's school based on their role
    if (userRoles.includes('coordinator')) {
      const coordinator = await this.prisma.coordinator.findUnique({
        where: { id: userId },
        select: { schoolId: true },
      });

      if (!coordinator) {
        throw new ForbiddenException('Coordinator profile not found');
      }

      userSchoolId = coordinator.schoolId;
    } else if (userRoles.includes('teacher')) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { id: userId },
        select: { schoolId: true },
      });

      if (!teacher) {
        throw new ForbiddenException('Teacher profile not found');
      }

      userSchoolId = teacher.schoolId;
    }

    if (!userSchoolId) {
      throw new ForbiddenException(
        'User must be assigned to a school to access this resource',
      );
    }

    // Get the target resource ID from params
    const resourceId = req.params.id;

    if (resourceId) {
      // Single resource access - validate it belongs to user's school
      return await this.validateSingleResourceAccess(
        resourceId,
        userSchoolId,
        req,
      );
    }

    // For list endpoints, we'll filter in the service layer
    // Store user's schoolId in request for service to use
    (req as any).userSchoolId = userSchoolId;
    this.logger.log(
      `User ${userId} restricted to school ${userSchoolId} for list access`,
    );
    return true;
  }

  private async validateSingleResourceAccess(
    resourceId: string,
    userSchoolId: string,
    req: AuthenticatedRequest,
  ): Promise<boolean> {
    const path = req.route?.path || req.url;

    let resourceSchoolId: string | null = null;

    // Determine resource type from path
    if (path.includes('/students/')) {
      const student = await this.prisma.student.findUnique({
        where: { id: resourceId },
        select: { schoolId: true },
      });
      resourceSchoolId = student?.schoolId || null;
    } else if (path.includes('/teachers/')) {
      const teacher = await this.prisma.teacher.findUnique({
        where: { id: resourceId },
        select: { schoolId: true },
      });
      resourceSchoolId = teacher?.schoolId || null;
    } else if (path.includes('/coordinators/')) {
      const coordinator = await this.prisma.coordinator.findUnique({
        where: { id: resourceId },
        select: { schoolId: true },
      });
      resourceSchoolId = coordinator?.schoolId || null;
    } else {
      // Other resources are not restricted
      return true;
    }

    if (!resourceSchoolId) {
      // Resource doesn't exist or doesn't have a school
      // Let the controller handle the 404
      return true;
    }

    if (resourceSchoolId !== userSchoolId) {
      throw new ForbiddenException(
        'You can only access resources from your own school',
      );
    }

    this.logger.log(
      `User authorized to access resource ${resourceId} in school ${userSchoolId}`,
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
