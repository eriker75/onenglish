"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUser = void 0;
const common_1 = require("@nestjs/common");
exports.GetUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    const rawUser = req.user;
    if (!rawUser || typeof rawUser !== 'object') {
        throw new common_1.InternalServerErrorException('User not found (request)');
    }
    const user = rawUser;
    if (data === undefined) {
        return user;
    }
    if (typeof data === 'string' && data in user) {
        return user[data];
    }
    throw new common_1.BadRequestException('Invalid user property requested');
});
//# sourceMappingURL=user.decorator.js.map