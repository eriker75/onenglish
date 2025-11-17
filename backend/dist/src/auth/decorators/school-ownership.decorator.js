"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchoolAuth = SchoolAuth;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const role_guard_1 = require("../guards/role.guard");
const school_ownership_guard_1 = require("../guards/school-ownership.guard");
const role_decorator_1 = require("./role.decorator");
function SchoolAuth(...roles) {
    return (0, common_1.applyDecorators)((0, role_decorator_1.RoleProtected)(...roles), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), role_guard_1.UserRoleGuard, school_ownership_guard_1.SchoolOwnershipGuard));
}
//# sourceMappingURL=school-ownership.decorator.js.map