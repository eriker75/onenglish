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
exports.SchoolsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nestjs_form_data_1 = require("nestjs-form-data");
const common_2 = require("../common");
const schools_service_1 = require("./schools.service");
const create_school_dto_1 = require("./dto/create-school.dto");
const update_school_dto_1 = require("./dto/update-school.dto");
const query_school_dto_1 = require("./dto/query-school.dto");
const school_entity_1 = require("./entities/school.entity");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const enums_1 = require("../common/definitions/enums");
let SchoolsController = class SchoolsController {
    schoolsService;
    constructor(schoolsService) {
        this.schoolsService = schoolsService;
    }
    create(createSchoolDto) {
        return this.schoolsService.create(createSchoolDto);
    }
    findAll(query) {
        return this.schoolsService.findAllPaginated(query);
    }
    findActive() {
        return this.schoolsService.findActive();
    }
    findByCode(code) {
        return this.schoolsService.findByCode(code);
    }
    findBySchoolId(schoolId) {
        const schoolIdNumber = parseInt(schoolId, 10);
        if (isNaN(schoolIdNumber)) {
            throw new Error('Invalid school ID');
        }
        return this.schoolsService.findBySchoolId(schoolIdNumber);
    }
    findOne(id) {
        return this.schoolsService.findOne(id);
    }
    update(id, updateSchoolDto) {
        return this.schoolsService.update(id, updateSchoolDto);
    }
    remove(id) {
        return this.schoolsService.remove(id);
    }
    async importSchools(dto) {
        return this.schoolsService.importFromFile(dto.file);
    }
};
exports.SchoolsController = SchoolsController;
__decorate([
    (0, common_1.Post)(),
    (0, auth_decorator_1.Auth)(enums_1.ValidRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new school (Admin only) - Code is auto-generated',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'School successfully created with auto-generated code',
        type: school_entity_1.School,
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
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_school_dto_1.CreateSchoolDto]),
    __metadata("design:returntype", Promise)
], SchoolsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all schools paginated' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated list of schools retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_school_dto_1.QuerySchoolDto]),
    __metadata("design:returntype", Promise)
], SchoolsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active schools' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of active schools retrieved successfully',
        type: [school_entity_1.School],
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SchoolsController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get school by code (e.g., SCH0001)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'School retrieved successfully',
        type: school_entity_1.School,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'School not found',
    }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchoolsController.prototype, "findByCode", null);
__decorate([
    (0, common_1.Get)('school-id/:schoolId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get school by sequential school ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'School retrieved successfully',
        type: school_entity_1.School,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid school ID',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'School not found',
    }),
    __param(0, (0, common_1.Param)('schoolId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchoolsController.prototype, "findBySchoolId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get school by UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'School retrieved successfully',
        type: school_entity_1.School,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid UUID format',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'School not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchoolsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.Put)(':id'),
    (0, auth_decorator_1.Auth)(enums_1.ValidRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Update school (Admin only) - Code cannot be modified',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'School successfully updated',
        type: school_entity_1.School,
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
        description: 'School not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_school_dto_1.UpdateSchoolDto]),
    __metadata("design:returntype", Promise)
], SchoolsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorator_1.Auth)(enums_1.ValidRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete school (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'School successfully deleted',
        type: school_entity_1.School,
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
        description: 'School not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict - Cannot delete school with associated entities',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SchoolsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, auth_decorator_1.Auth)(enums_1.ValidRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Import schools from CSV or Excel file',
        description: `
      Upload a CSV or Excel file to bulk import schools.
      Maximum file size: 100MB
      
      Required columns:
      - name: School name
      - email: School email (unique)
      - phone: Phone number
      - city: City
      - state: State/Province
      - type: School type (e.g., public, private)
      
      Optional columns:
      - website: Website URL
      - address: Street address
      - postalCode: Postal code
      - description: School description
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
], SchoolsController.prototype, "importSchools", null);
exports.SchoolsController = SchoolsController = __decorate([
    (0, swagger_1.ApiTags)('Schools'),
    (0, common_1.Controller)('schools'),
    __metadata("design:paramtypes", [schools_service_1.SchoolsService])
], SchoolsController);
//# sourceMappingURL=schools.controller.js.map