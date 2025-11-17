"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StudentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const crypto_service_1 = require("../auth/services/crypto.service");
const create_student_dto_1 = require("./dto/create-student.dto");
const pagination_dto_1 = require("../common/dtos/pagination.dto");
const ExcelJS = __importStar(require("exceljs"));
const fs = __importStar(require("fs"));
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../common/definitions/enums");
let StudentsService = StudentsService_1 = class StudentsService {
    prisma;
    cryptoService;
    logger = new common_1.Logger(StudentsService_1.name);
    constructor(prisma, cryptoService) {
        this.prisma = prisma;
        this.cryptoService = cryptoService;
    }
    async create(dto, context) {
        try {
            const { firstName, lastName, email, username, password, phone, avatar, bio, } = dto;
            const isActive = dto.isActive ?? true;
            const existingUserByEmail = await this.prisma.user.findUnique({
                where: { email },
            });
            if (existingUserByEmail) {
                throw new common_1.ConflictException(`User with email ${email} already exists`);
            }
            if (username) {
                const existingUserByUsername = await this.prisma.user.findUnique({
                    where: { username },
                });
                if (existingUserByUsername) {
                    throw new common_1.ConflictException(`Username ${username} is already taken`);
                }
            }
            const schoolId = await this.resolveSchoolId(dto.schoolId, context);
            const studentRole = await this.ensureStudentRole();
            const hashedPassword = password
                ? this.cryptoService.hashDataForStorage(password)
                : undefined;
            const student = await this.prisma.$transaction(async (tx) => {
                const newUser = await tx.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        firstName,
                        lastName,
                        username,
                        phone,
                        avatar,
                        bio,
                        isActive,
                        isVerified: false,
                        isOnline: false,
                    },
                });
                await tx.userRole.create({
                    data: {
                        userId: newUser.id,
                        roleId: studentRole.id,
                    },
                });
                return tx.student.create({
                    data: {
                        id: newUser.id,
                        firstName,
                        lastName,
                        email,
                        phone,
                        avatar,
                        bio,
                        schoolId,
                        isActive,
                        userId: newUser.id,
                    },
                });
            });
            return student;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to create student: ${error.message}`);
        }
    }
    async ensureStudentRole() {
        return this.prisma.role.upsert({
            where: { name: 'student' },
            update: {},
            create: {
                name: 'student',
                description: 'Student role',
            },
        });
    }
    async resolveSchoolId(dtoSchoolId, context) {
        if (!context) {
            if (!dtoSchoolId) {
                return null;
            }
            await this.verifySchoolExists(dtoSchoolId);
            return dtoSchoolId;
        }
        if (context.enforcedSchoolId !== undefined) {
            if (context.enforcedSchoolId && !context.skipSchoolValidation) {
                await this.verifySchoolExists(context.enforcedSchoolId);
            }
            return context.enforcedSchoolId ?? null;
        }
        const role = context.dominantRole ??
            (context.roles ? this.getDominantRole(context.roles) : enums_1.ValidRole.STUDENT);
        switch (role) {
            case enums_1.ValidRole.ADMIN: {
                const targetSchoolId = dtoSchoolId;
                if (!targetSchoolId) {
                    throw new common_1.BadRequestException('Admin users must provide a schoolId when creating students');
                }
                if (!context.skipSchoolValidation) {
                    await this.verifySchoolExists(targetSchoolId);
                }
                return targetSchoolId;
            }
            case enums_1.ValidRole.COORDINATOR: {
                const coordinator = await this.prisma.coordinator.findUnique({
                    where: { id: context.requesterId },
                    select: { schoolId: true },
                });
                if (!coordinator || !coordinator.schoolId) {
                    throw new common_1.BadRequestException('Coordinator does not have an associated school');
                }
                if (!context.skipSchoolValidation) {
                    await this.verifySchoolExists(coordinator.schoolId);
                }
                return coordinator.schoolId;
            }
            default: {
                if (!dtoSchoolId) {
                    return null;
                }
                if (!context.skipSchoolValidation) {
                    await this.verifySchoolExists(dtoSchoolId);
                }
                return dtoSchoolId;
            }
        }
    }
    async verifySchoolExists(schoolId) {
        const school = await this.prisma.school.findUnique({
            where: { id: schoolId },
            select: { id: true },
        });
        if (!school) {
            throw new common_1.NotFoundException(`School with ID ${schoolId} not found`);
        }
    }
    getDominantRole(roles) {
        if (!roles) {
            return enums_1.ValidRole.STUDENT;
        }
        const parsedRoles = roles
            .split(',')
            .map((role) => role.trim().toLowerCase())
            .filter(Boolean);
        const hierarchy = [
            enums_1.ValidRole.ADMIN,
            enums_1.ValidRole.COORDINATOR,
            enums_1.ValidRole.TEACHER,
            enums_1.ValidRole.EMPLOYEE,
            enums_1.ValidRole.STUDENT,
        ];
        for (const role of hierarchy) {
            if (parsedRoles.includes(role)) {
                return role;
            }
        }
        return enums_1.ValidRole.STUDENT;
    }
    async findAll(userSchoolId) {
        try {
            const whereClause = userSchoolId ? { schoolId: userSchoolId } : {};
            const students = await this.prisma.student.findMany({
                where: whereClause,
                include: {
                    school: true,
                    _count: {
                        select: {
                            studentChallenges: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return students;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch students: ${error.message}`);
        }
    }
    async findAllPaginated(query, userSchoolId) {
        try {
            const { limit = 10, offset = 0, search, schoolId, isActive, firstName, lastName, email, } = query;
            const where = {};
            if (userSchoolId) {
                where.schoolId = userSchoolId;
            }
            else if (schoolId) {
                where.schoolId = schoolId;
            }
            if (isActive !== undefined) {
                where.isActive = isActive;
            }
            const searchConditions = [];
            if (search) {
                searchConditions.push({ firstName: { contains: search, mode: 'insensitive' } }, { lastName: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } });
            }
            if (firstName) {
                searchConditions.push({
                    firstName: { contains: firstName, mode: 'insensitive' },
                });
            }
            if (lastName) {
                searchConditions.push({
                    lastName: { contains: lastName, mode: 'insensitive' },
                });
            }
            if (email) {
                searchConditions.push({
                    email: { contains: email, mode: 'insensitive' },
                });
            }
            if (searchConditions.length > 0) {
                where.OR = searchConditions;
            }
            const total = await this.prisma.student.count({ where });
            const students = await this.prisma.student.findMany({
                where,
                include: {
                    school: true,
                    _count: {
                        select: {
                            studentChallenges: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: limit,
                skip: offset,
            });
            return new pagination_dto_1.PaginatedResponseDto(students, total, limit, offset);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch paginated students: ${error.message}`);
        }
    }
    async findOne(id) {
        try {
            const student = await this.prisma.student.findUnique({
                where: { id },
                include: {
                    school: true,
                    user: {
                        select: {
                            email: true,
                            username: true,
                            isActive: true,
                            isOnline: true,
                            lastLoginAt: true,
                        },
                    },
                    _count: {
                        select: {
                            studentChallenges: true,
                        },
                    },
                },
            });
            if (!student) {
                throw new common_1.NotFoundException(`Student with ID ${id} not found`);
            }
            return student;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to fetch student: ${error.message}`);
        }
    }
    async update(id, dto) {
        try {
            await this.findOne(id);
            if (dto.email) {
                const existingStudent = await this.prisma.student.findUnique({
                    where: { email: dto.email },
                });
                if (existingStudent && existingStudent.id !== id) {
                    throw new common_1.ConflictException(`Student with email ${dto.email} already exists`);
                }
            }
            if (dto.schoolId) {
                const school = await this.prisma.school.findUnique({
                    where: { id: dto.schoolId },
                });
                if (!school) {
                    throw new common_1.NotFoundException(`School with ID ${dto.schoolId} not found`);
                }
            }
            const student = await this.prisma.student.update({
                where: { id },
                data: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    email: dto.email,
                    phone: dto.phone,
                    avatar: dto.avatar,
                    bio: dto.bio,
                    schoolId: dto.schoolId,
                    isActive: dto.isActive,
                },
            });
            return student;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to update student: ${error.message}`);
        }
    }
    async remove(id) {
        try {
            const student = await this.prisma.student.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: {
                            studentChallenges: true,
                        },
                    },
                },
            });
            if (!student) {
                throw new common_1.NotFoundException(`Student with ID ${id} not found`);
            }
            if (student._count.studentChallenges > 0) {
                throw new common_1.ConflictException('Cannot delete student with active challenges. Please remove or reassign challenges first.');
            }
            const deletedStudent = await this.prisma.student.delete({
                where: { id },
            });
            return deletedStudent;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to delete student: ${error.message}`);
        }
    }
    async findBySchool(schoolId) {
        try {
            const students = await this.prisma.student.findMany({
                where: { schoolId },
                include: {
                    _count: {
                        select: {
                            studentChallenges: true,
                        },
                    },
                },
                orderBy: {
                    lastName: 'asc',
                },
            });
            return students;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch students by school: ${error.message}`);
        }
    }
    async findActive(userSchoolId) {
        try {
            const whereClause = { isActive: true };
            if (userSchoolId) {
                whereClause.schoolId = userSchoolId;
            }
            const students = await this.prisma.student.findMany({
                where: whereClause,
                include: {
                    school: true,
                },
                orderBy: {
                    lastName: 'asc',
                },
            });
            return students;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch active students: ${error.message}`);
        }
    }
    async createStudent(dto) {
        return this.create(dto);
    }
    async findAllStudents() {
        return this.findAll();
    }
    async findOneStudent(id) {
        return this.findOne(id);
    }
    async updateStudent(id, dto) {
        return this.update(id, dto);
    }
    async removeStudent(id) {
        return this.remove(id);
    }
    async importFromFile(file, options) {
        const startTime = Date.now();
        const errors = [];
        let totalRows = 0;
        let successCount = 0;
        let errorCount = 0;
        try {
            const dominantRole = this.getDominantRole(options.roles);
            let baseContext = {
                requesterId: options.requesterId,
                dominantRole,
                roles: options.roles,
            };
            let validatedDefaultSchoolId = null;
            if (dominantRole === enums_1.ValidRole.ADMIN && options.schoolIdFromRequest) {
                await this.verifySchoolExists(options.schoolIdFromRequest);
                validatedDefaultSchoolId = options.schoolIdFromRequest;
            }
            if (dominantRole === enums_1.ValidRole.COORDINATOR) {
                const coordinator = await this.prisma.coordinator.findUnique({
                    where: { id: options.requesterId },
                    select: { schoolId: true },
                });
                if (!coordinator || !coordinator.schoolId) {
                    throw new common_1.BadRequestException('Coordinator does not have an associated school for import');
                }
                await this.verifySchoolExists(coordinator.schoolId);
                baseContext = {
                    ...baseContext,
                    enforcedSchoolId: coordinator.schoolId,
                    skipSchoolValidation: true,
                };
            }
            const isCSV = file.originalName.toLowerCase().endsWith('.csv');
            const isExcel = file.originalName.toLowerCase().endsWith('.xlsx') ||
                file.originalName.toLowerCase().endsWith('.xls');
            if (!isCSV && !isExcel) {
                throw new common_1.BadRequestException('Invalid file type. Only CSV and Excel files are supported.');
            }
            const workbook = new ExcelJS.Workbook();
            if (isCSV) {
                const stream = fs.createReadStream(file.path);
                await workbook.csv.read(stream);
            }
            else {
                const stream = fs.createReadStream(file.path);
                await workbook.xlsx.read(stream);
            }
            const worksheet = workbook.worksheets[0];
            if (!worksheet) {
                throw new common_1.BadRequestException('File does not contain any data');
            }
            const headers = [];
            const headerRow = worksheet.getRow(1);
            headerRow.eachCell((cell, colNumber) => {
                headers[colNumber - 1] = cell.value?.toString().trim() || '';
            });
            this.logger.log(`Processing students file with headers: ${headers.join(', ')}`);
            let rowNumber = 1;
            const totalRowCount = worksheet.rowCount || 0;
            if (totalRowCount < 2) {
                throw new common_1.BadRequestException('File must contain at least one data row');
            }
            const rows = worksheet.getRows(2, totalRowCount - 1);
            if (!rows) {
                throw new common_1.BadRequestException('Unable to read rows from file');
            }
            for (const row of rows) {
                rowNumber++;
                totalRows++;
                try {
                    const rowData = {};
                    row.eachCell((cell, colNumber) => {
                        const header = headers[colNumber - 1];
                        if (header && header !== 'userId' && header !== 'studentId') {
                            let value = cell.value;
                            if (value && typeof value === 'object') {
                                if ('text' in value) {
                                    value = value.text;
                                }
                                else if ('result' in value) {
                                    value = value.result;
                                }
                            }
                            if (value === 'true' || value === 'TRUE')
                                value = true;
                            if (value === 'false' || value === 'FALSE')
                                value = false;
                            if (value === '' || value === null)
                                value = undefined;
                            rowData[header] = value;
                        }
                    });
                    if (Object.keys(rowData).length === 0) {
                        totalRows--;
                        continue;
                    }
                    const normalizedRowData = {
                        ...rowData,
                    };
                    if (normalizedRowData.phone !== undefined &&
                        normalizedRowData.phone !== null) {
                        normalizedRowData.phone = String(normalizedRowData.phone);
                    }
                    let effectiveSchoolId;
                    if (baseContext.enforcedSchoolId !== undefined) {
                        effectiveSchoolId = baseContext.enforcedSchoolId;
                    }
                    else {
                        const rowSchoolId = typeof normalizedRowData.schoolId === 'string'
                            ? normalizedRowData.schoolId
                            : undefined;
                        effectiveSchoolId =
                            rowSchoolId ?? validatedDefaultSchoolId ?? undefined;
                        if (dominantRole === enums_1.ValidRole.ADMIN &&
                            (effectiveSchoolId === undefined || effectiveSchoolId === null)) {
                            throw new Error('Missing schoolId for student row. Provide it in the file or as a request parameter.');
                        }
                        if (dominantRole !== enums_1.ValidRole.ADMIN &&
                            dominantRole !== enums_1.ValidRole.COORDINATOR &&
                            (effectiveSchoolId === undefined || effectiveSchoolId === null)) {
                            throw new Error('Missing schoolId for student row.');
                        }
                    }
                    if (effectiveSchoolId) {
                        normalizedRowData.schoolId = effectiveSchoolId;
                    }
                    else {
                        delete normalizedRowData.schoolId;
                    }
                    const createDto = (0, class_transformer_1.plainToInstance)(create_student_dto_1.CreateStudentDto, {
                        ...normalizedRowData,
                    });
                    const validationErrors = await (0, class_validator_1.validate)(createDto, {
                        skipMissingProperties: true,
                    });
                    if (validationErrors.length > 0) {
                        const errorMessages = validationErrors
                            .map((error) => Object.values(error.constraints || {}).join(', '))
                            .join('; ');
                        throw new Error(errorMessages);
                    }
                    const rowContext = baseContext.enforcedSchoolId !== undefined
                        ? baseContext
                        : {
                            ...baseContext,
                            enforcedSchoolId: effectiveSchoolId !== undefined
                                ? effectiveSchoolId
                                : undefined,
                            skipSchoolValidation: !!validatedDefaultSchoolId &&
                                effectiveSchoolId === validatedDefaultSchoolId,
                        };
                    await this.create(createDto, rowContext);
                    successCount++;
                    if (successCount % 100 === 0) {
                        this.logger.log(`Processed ${successCount} students successfully`);
                    }
                }
                catch (error) {
                    errorCount++;
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    errors.push({
                        row: rowNumber,
                        error: errorMessage,
                        data: row.values,
                    });
                    this.logger.warn(`Error processing student row ${rowNumber}: ${errorMessage}`);
                    if (errors.length >= 1000) {
                        this.logger.warn('Maximum error limit reached (1000). Stopping collection of errors.');
                        break;
                    }
                }
            }
            const processingTime = Date.now() - startTime;
            this.logger.log(`Students import completed: ${successCount} success, ${errorCount} errors in ${processingTime}ms`);
            return {
                success: errorCount === 0,
                totalRows,
                successCount,
                errorCount,
                errors: errors.slice(0, 100),
                message: errorCount === 0
                    ? `Successfully imported ${successCount} students`
                    : `Import completed with ${errorCount} errors out of ${totalRows} rows`,
                processingTime,
            };
        }
        catch (error) {
            const processingTime = Date.now() - startTime;
            this.logger.error(`Students import failed: ${error.message}`, error.stack);
            return {
                success: false,
                totalRows,
                successCount,
                errorCount,
                errors,
                message: `Import failed: ${error.message}`,
                processingTime,
            };
        }
        finally {
            try {
                await file.delete();
                this.logger.log('Temporary file deleted');
            }
            catch (error) {
                this.logger.warn(`Failed to delete temporary file: ${error.message}`);
            }
        }
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = StudentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        crypto_service_1.CryptoService])
], StudentsService);
//# sourceMappingURL=students.service.js.map