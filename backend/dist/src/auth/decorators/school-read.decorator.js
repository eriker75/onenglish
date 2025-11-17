"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SKIP_SCHOOL_READ_CHECK = void 0;
exports.SchoolRead = SchoolRead;
exports.SkipSchoolReadCheck = SkipSchoolReadCheck;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const role_guard_1 = require("../guards/role.guard");
const school_read_guard_1 = require("../guards/school-read.guard");
const role_decorator_1 = require("./role.decorator");
exports.SKIP_SCHOOL_READ_CHECK = 'skipSchoolReadCheck';
function SchoolRead(...roles) {
    return (0, common_1.applyDecorators)((0, role_decorator_1.RoleProtected)(...roles), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), role_guard_1.UserRoleGuard, school_read_guard_1.SchoolReadGuard));
}
function SkipSchoolReadCheck() {
    return (0, common_1.SetMetadata)(exports.SKIP_SCHOOL_READ_CHECK, true);
}
//# sourceMappingURL=school-read.decorator.js.map