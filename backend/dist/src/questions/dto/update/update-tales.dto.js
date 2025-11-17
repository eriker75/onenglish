"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTalesDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_tales_dto_1 = require("../cretate/create-tales.dto");
class UpdateTalesDto extends (0, swagger_1.PartialType)(create_tales_dto_1.CreateTalesDto) {
}
exports.UpdateTalesDto = UpdateTalesDto;
//# sourceMappingURL=update-tales.dto.js.map