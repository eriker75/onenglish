"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFastTestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_fast_test_dto_1 = require("../cretate/create-fast-test.dto");
class UpdateFastTestDto extends (0, swagger_1.PartialType)(create_fast_test_dto_1.CreateFastTestDto) {
}
exports.UpdateFastTestDto = UpdateFastTestDto;
//# sourceMappingURL=update-fast-test.dto.js.map