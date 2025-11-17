import { ValidRole } from 'src/common/definitions/enums';
export declare const META_ROLES = "roles";
export declare const RoleProtected: (...args: ValidRole[]) => import("@nestjs/common").CustomDecorator<string>;
