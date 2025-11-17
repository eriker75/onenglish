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
var TeachersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeachersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const crypto_service_1 = require("../auth/services/crypto.service");
const create_teacher_dto_1 = require("./dto/create-teacher.dto");
const pagination_dto_1 = require("../common/dtos/pagination.dto");
const ExcelJS = __importStar(require("exceljs"));
const fs = __importStar(require("fs"));
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let TeachersService = TeachersService_1 = class TeachersService {
    prisma;
    cryptoService;
    logger = new common_1.Logger(TeachersService_1.name);
    constructor(prisma, cryptoService) {
        this.prisma = prisma;
        this.cryptoService = cryptoService;
    }
    async create(dto) {
        try {
            const existingTeacher = await this.prisma.teacher.findUnique({
                where: { email: dto.email },
            });
            if (existingTeacher) {
                throw new common_1.ConflictException(`Teacher with email ${dto.email} already exists`);
            }
            const user = await this.prisma.user.findUnique({
                where: { id: dto.userId },
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${dto.userId} not found`);
            }
            const existingTeacherByUser = await this.prisma.teacher.findUnique({
                where: { id: dto.userId },
            });
            if (existingTeacherByUser) {
                throw new common_1.ConflictException('User already has a teacher profile');
            }
            const school = await this.prisma.school.findUnique({
                where: { id: dto.schoolId },
            });
            if (!school) {
                throw new common_1.NotFoundException(`School with ID ${dto.schoolId} not found`);
            }
            let teacherRole = await this.prisma.role.findUnique({
                where: { name: 'teacher' },
            });
            if (!teacherRole) {
                teacherRole = await this.prisma.role.create({
                    data: {
                        name: 'teacher',
                        description: 'Teacher role',
                    },
                });
            }
            const updateData = {};
            if (dto.username) {
                const existingUsername = await this.prisma.user.findUnique({
                    where: { username: dto.username },
                });
                if (existingUsername && existingUsername.id !== dto.userId) {
                    throw new common_1.ConflictException(`Username ${dto.username} is already taken`);
                }
                updateData.username = dto.username;
            }
            if (dto.password) {
                updateData.password = this.cryptoService.hashDataForStorage(dto.password);
            }
            if (Object.keys(updateData).length > 0) {
                await this.prisma.user.update({
                    where: { id: dto.userId },
                    data: updateData,
                });
            }
            const existingRole = await this.prisma.userRole.findFirst({
                where: {
                    userId: dto.userId,
                    roleId: teacherRole.id,
                },
            });
            if (!existingRole) {
                await this.prisma.userRole.create({
                    data: {
                        userId: dto.userId,
                        roleId: teacherRole.id,
                    },
                });
            }
            const teacher = await this.prisma.teacher.create({
                data: {
                    id: dto.userId,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    email: dto.email,
                    phone: dto.phone,
                    avatar: dto.avatar,
                    bio: dto.bio,
                    schoolId: dto.schoolId,
                    isActive: dto.isActive ?? true,
                    userId: dto.userId,
                },
            });
            return teacher;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to create teacher: ${error.message}`);
        }
    }
    async findAll() {
        try {
            const teachers = await this.prisma.teacher.findMany({
                include: {
                    school: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return teachers;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch teachers: ${error.message}`);
        }
    }
    async findAllPaginated(query) {
        try {
            const { limit = 10, offset = 0, search, schoolId, isActive, firstName, lastName, email, } = query;
            const where = {};
            if (schoolId) {
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
            const total = await this.prisma.teacher.count({ where });
            const teachers = await this.prisma.teacher.findMany({
                where,
                include: {
                    school: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: limit,
                skip: offset,
            });
            return new pagination_dto_1.PaginatedResponseDto(teachers, total, limit, offset);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch paginated teachers: ${error.message}`);
        }
    }
    async findOne(id) {
        try {
            const teacher = await this.prisma.teacher.findUnique({
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
                },
            });
            if (!teacher) {
                throw new common_1.NotFoundException(`Teacher with ID ${id} not found`);
            }
            return teacher;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to fetch teacher: ${error.message}`);
        }
    }
    async update(id, dto) {
        try {
            await this.findOne(id);
            if (dto.email) {
                const existingTeacher = await this.prisma.teacher.findUnique({
                    where: { email: dto.email },
                });
                if (existingTeacher && existingTeacher.id !== id) {
                    throw new common_1.ConflictException(`Teacher with email ${dto.email} already exists`);
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
            const teacher = await this.prisma.teacher.update({
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
            return teacher;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to update teacher: ${error.message}`);
        }
    }
    async remove(id) {
        try {
            const teacher = await this.prisma.teacher.findUnique({
                where: { id },
            });
            if (!teacher) {
                throw new common_1.NotFoundException(`Teacher with ID ${id} not found`);
            }
            const deletedTeacher = await this.prisma.teacher.delete({
                where: { id },
            });
            return deletedTeacher;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to delete teacher: ${error.message}`);
        }
    }
    async findBySchool(schoolId) {
        try {
            const teachers = await this.prisma.teacher.findMany({
                where: { schoolId },
                orderBy: {
                    lastName: 'asc',
                },
            });
            return teachers;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch teachers by school: ${error.message}`);
        }
    }
    async findActive() {
        try {
            const teachers = await this.prisma.teacher.findMany({
                where: { isActive: true },
                include: {
                    school: true,
                },
                orderBy: {
                    lastName: 'asc',
                },
            });
            return teachers;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch active teachers: ${error.message}`);
        }
    }
    async importFromFile(file) {
        const startTime = Date.now();
        const errors = [];
        let totalRows = 0;
        let successCount = 0;
        let errorCount = 0;
        try {
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
            this.logger.log(`Processing teachers file with headers: ${headers.join(', ')}`);
            let rowNumber = 1;
            const totalRowCount = worksheet.rowCount || 0;
            if (totalRowCount < 2) {
                throw new common_1.BadRequestException('File must contain at least one data row');
            }
            const rows = worksheet.getRows(2, totalRowCount - 1);
            if (!rows) {
                throw new common_1.BadRequestException('Unable to read rows from file');
            }
            for await (const row of rows) {
                rowNumber++;
                totalRows++;
                try {
                    const rowData = {};
                    row.eachCell((cell, colNumber) => {
                        const header = headers[colNumber - 1];
                        if (header) {
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
                    const createDto = (0, class_transformer_1.plainToInstance)(create_teacher_dto_1.CreateTeacherDto, {
                        ...rowData,
                        userId: rowData.email,
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
                    await this.create(createDto);
                    successCount++;
                    if (successCount % 100 === 0) {
                        this.logger.log(`Processed ${successCount} teachers successfully`);
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
                    this.logger.warn(`Error processing teacher row ${rowNumber}: ${errorMessage}`);
                    if (errors.length >= 1000) {
                        this.logger.warn('Maximum error limit reached (1000). Stopping collection of errors.');
                        break;
                    }
                }
            }
            const processingTime = Date.now() - startTime;
            this.logger.log(`Teachers import completed: ${successCount} success, ${errorCount} errors in ${processingTime}ms`);
            return {
                success: errorCount === 0,
                totalRows,
                successCount,
                errorCount,
                errors: errors.slice(0, 100),
                message: errorCount === 0
                    ? `Successfully imported ${successCount} teachers`
                    : `Import completed with ${errorCount} errors out of ${totalRows} rows`,
                processingTime,
            };
        }
        catch (error) {
            const processingTime = Date.now() - startTime;
            this.logger.error(`Teachers import failed: ${error.message}`, error.stack);
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
exports.TeachersService = TeachersService;
exports.TeachersService = TeachersService = TeachersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        crypto_service_1.CryptoService])
], TeachersService);
//# sourceMappingURL=teachers.service.js.map