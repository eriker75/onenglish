"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSpellingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_spelling_dto_1 = require("../cretate/create-spelling.dto");
class UpdateSpellingDto extends (0, swagger_1.PartialType)(create_spelling_dto_1.CreateSpellingDto) {
}
exports.UpdateSpellingDto = UpdateSpellingDto;
//# sourceMappingURL=update-spelling.dto.js.map