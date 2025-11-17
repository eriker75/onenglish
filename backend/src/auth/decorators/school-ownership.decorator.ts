import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/role.guard';
import { SchoolOwnershipGuard } from '../guards/school-ownership.guard';
import { RoleProtected } from './role.decorator';
import { ValidRole } from '../../common/definitions/enums';

/**
 * Decorator for endpoints that require school ownership validation
 * Allows ADMIN (any school) or COORDINATOR (only their school)
 */
export function SchoolAuth(...roles: ValidRole[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard('jwt'), UserRoleGuard, SchoolOwnershipGuard),
  );
}
