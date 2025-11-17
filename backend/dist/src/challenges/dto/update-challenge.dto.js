"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateChallengeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_challenge_dto_1 = require("./create-challenge.dto");
class UpdateChallengeDto extends (0, swagger_1.PartialType)(create_challenge_dto_1.CreateChallengeDto) {
}
exports.UpdateChallengeDto = UpdateChallengeDto;
//# sourceMappingURL=update-challenge.dto.js.map