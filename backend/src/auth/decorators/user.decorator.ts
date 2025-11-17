import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { User } from '../../common/definitions/interfaces/user.types';
import { AuthenticatedRequest } from '../../common/definitions/interfaces/request.types';

export const GetUser = createParamDecorator<keyof User | undefined, unknown>(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const rawUser = req.user;

    if (!rawUser || typeof rawUser !== 'object') {
      throw new InternalServerErrorException('User not found (request)');
    }

    const user = rawUser as User;

    // No specific property requested -> return full user
    if (data === undefined) {
      return user as unknown;
    }

    // Specific property requested -> generic validation
    if (typeof data === 'string' && data in user) {
      return (user as Record<string, unknown>)[data];
    }

    throw new BadRequestException('Invalid user property requested');
  },
);
