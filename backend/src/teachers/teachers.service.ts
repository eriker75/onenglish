import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CryptoService } from '../auth/services/crypto.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { QueryTeacherDto } from './dto/query-teacher.dto';
import { Teacher } from './entities/teacher.entity';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import { ImportResult, RowError } from '../common/interfaces/import-result.interface';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TeachersService {
  private readonly logger = new Logger(TeachersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
  ) {}

  async create(dto: CreateTeacherDto): Promise<Teacher> {
    try {
      // Check if email already exists
      const existingTeacher = await this.prisma.teacher.findUnique({
        where: { email: dto.email },
      });

      if (existingTeacher) {
        throw new ConflictException(
          `Teacher with email ${dto.email} already exists`,
        );
      }

      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${dto.userId} not found`);
      }

      // Check if user already has a teacher profile
      const existingTeacherByUser = await this.prisma.teacher.findUnique({
        where: { id: dto.userId },
      });

      if (existingTeacherByUser) {
        throw new ConflictException('User already has a teacher profile');
      }

      // Check if school exists
      const school = await this.prisma.school.findUnique({
        where: { id: dto.schoolId },
      });

      if (!school) {
        throw new NotFoundException(`School with ID ${dto.schoolId} not found`);
      }

      // Get or create teacher role
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

      // Update user with teacher role and optional credentials
      const updateData: any = {};

      if (dto.username) {
        // Check username uniqueness
        const existingUsername = await this.prisma.user.findUnique({
          where: { username: dto.username },
        });
        if (existingUsername && existingUsername.id !== dto.userId) {
          throw new ConflictException(
            `Username ${dto.username} is already taken`,
          );
        }
        updateData.username = dto.username;
      }

      if (dto.password) {
        updateData.password = this.cryptoService.hashDataForStorage(
          dto.password,
        );
      }

      if (Object.keys(updateData).length > 0) {
        await this.prisma.user.update({
          where: { id: dto.userId },
          data: updateData,
        });
      }

      // Assign teacher role to user
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

      // Create teacher profile
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
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create teacher: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<Teacher[]> {
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
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch teachers: ${error.message}`,
      );
    }
  }

  async findAllPaginated(
    query: QueryTeacherDto,
  ): Promise<PaginatedResponseDto<Teacher>> {
    try {
      const {
        limit = 10,
        offset = 0,
        search,
        schoolId,
        isActive,
        firstName,
        lastName,
        email,
      } = query;

      // Build where clause
      const where: any = {};

      if (schoolId) {
        where.schoolId = schoolId;
      }

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      // Build search conditions
      const searchConditions: any[] = [];

      if (search) {
        searchConditions.push(
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        );
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

      // Get total count
      const total = await this.prisma.teacher.count({ where });

      // Get paginated data
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

      return new PaginatedResponseDto(teachers, total, limit, offset);
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch paginated teachers: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<Teacher> {
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
        throw new NotFoundException(`Teacher with ID ${id} not found`);
      }

      return teacher;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to fetch teacher: ${error.message}`,
      );
    }
  }

  async update(id: string, dto: UpdateTeacherDto): Promise<Teacher> {
    try {
      // Check if teacher exists
      await this.findOne(id);

      // Check if email is being changed and if it already exists
      if (dto.email) {
        const existingTeacher = await this.prisma.teacher.findUnique({
          where: { email: dto.email },
        });

        if (existingTeacher && existingTeacher.id !== id) {
          throw new ConflictException(
            `Teacher with email ${dto.email} already exists`,
          );
        }
      }

      // Check if school exists (if being updated)
      if (dto.schoolId) {
        const school = await this.prisma.school.findUnique({
          where: { id: dto.schoolId },
        });

        if (!school) {
          throw new NotFoundException(
            `School with ID ${dto.schoolId} not found`,
          );
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
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update teacher: ${error.message}`,
      );
    }
  }

  async remove(id: string): Promise<Teacher> {
    try {
      // Check if teacher exists
      const teacher = await this.prisma.teacher.findUnique({
        where: { id },
      });

      if (!teacher) {
        throw new NotFoundException(`Teacher with ID ${id} not found`);
      }

      const deletedTeacher = await this.prisma.teacher.delete({
        where: { id },
      });

      return deletedTeacher;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete teacher: ${error.message}`,
      );
    }
  }

  async findBySchool(schoolId: string): Promise<Teacher[]> {
    try {
      const teachers = await this.prisma.teacher.findMany({
        where: { schoolId },
        orderBy: {
          lastName: 'asc',
        },
      });

      return teachers;
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch teachers by school: ${error.message}`,
      );
    }
  }

  async findActive(): Promise<Teacher[]> {
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
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch active teachers: ${error.message}`,
      );
    }
  }

  /**
   * Import teachers from CSV or Excel file
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

      this.logger.log(`Processing teachers file with headers: ${headers.join(', ')}`);

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

          const createDto = plainToInstance(CreateTeacherDto, {
            ...rowData,
            userId: rowData.email,
          });

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
            this.logger.log(`Processed ${successCount} teachers successfully`);
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
            `Error processing teacher row ${rowNumber}: ${errorMessage}`,
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
        `Teachers import completed: ${successCount} success, ${errorCount} errors in ${processingTime}ms`,
      );

      return {
        success: errorCount === 0,
        totalRows,
        successCount,
        errorCount,
        errors: errors.slice(0, 100),
        message:
          errorCount === 0
            ? `Successfully imported ${successCount} teachers`
            : `Import completed with ${errorCount} errors out of ${totalRows} rows`,
        processingTime,
      };
    } catch (error) {
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
