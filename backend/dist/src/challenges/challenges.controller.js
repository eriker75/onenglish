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
exports.ChallengesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const challenges_service_1 = require("./challenges.service");
const create_challenge_dto_1 = require("./dto/create-challenge.dto");
const update_challenge_dto_1 = require("./dto/update-challenge.dto");
const query_challenge_dto_1 = require("./dto/query-challenge.dto");
const challenge_entity_1 = require("./entities/challenge.entity");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const school_read_decorator_1 = require("../auth/decorators/school-read.decorator");
const enums_1 = require("../common/definitions/enums");
let ChallengesController = class ChallengesController {
    challengesService;
    constructor(challengesService) {
        this.challengesService = challengesService;
    }
    create(createChallengeDto) {
        return this.challengesService.create(createChallengeDto);
    }
    findAll(query) {
        return this.challengesService.findAllPaginated(query);
    }
    findActive() {
        return this.challengesService.findActive();
    }
    findByGrade(grade) {
        return this.challengesService.findByGrade(grade);
    }
    findByType(type) {
        return this.challengesService.findByType(type);
    }
    findOne(id) {
        return this.challengesService.findOne(id);
    }
    update(id, updateChallengeDto) {
        return this.challengesService.update(id, updateChallengeDto);
    }
    remove(id) {
        return this.challengesService.remove(id);
    }
};
exports.ChallengesController = ChallengesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new challenge',
        description: 'Creates a new challenge. The name and year are automatically generated. Name format: "{year} - {Grade} - {Type} - Demo (if applicable)"',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Challenge successfully created. Name and year are auto-generated.',
        type: challenge_entity_1.Challenge,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid input data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing authentication token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - User does not have required role',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_challenge_dto_1.CreateChallengeDto]),
    __metadata("design:returntype", Promise)
], ChallengesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, school_read_decorator_1.SkipSchoolReadCheck)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all challenges paginated (public)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated list of challenges retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_challenge_dto_1.QueryChallengeDto]),
    __metadata("design:returntype", Promise)
], ChallengesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active challenges' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of active challenges retrieved successfully',
        type: [challenge_entity_1.Challenge],
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChallengesController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('grade/:grade'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get challenges by grade' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of challenges by grade retrieved successfully',
        type: [challenge_entity_1.Challenge],
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request',
    }),
    __param(0, (0, common_1.Param)('grade')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChallengesController.prototype, "findByGrade", null);
__decorate([
    (0, common_1.Get)('type/:type'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get challenges by type' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of challenges by type retrieved successfully',
        type: [challenge_entity_1.Challenge],
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request',
    }),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChallengesController.prototype, "findByType", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get challenge by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Challenge retrieved successfully',
        type: challenge_entity_1.Challenge,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid UUID format',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Challenge not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChallengesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, auth_decorator_1.Auth)(enums_1.ValidRole.ADMIN, enums_1.ValidRole.COORDINATOR),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Update challenge',
        description: 'Updates a challenge. If any of grade, type, isDemo, or exactDate are modified, the name will be automatically regenerated. Year is recalculated from exactDate if provided.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Challenge successfully updated. Name and year may be auto-regenerated based on changes.',
        type: challenge_entity_1.Challenge,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid input data or UUID format',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing authentication token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - User does not have required role',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Challenge not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_challenge_dto_1.UpdateChallengeDto]),
    __metadata("design:returntype", Promise)
], ChallengesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorator_1.Auth)(enums_1.ValidRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete challenge (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Challenge successfully deleted',
        type: challenge_entity_1.Challenge,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid UUID format',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - Invalid or missing authentication token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - User does not have admin role',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Challenge not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict - Cannot delete challenge with associated schools or students',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChallengesController.prototype, "remove", null);
exports.ChallengesController = ChallengesController = __decorate([
    (0, swagger_1.ApiTags)('Challenges'),
    (0, common_1.Controller)('challenges'),
    __metadata("design:paramtypes", [challenges_service_1.ChallengesService])
], ChallengesController);
//# sourceMappingURL=challenges.controller.js.map