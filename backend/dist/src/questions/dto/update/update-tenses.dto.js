"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTensesDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_tenses_dto_1 = require("../cretate/create-tenses.dto");
class UpdateTensesDto extends (0, swagger_1.PartialType)(create_tenses_dto_1.CreateTensesDto) {
}
exports.UpdateTensesDto = UpdateTensesDto;
//# sourceMappingURL=update-tenses.dto.js.map