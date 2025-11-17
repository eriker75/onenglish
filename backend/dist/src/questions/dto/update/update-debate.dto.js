"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDebateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_debate_dto_1 = require("../cretate/create-debate.dto");
class UpdateDebateDto extends (0, swagger_1.PartialType)(create_debate_dto_1.CreateDebateDto) {
}
exports.UpdateDebateDto = UpdateDebateDto;
//# sourceMappingURL=update-debate.dto.js.map