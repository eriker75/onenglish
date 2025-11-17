import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { META_ROLES } from '../decorators/role.decorator';
import { PrismaService } from 'src/database/prisma.service';
import { AuthenticatedRequest } from 'src/common/definitions/interfaces/request.types';

@Injectable()
export class UserRoleGuard implements CanActivate {
  private readonly logger = new Logger(UserRoleGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

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

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handlerRoles = this.reflector.get<string[]>(
      META_ROLES,
      context.getHandler(),
    );
    const classRoles = this.reflector.get<string[]>(
      META_ROLES,
      context.getClass(),
    );
    const validRoles = handlerRoles && handlerRoles.length > 0 ? handlerRoles : classRoles;

    if (!validRoles || validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = req.user;

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const userRoles = await this.getUserRoles(user.id);
    const hasValidRole = validRoles.some((role) => userRoles.includes(role));

    this.logger.log(
      JSON.stringify(
        {
          userId: user.id,
          userRoles,
          classRoles,
          handlerRoles,
          effectiveRoles: validRoles,
          hasValidRole,
        },
        null,
        2,
      ),
    );

    if (!hasValidRole) {
      const userName =
        [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
      throw new ForbiddenException(
        `User ${userName} needs one of these roles: [${validRoles.join(', ')}]`,
      );
    }

    return true;
  }
}
