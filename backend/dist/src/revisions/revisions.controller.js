"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevisionsController = void 0;
const common_1 = require("@nestjs/common");
const revisions_service_1 = require("./revisions.service");
const create_revision_dto_1 = require("./dto/create-revision.dto");
const update_revision_dto_1 = require("./dto/update-revision.dto");
let RevisionsController = class RevisionsController {
    revisionsService;
    constructor(revisionsService) {
        this.revisionsService = revisionsService;
    }
    create(createRevisionDto) {
        return this.revisionsService.create(createRevisionDto);
    }
    findAll() {
        return this.revisionsService.findAll();
    }
    findOne(id) {
        return this.revisionsService.findOne(+id);
    }
    update(id, updateRevisionDto) {
        return this.revisionsService.update(+id, updateRevisionDto);
    }
    remove(id) {
        return this.revisionsService.remove(+id);
    }
};
exports.RevisionsController = RevisionsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_revision_dto_1.CreateRevisionDto]),
    __metadata("design:returntype", void 0)
], RevisionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RevisionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RevisionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_revision_dto_1.UpdateRevisionDto]),
    __metadata("design:returntype", void 0)
], RevisionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RevisionsController.prototype, "remove", null);
exports.RevisionsController = RevisionsController = __decorate([
    (0, common_1.Controller)('revisions'),
    __metadata("design:paramtypes", [revisions_service_1.RevisionsService])
], RevisionsController);
//# sourceMappingURL=revisions.controller.js.map