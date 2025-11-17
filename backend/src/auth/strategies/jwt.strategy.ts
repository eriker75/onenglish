import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../database/prisma.service';
import { JwtPayload } from '../definitions/JwtPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET')!,
    });
  }

  async validate(payload: JwtPayload) {
    const userId = payload.sub;

    if (!userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        isActive: true,
        isVerified: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'User is inactive, contact administrator',
      );
    }

    const roleHierarchy = ['admin', 'coordinator', 'teacher', 'employee', 'student'];
    const roles = (user.roles ?? [])
      .map((userRole) => userRole.role.name.toLowerCase())
      .sort((a, b) => {
        const indexA = roleHierarchy.indexOf(a);
        const indexB = roleHierarchy.indexOf(b);
        const safeIndexA = indexA === -1 ? roleHierarchy.length : indexA;
        const safeIndexB = indexB === -1 ? roleHierarchy.length : indexB;
        return safeIndexA - safeIndexB;
      });

    const uniqueRoles = Array.from(new Set(roles));
    const rolesString = uniqueRoles.join(',');

    const { roles: _roles, ...userData } = user;

    return {
      ...userData,
      roles: rolesString,
    };
  }
}
