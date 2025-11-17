"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWordboxDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_wordbox_dto_1 = require("../cretate/create-wordbox.dto");
class UpdateWordboxDto extends (0, swagger_1.PartialType)(create_wordbox_dto_1.CreateWordboxDto) {
}
exports.UpdateWordboxDto = UpdateWordboxDto;
//# sourceMappingURL=update-wordbox.dto.js.map