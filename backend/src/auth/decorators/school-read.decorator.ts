import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/role.guard';
import { SchoolReadGuard } from '../guards/school-read.guard';
import { RoleProtected } from './role.decorator';
import { ValidRole } from '../../common/definitions/enums';

export const SKIP_SCHOOL_READ_CHECK = 'skipSchoolReadCheck';

/**
 * Decorator for read endpoints that should be restricted by school
 * - ADMIN: Can read all schools
 * - COORDINATOR/TEACHER: Can only read from their own school
 * - STUDENT: Can read all (configurable)
 */
export function SchoolRead(...roles: ValidRole[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard('jwt'), UserRoleGuard, SchoolReadGuard),
  );
}

/**
 * Decorator to skip school read validation
 * Use for public endpoints that should not be restricted by school
 */
export function SkipSchoolReadCheck() {
  return SetMetadata(SKIP_SCHOOL_READ_CHECK, true);
}
