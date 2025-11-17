"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRevisionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_revision_dto_1 = require("./create-revision.dto");
class UpdateRevisionDto extends (0, swagger_1.PartialType)(create_revision_dto_1.CreateRevisionDto) {
}
exports.UpdateRevisionDto = UpdateRevisionDto;
//# sourceMappingURL=update-revision.dto.js.map