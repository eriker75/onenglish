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
exports.CoordinatorsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nestjs_form_data_1 = require("nestjs-form-data");
const common_2 = require("../common");
const coordinators_service_1 = require("./coordinators.service");
const create_coordinator_dto_1 = require("./dto/create-coordinator.dto");
const update_coordinator_dto_1 = require("./dto/update-coordinator.dto");
const query_coordinator_dto_1 = require("./dto/query-coordinator.dto");
const coordinator_entity_1 = require("./entities/coordinator.entity");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const school_ownership_decorator_1 = require("../auth/decorators/school-ownership.decorator");
const school_read_decorator_1 = require("../auth/decorators/school-read.decorator");
const enums_1 = require("../common/definitions/enums");
let CoordinatorsController = class CoordinatorsController {
    coordinatorsService;
    constructor(coordinatorsService) {
        this.coordinatorsService = coordinatorsService;
    }
    create(createCoordinatorDto) {
        return this.coordinatorsService.create(createCoordinatorDto);
    }
    findAll(query) {
        return this.coordinatorsService.findAllPaginated(query);
    }
    findActive() {
        return this.coordinatorsService.findActive();
    }
    findBySchool(schoolId) {
        return this.coordinatorsService.findBySchool(schoolId);
    }
    findOne(id) {
        return this.coordinatorsService.findOne(id);
    }
    update(id, updateCoordinatorDto) {
        return this.coordinatorsService.update(id, updateCoordinatorDto);
    }
    remove(id) {
        return this.coordinatorsService.remove(id);
    }
    async importCoordinators(dto) {
        return this.coordinatorsService.importFromFile(dto.file);
    }
};
exports.CoordinatorsController = CoordinatorsController;
__decorate([
    (0, common_1.Post)(),
    (0, school_ownership_decorator_1.SchoolAuth)(enums_1.ValidRole.ADMIN, enums_1.ValidRole.COORDINATOR),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new coordinator (Admin for any school, Coordinator only for their school)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Coordinator successfully created',
        type: coordinator_entity_1.Coordinator,
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
        description: 'Forbidden - User does not have admin role',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User or School not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict - Coordinator with same email already exists',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_coordinator_dto_1.CreateCoordinatorDto]),
    __metadata("design:returntype", Promise)
], CoordinatorsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, school_read_decorator_1.SkipSchoolReadCheck)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all coordinators paginated (public)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated list of coordinators retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_coordinator_dto_1.QueryCoordinatorDto]),
    __metadata("design:returntype", Promise)
], CoordinatorsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active coordinators' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of active coordinators retrieved successfully',
        type: [coordinator_entity_1.Coordinator],
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CoordinatorsController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('school/:schoolId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get coordinators by school ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of coordinators from school retrieved successfully',
        type: [coordinator_entity_1.Coordinator],
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid UUID format',
    }),
    __param(0, (0, common_1.Param)('schoolId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoordinatorsController.prototype, "findBySchool", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, school_read_decorator_1.SchoolRead)(enums_1.ValidRole.ADMIN, enums_1.ValidRole.COORDINATOR, enums_1.ValidRole.TEACHER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get coordinator by ID (Admin: any school, Coordinator/Teacher: only their school)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Coordinator retrieved successfully',
        type: coordinator_entity_1.Coordinator,
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
        description: 'Forbidden - Can only access coordinators from your school',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Coordinator not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoordinatorsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, auth_decorator_1.Auth)(enums_1.ValidRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update coordinator (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Coordinator successfully updated',
        type: coordinator_entity_1.Coordinator,
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
        description: 'Forbidden - User does not have admin role',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Coordinator or School not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict - Coordinator with same email already exists',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_coordinator_dto_1.UpdateCoordinatorDto]),
    __metadata("design:returntype", Promise)
], CoordinatorsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorator_1.Auth)(enums_1.ValidRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete coordinator (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Coordinator successfully deleted',
        type: coordinator_entity_1.Coordinator,
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
        description: 'Coordinator not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoordinatorsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, auth_decorator_1.Auth)(enums_1.ValidRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Import coordinators from CSV or Excel file',
        description: `
      Upload a CSV or Excel file to bulk import coordinators.
      Maximum file size: 100MB
      
      Required columns:
      - firstName: Coordinator first name
      - lastName: Coordinator last name
      - email: Coordinator email (unique)
      - schoolId: UUID of the school
      
      Optional columns:
      - username: Login username
      - password: Login password
      - phone: Phone number
      - avatar: Avatar URL
      - bio: Biography
      - isActive: Active status (true/false)
    `,
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Import completed (may include errors for specific rows)',
        type: common_2.ImportResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid file or file format',
    }),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [common_2.ImportFileDto]),
    __metadata("design:returntype", Promise)
], CoordinatorsController.prototype, "importCoordinators", null);
exports.CoordinatorsController = CoordinatorsController = __decorate([
    (0, swagger_1.ApiTags)('Coordinators'),
    (0, common_1.Controller)('coordinators'),
    __metadata("design:paramtypes", [coordinators_service_1.CoordinatorsService])
], CoordinatorsController);
//# sourceMappingURL=coordinators.controller.js.map