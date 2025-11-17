"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseUrl = void 0;
const common_1 = require("@nestjs/common");
exports.BaseUrl = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return `${request.protocol}://${request.get('host')}${request.path}`;
});
//# sourceMappingURL=base-url.decorator.js.map