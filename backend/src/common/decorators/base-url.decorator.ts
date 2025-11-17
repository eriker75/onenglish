import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const BaseUrl = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return `${request.protocol}://${request.get('host')}${request.path}`;
  },
);
