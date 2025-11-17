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
var SchoolsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchoolsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const create_school_dto_1 = require("./dto/create-school.dto");
const pagination_dto_1 = require("../common/dtos/pagination.dto");
const ExcelJS = __importStar(require("exceljs"));
const fs = __importStar(require("fs"));
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let SchoolsService = SchoolsService_1 = class SchoolsService {
    prisma;
    logger = new common_1.Logger(SchoolsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateSchoolCode() {
        const schools = await this.prisma.school.findMany({
            select: {
                code: true,
            },
        });
        if (schools.length === 0) {
            return 'SCH0001';
        }
        let maxNumber = 0;
        for (const school of schools) {
            const match = school.code.match(/^SCH(\d+)$/);
            if (match) {
                const number = parseInt(match[1], 10);
                if (number > maxNumber) {
                    maxNumber = number;
                }
            }
        }
        const nextNumber = maxNumber + 1;
        if (nextNumber > 9999) {
            const paddedNumber = nextNumber.toString().padStart(5, '0');
            return `SCH${paddedNumber}`;
        }
        const paddedNumber = nextNumber.toString().padStart(4, '0');
        return `SCH${paddedNumber}`;
    }
    async create(createSchoolDto) {
        try {
            const code = await this.generateSchoolCode();
            const school = await this.prisma.school.create({
                data: {
                    ...createSchoolDto,
                    code,
                    country: 'Venezuela',
                },
            });
            return school;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to create school: ${error.message}`);
        }
    }
    async findAll() {
        try {
            const schools = await this.prisma.school.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return schools;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch schools: ${error.message}`);
        }
    }
    async findAllPaginated(query) {
        try {
            const { limit = 10, offset = 0, search, isActive, name, code, schoolId, city, state, country, } = query;
            const where = {};
            if (isActive !== undefined) {
                where.isActive = isActive;
            }
            const searchConditions = [];
            if (search) {
                searchConditions.push({ name: { contains: search, mode: 'insensitive' } }, { code: { contains: search, mode: 'insensitive' } }, { address: { contains: search, mode: 'insensitive' } });
            }
            if (name) {
                searchConditions.push({
                    name: { contains: name, mode: 'insensitive' },
                });
            }
            if (code) {
                searchConditions.push({
                    code: { contains: code, mode: 'insensitive' },
                });
            }
            if (schoolId !== undefined) {
                searchConditions.push({
                    schoolId: schoolId,
                });
            }
            if (city) {
                searchConditions.push({
                    city: { contains: city, mode: 'insensitive' },
                });
            }
            if (state) {
                searchConditions.push({
                    state: { contains: state, mode: 'insensitive' },
                });
            }
            if (country) {
                searchConditions.push({
                    country: { contains: country, mode: 'insensitive' },
                });
            }
            if (searchConditions.length > 0) {
                where.OR = searchConditions;
            }
            const total = await this.prisma.school.count({ where });
            const schools = await this.prisma.school.findMany({
                where,
                include: {
                    _count: {
                        select: {
                            teachers: true,
                            students: true,
                            coordinators: true,
                            schoolChallenges: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: limit,
                skip: offset,
            });
            return new pagination_dto_1.PaginatedResponseDto(schools, total, limit, offset);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch paginated schools: ${error.message}`);
        }
    }
    async findOne(id) {
        try {
            const school = await this.prisma.school.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: {
                            teachers: true,
                            students: true,
                            coordinators: true,
                            schoolChallenges: true,
                        },
                    },
                },
            });
            if (!school) {
                throw new common_1.NotFoundException(`School with ID ${id} not found`);
            }
            return school;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to fetch school: ${error.message}`);
        }
    }
    async update(id, updateSchoolDto) {
        try {
            await this.findOne(id);
            const { ...updateData } = updateSchoolDto;
            const school = await this.prisma.school.update({
                where: { id },
                data: updateData,
            });
            return school;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to update school: ${error.message}`);
        }
    }
    async remove(id) {
        try {
            const school = await this.prisma.school.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: {
                            teachers: true,
                            students: true,
                            coordinators: true,
                            schoolChallenges: true,
                        },
                    },
                },
            });
            if (!school) {
                throw new common_1.NotFoundException(`School with ID ${id} not found`);
            }
            const hasRelations = school._count.teachers > 0 ||
                school._count.students > 0 ||
                school._count.coordinators > 0 ||
                school._count.schoolChallenges > 0;
            if (hasRelations) {
                throw new common_1.ConflictException('Cannot delete school with associated teachers, students, coordinators, or challenges. Please reassign or remove them first.');
            }
            const deletedSchool = await this.prisma.school.delete({
                where: { id },
            });
            return deletedSchool;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to delete school: ${error.message}`);
        }
    }
    async findByCode(code) {
        try {
            const school = await this.prisma.school.findUnique({
                where: { code },
                include: {
                    _count: {
                        select: {
                            teachers: true,
                            students: true,
                            coordinators: true,
                            schoolChallenges: true,
                        },
                    },
                },
            });
            if (!school) {
                throw new common_1.NotFoundException(`School with code ${code} not found`);
            }
            return school;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to fetch school by code: ${error.message}`);
        }
    }
    async findBySchoolId(schoolId) {
        try {
            const school = await this.prisma.school.findUnique({
                where: { schoolId },
                include: {
                    _count: {
                        select: {
                            teachers: true,
                            students: true,
                            coordinators: true,
                            schoolChallenges: true,
                        },
                    },
                },
            });
            if (!school) {
                throw new common_1.NotFoundException(`School with schoolId ${schoolId} not found`);
            }
            return school;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to fetch school by schoolId: ${error.message}`);
        }
    }
    async findActive() {
        try {
            const schools = await this.prisma.school.findMany({
                where: { isActive: true },
                orderBy: {
                    name: 'asc',
                },
            });
            return schools;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch active schools: ${error.message}`);
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
            this.logger.log(`Processing schools file with headers: ${headers.join(', ')}`);
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
                    const createDto = (0, class_transformer_1.plainToInstance)(create_school_dto_1.CreateSchoolDto, rowData);
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
                        this.logger.log(`Processed ${successCount} schools successfully`);
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
                    this.logger.warn(`Error processing school row ${rowNumber}: ${errorMessage}`);
                    if (errors.length >= 1000) {
                        this.logger.warn('Maximum error limit reached (1000). Stopping collection of errors.');
                        break;
                    }
                }
            }
            const processingTime = Date.now() - startTime;
            this.logger.log(`Schools import completed: ${successCount} success, ${errorCount} errors in ${processingTime}ms`);
            return {
                success: errorCount === 0,
                totalRows,
                successCount,
                errorCount,
                errors: errors.slice(0, 100),
                message: errorCount === 0
                    ? `Successfully imported ${successCount} schools`
                    : `Import completed with ${errorCount} errors out of ${totalRows} rows`,
                processingTime,
            };
        }
        catch (error) {
            const processingTime = Date.now() - startTime;
            this.logger.error(`Schools import failed: ${error.message}`, error.stack);
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
exports.SchoolsService = SchoolsService;
exports.SchoolsService = SchoolsService = SchoolsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SchoolsService);
//# sourceMappingURL=schools.service.js.map