"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGossipDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_gossip_dto_1 = require("../cretate/create-gossip.dto");
class UpdateGossipDto extends (0, swagger_1.PartialType)(create_gossip_dto_1.CreateGossipDto) {
}
exports.UpdateGossipDto = UpdateGossipDto;
//# sourceMappingURL=update-gossip.dto.js.map