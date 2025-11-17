import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { QuerySchoolDto } from './dto/query-school.dto';
import { School } from './entities/school.entity';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';
import { Prisma } from '@prisma/client';
import { FileSystemStoredFile } from 'nestjs-form-data';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import { ImportResult, RowError } from '../common/interfaces/import-result.interface';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SchoolsService {
  private readonly logger = new Logger(SchoolsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generate the next school code in sequence (SCH0001, SCH0002, ..., SCH9999, SCH00001)
   */
  private async generateSchoolCode(): Promise<string> {
    // Get all schools and extract the highest code number
    const schools = await this.prisma.school.findMany({
      select: {
        code: true,
      },
    });

    if (schools.length === 0) {
      return 'SCH0001';
    }

    // Extract numeric parts and find the maximum
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

    // If we reach SCH9999, next is SCH00001 (5 digits)
    if (nextNumber > 9999) {
      const paddedNumber = nextNumber.toString().padStart(5, '0');
      return `SCH${paddedNumber}`;
    }

    // Otherwise, pad to 4 digits
    const paddedNumber = nextNumber.toString().padStart(4, '0');
    return `SCH${paddedNumber}`;
  }

  async create(createSchoolDto: CreateSchoolDto): Promise<School> {
    try {
      // Generate school code automatically
      const code = await this.generateSchoolCode();

      const school = await this.prisma.school.create({
        data: {
          ...createSchoolDto,
          code,
          country: 'Venezuela', // Default country
        },
      });

      return school;
    } catch (error) {
      throw new BadRequestException(
        `Failed to create school: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<School[]> {
    try {
      const schools = await this.prisma.school.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return schools;
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch schools: ${error.message}`,
      );
    }
  }

  async findAllPaginated(
    query: QuerySchoolDto,
  ): Promise<PaginatedResponseDto<School>> {
    try {
      const {
        limit = 10,
        offset = 0,
        search,
        isActive,
        name,
        code,
        schoolId,
        city,
        state,
        country,
      } = query;

      // Build where clause
      const where: Prisma.SchoolWhereInput = {};

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      // Build search conditions
      const searchConditions: Prisma.SchoolWhereInput[] = [];

      if (search) {
        searchConditions.push(
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
        );
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

      // Get total count
      const total = await this.prisma.school.count({ where });

      // Get paginated data
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

      return new PaginatedResponseDto(schools, total, limit, offset);
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch paginated schools: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<School> {
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
        throw new NotFoundException(`School with ID ${id} not found`);
      }

      return school;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to fetch school: ${error.message}`);
    }
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto): Promise<School> {
    try {
      // Check if school exists
      await this.findOne(id);

      // Don't allow updating the code as it's auto-generated
      const { ...updateData } = updateSchoolDto;

      const school = await this.prisma.school.update({
        where: { id },
        data: updateData,
      });

      return school;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update school: ${error.message}`,
      );
    }
  }

  async remove(id: string): Promise<School> {
    try {
      // Check if school exists and get related entities count
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
        throw new NotFoundException(`School with ID ${id} not found`);
      }

      const hasRelations =
        school._count.teachers > 0 ||
        school._count.students > 0 ||
        school._count.coordinators > 0 ||
        school._count.schoolChallenges > 0;

      if (hasRelations) {
        throw new ConflictException(
          'Cannot delete school with associated teachers, students, coordinators, or challenges. Please reassign or remove them first.',
        );
      }

      const deletedSchool = await this.prisma.school.delete({
        where: { id },
      });

      return deletedSchool;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete school: ${error.message}`,
      );
    }
  }

  async findByCode(code: string): Promise<School | null> {
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
        throw new NotFoundException(`School with code ${code} not found`);
      }

      return school;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to fetch school by code: ${error.message}`,
      );
    }
  }

  async findBySchoolId(schoolId: number): Promise<School | null> {
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
        throw new NotFoundException(
          `School with schoolId ${schoolId} not found`,
        );
      }

      return school;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to fetch school by schoolId: ${error.message}`,
      );
    }
  }

  async findActive(): Promise<School[]> {
    try {
      const schools = await this.prisma.school.findMany({
        where: { isActive: true },
        orderBy: {
          name: 'asc',
        },
      });

      return schools;
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch active schools: ${error.message}`,
      );
    }
  }

  /**
   * Import schools from CSV or Excel file
   */
  async importFromFile(file: FileSystemStoredFile): Promise<ImportResult> {
    const startTime = Date.now();
    const errors: RowError[] = [];
    let totalRows = 0;
    let successCount = 0;
    let errorCount = 0;

    try {
      const isCSV = file.originalName.toLowerCase().endsWith('.csv');
      const isExcel =
        file.originalName.toLowerCase().endsWith('.xlsx') ||
        file.originalName.toLowerCase().endsWith('.xls');

      if (!isCSV && !isExcel) {
        throw new BadRequestException(
          'Invalid file type. Only CSV and Excel files are supported.',
        );
      }

      const workbook = new ExcelJS.Workbook();

      if (isCSV) {
        const stream = fs.createReadStream(file.path);
        await workbook.csv.read(stream);
      } else {
        const stream = fs.createReadStream(file.path);
        await workbook.xlsx.read(stream);
      }

      const worksheet = workbook.worksheets[0];

      if (!worksheet) {
        throw new BadRequestException('File does not contain any data');
      }

      const headers: string[] = [];
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell, colNumber) => {
        headers[colNumber - 1] = cell.value?.toString().trim() || '';
      });

      this.logger.log(`Processing schools file with headers: ${headers.join(', ')}`);

      let rowNumber = 1;
      const totalRowCount = worksheet.rowCount || 0;

      if (totalRowCount < 2) {
        throw new BadRequestException('File must contain at least one data row');
      }

      const rows = worksheet.getRows(2, totalRowCount - 1);
      if (!rows) {
        throw new BadRequestException('Unable to read rows from file');
      }

      for await (const row of rows) {
        rowNumber++;
        totalRows++;

        try {
          const rowData: any = {};
          row.eachCell((cell, colNumber) => {
            const header = headers[colNumber - 1];
            if (header) {
              let value = cell.value;

              if (value && typeof value === 'object') {
                if ('text' in value) {
                  value = value.text;
                } else if ('result' in value) {
                  value = value.result;
                }
              }

              if (value === 'true' || value === 'TRUE') value = true;
              if (value === 'false' || value === 'FALSE') value = false;
              if (value === '' || value === null) value = undefined;

              rowData[header] = value;
            }
          });

          if (Object.keys(rowData).length === 0) {
            totalRows--;
            continue;
          }

          const createDto = plainToInstance(CreateSchoolDto, rowData);

          const validationErrors = await validate(createDto, {
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
        } catch (error) {
          errorCount++;
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';

          errors.push({
            row: rowNumber,
            error: errorMessage,
            data: row.values as Record<string, any>,
          });

          this.logger.warn(
            `Error processing school row ${rowNumber}: ${errorMessage}`,
          );

          if (errors.length >= 1000) {
            this.logger.warn(
              'Maximum error limit reached (1000). Stopping collection of errors.',
            );
            break;
          }
        }
      }

      const processingTime = Date.now() - startTime;

      this.logger.log(
        `Schools import completed: ${successCount} success, ${errorCount} errors in ${processingTime}ms`,
      );

      return {
        success: errorCount === 0,
        totalRows,
        successCount,
        errorCount,
        errors: errors.slice(0, 100),
        message:
          errorCount === 0
            ? `Successfully imported ${successCount} schools`
            : `Import completed with ${errorCount} errors out of ${totalRows} rows`,
        processingTime,
      };
    } catch (error) {
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
    } finally {
      try {
        await file.delete();
        this.logger.log('Temporary file deleted');
      } catch (error) {
        this.logger.warn(`Failed to delete temporary file: ${error.message}`);
      }
    }
  }
}
