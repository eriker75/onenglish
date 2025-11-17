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
exports.StudentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nestjs_form_data_1 = require("nestjs-form-data");
const students_service_1 = require("./students.service");
const create_student_dto_1 = require("./dto/create-student.dto");
const update_student_dto_1 = require("./dto/update-student.dto");
const query_student_dto_1 = require("./dto/query-student.dto");
const student_entity_1 = require("./entities/student.entity");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const school_ownership_decorator_1 = require("../auth/decorators/school-ownership.decorator");
const school_read_decorator_1 = require("../auth/decorators/school-read.decorator");
const enums_1 = require("../common/definitions/enums");
const common_2 = require("../common");
const user_decorator_1 = require("../auth/decorators/user.decorator");
const import_students_dto_1 = require("./dto/import-students.dto");
let StudentsController = class StudentsController {
    studentsService;
    constructor(studentsService) {
        this.studentsService = studentsService;
    }
    create(createStudentDto, user) {
        return this.studentsService.create(createStudentDto, {
            requesterId: user.id,
            roles: user.roles,
        });
    }
    findAll(query) {
        return this.studentsService.findAllPaginated(query);
    }
    findActive() {
        return this.studentsService.findActive();
    }
    findBySchool(schoolId) {
        return this.studentsService.findBySchool(schoolId);
    }
    findOne(id) {
        return this.studentsService.findOne(id);
    }
    update(id, updateStudentDto) {
        return this.studentsService.update(id, updateStudentDto);
    }
    remove(id) {
        return this.studentsService.remove(id);
    }
    async importStudents(dto, user) {
        return this.studentsService.importFromFile(dto.file, {
            requesterId: user.id,
            roles: user.roles,
            schoolIdFromRequest: dto.schoolId,
        });
    }
};
exports.StudentsController = StudentsController;
__decorate([
    (0, common_1.Post)(),
    (0, school_ownership_decorator_1.SchoolAuth)(enums_1.ValidRole.ADMIN, enums_1.ValidRole.COORDINATOR),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new student (Admin for any school, Coordinator only for their school)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Student successfully created',
        type: student_entity_1.Student,
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
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User or School not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict - Student with same email already exists',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_student_dto_1.CreateStudentDto, Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, school_read_decorator_1.SkipSchoolReadCheck)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all students paginated (public)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Paginated list of students retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_student_dto_1.QueryStudentDto]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active students' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of active students retrieved successfully',
        type: [student_entity_1.Student],
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('school/:schoolId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get students by school ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of students from school retrieved successfully',
        type: [student_entity_1.Student],
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid UUID format',
    }),
    __param(0, (0, common_1.Param)('schoolId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "findBySchool", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, school_read_decorator_1.SchoolRead)(enums_1.ValidRole.ADMIN, enums_1.ValidRole.COORDINATOR, enums_1.ValidRole.TEACHER),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get student by ID (Admin: any school, Coordinator/Teacher: only their school)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student retrieved successfully',
        type: student_entity_1.Student,
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
        description: 'Forbidden - Can only access students from your school',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Student not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, auth_decorator_1.Auth)(enums_1.ValidRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Update student (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student successfully updated',
        type: student_entity_1.Student,
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
        description: 'Student or School not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict - Student with same email already exists',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_student_dto_1.UpdateStudentDto]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, auth_decorator_1.Auth)(enums_1.ValidRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete student (Admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Student successfully deleted',
        type: student_entity_1.Student,
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
        description: 'Student not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Conflict - Cannot delete student with active challenges',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, auth_decorator_1.Auth)(enums_1.ValidRole.ADMIN, enums_1.ValidRole.COORDINATOR),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Import students from CSV or Excel file',
        description: `
      Upload a CSV or Excel file to bulk import students.
      Maximum file size: 100MB

      Required columns:
      - firstName: Student first name
      - lastName: Student last name
      - email: Student email (unique)
      
      Optional columns:
      - schoolId: UUID of the school (required if uploading as admin without providing the request-level schoolId)
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
    __param(1, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [import_students_dto_1.ImportStudentsDto, Object]),
    __metadata("design:returntype", Promise)
], StudentsController.prototype, "importStudents", null);
exports.StudentsController = StudentsController = __decorate([
    (0, swagger_1.ApiTags)('Students'),
    (0, common_1.Controller)('students'),
    __metadata("design:paramtypes", [students_service_1.StudentsService])
], StudentsController);
//# sourceMappingURL=students.controller.js.map