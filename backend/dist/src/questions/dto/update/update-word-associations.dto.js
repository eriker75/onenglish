"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWordAssociationsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_word_associations_dto_1 = require("../cretate/create-word-associations.dto");
class UpdateWordAssociationsDto extends (0, swagger_1.PartialType)(create_word_associations_dto_1.CreateWordAssociationsDto) {
}
exports.UpdateWordAssociationsDto = UpdateWordAssociationsDto;
//# sourceMappingURL=update-word-associations.dto.js.map