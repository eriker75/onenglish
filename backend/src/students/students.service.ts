import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CryptoService } from '../auth/services/crypto.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { QueryStudentDto } from './dto/query-student.dto';
import { Student } from './entities/student.entity';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import {
  ImportResult,
  RowError,
} from '../common/interfaces/import-result.interface';
import { StudentRowData } from './interfaces/student-row-data.interface';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ValidRole } from '../common/definitions/enums';

type StudentCreationContext = {
  requesterId: string;
  dominantRole?: ValidRole;
  roles?: string;
  enforcedSchoolId?: string | null;
  skipSchoolValidation?: boolean;
};

@Injectable()
export class StudentsService {
  private readonly logger = new Logger(StudentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
  ) {}

  async create(
    dto: CreateStudentDto,
    context?: StudentCreationContext,
  ): Promise<Student> {
    try {
      const {
        firstName,
        lastName,
        email,
        username,
        password,
        phone,
        avatar,
        bio,
      } = dto;
      const isActive = dto.isActive ?? true;

      const existingUserByEmail = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUserByEmail) {
        throw new ConflictException(`User with email ${email} already exists`);
      }

      if (username) {
        const existingUserByUsername = await this.prisma.user.findUnique({
          where: { username },
        });
        if (existingUserByUsername) {
          throw new ConflictException(`Username ${username} is already taken`);
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
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create student: ${error.message}`,
      );
    }
  }

  private async ensureStudentRole() {
    return this.prisma.role.upsert({
      where: { name: 'student' },
      update: {},
      create: {
        name: 'student',
        description: 'Student role',
      },
    });
  }

  private async resolveSchoolId(
    dtoSchoolId: string | undefined,
    context?: StudentCreationContext,
  ): Promise<string | null> {
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

    const role =
      context.dominantRole ??
      (context.roles ? this.getDominantRole(context.roles) : ValidRole.STUDENT);

    switch (role) {
      case ValidRole.ADMIN: {
        const targetSchoolId = dtoSchoolId;
        if (!targetSchoolId) {
          throw new BadRequestException(
            'Admin users must provide a schoolId when creating students',
          );
        }
        if (!context.skipSchoolValidation) {
          await this.verifySchoolExists(targetSchoolId);
        }
        return targetSchoolId;
      }
      case ValidRole.COORDINATOR: {
        const coordinator = await this.prisma.coordinator.findUnique({
          where: { id: context.requesterId },
          select: { schoolId: true },
        });

        if (!coordinator || !coordinator.schoolId) {
          throw new BadRequestException(
            'Coordinator does not have an associated school',
          );
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

  private async verifySchoolExists(schoolId: string): Promise<void> {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
      select: { id: true },
    });

    if (!school) {
      throw new NotFoundException(`School with ID ${schoolId} not found`);
    }
  }

  private getDominantRole(roles: string): ValidRole {
    if (!roles) {
      return ValidRole.STUDENT;
    }

    const parsedRoles = roles
      .split(',')
      .map((role) => role.trim().toLowerCase())
      .filter(Boolean);

    const hierarchy = [
      ValidRole.ADMIN,
      ValidRole.COORDINATOR,
      ValidRole.TEACHER,
      ValidRole.EMPLOYEE,
      ValidRole.STUDENT,
    ];

    for (const role of hierarchy) {
      if (parsedRoles.includes(role)) {
        return role;
      }
    }

    return ValidRole.STUDENT;
  }

  async findAll(userSchoolId?: string): Promise<Student[]> {
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
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch students: ${error.message}`,
      );
    }
  }

  async findAllPaginated(
    query: QueryStudentDto,
    userSchoolId?: string,
  ): Promise<PaginatedResponseDto<Student>> {
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

      // If user has a school restriction, apply it
      if (userSchoolId) {
        where.schoolId = userSchoolId;
      } else if (schoolId) {
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
      const total = await this.prisma.student.count({ where });

      // Get paginated data
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

      return new PaginatedResponseDto(students, total, limit, offset);
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch paginated students: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<Student> {
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
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      return student;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to fetch student: ${error.message}`,
      );
    }
  }

  async update(id: string, dto: UpdateStudentDto): Promise<Student> {
    try {
      // Check if student exists
      await this.findOne(id);

      // Check if email is being changed and if it already exists
      if (dto.email) {
        const existingStudent = await this.prisma.student.findUnique({
          where: { email: dto.email },
        });

        if (existingStudent && existingStudent.id !== id) {
          throw new ConflictException(
            `Student with email ${dto.email} already exists`,
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
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update student: ${error.message}`,
      );
    }
  }

  async remove(id: string): Promise<Student> {
    try {
      // Check if student exists and get challenge count
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
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      if (student._count.studentChallenges > 0) {
        throw new ConflictException(
          'Cannot delete student with active challenges. Please remove or reassign challenges first.',
        );
      }

      const deletedStudent = await this.prisma.student.delete({
        where: { id },
      });

      return deletedStudent;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete student: ${error.message}`,
      );
    }
  }

  async findBySchool(schoolId: string): Promise<Student[]> {
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
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch students by school: ${error.message}`,
      );
    }
  }

  async findActive(userSchoolId?: string): Promise<Student[]> {
    try {
      const whereClause: any = { isActive: true };
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
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch active students: ${error.message}`,
      );
    }
  }

  // Legacy methods for backward compatibility
  async createStudent(dto: CreateStudentDto): Promise<Student> {
    return this.create(dto);
  }

  async findAllStudents(): Promise<Student[]> {
    return this.findAll();
  }

  async findOneStudent(id: string): Promise<Student> {
    return this.findOne(id);
  }

  async updateStudent(id: string, dto: UpdateStudentDto): Promise<Student> {
    return this.update(id, dto);
  }

  async removeStudent(id: string): Promise<Student> {
    return this.remove(id);
  }

  /**
   * Import students from CSV or Excel file
   */
  async importFromFile(
    file: FileSystemStoredFile,
    options: {
      requesterId: string;
      roles: string;
      schoolIdFromRequest?: string;
    },
  ): Promise<ImportResult> {
    const startTime = Date.now();
    const errors: RowError[] = [];
    let totalRows = 0;
    let successCount = 0;
    let errorCount = 0;

    try {
      const dominantRole = this.getDominantRole(options.roles);
      let baseContext: StudentCreationContext = {
        requesterId: options.requesterId,
        dominantRole,
        roles: options.roles,
      };

      let validatedDefaultSchoolId: string | null = null;

      if (dominantRole === ValidRole.ADMIN && options.schoolIdFromRequest) {
        await this.verifySchoolExists(options.schoolIdFromRequest);
        validatedDefaultSchoolId = options.schoolIdFromRequest;
      }

      if (dominantRole === ValidRole.COORDINATOR) {
        const coordinator = await this.prisma.coordinator.findUnique({
          where: { id: options.requesterId },
          select: { schoolId: true },
        });

        if (!coordinator || !coordinator.schoolId) {
          throw new BadRequestException(
            'Coordinator does not have an associated school for import',
          );
        }

        await this.verifySchoolExists(coordinator.schoolId);

        baseContext = {
          ...baseContext,
          enforcedSchoolId: coordinator.schoolId,
          skipSchoolValidation: true,
        };
      }

      // Determine file type
      const isCSV = file.originalName.toLowerCase().endsWith('.csv');
      const isExcel =
        file.originalName.toLowerCase().endsWith('.xlsx') ||
        file.originalName.toLowerCase().endsWith('.xls');

      if (!isCSV && !isExcel) {
        throw new BadRequestException(
          'Invalid file type. Only CSV and Excel files are supported.',
        );
      }

      // Create workbook
      const workbook = new ExcelJS.Workbook();

      if (isCSV) {
        const stream = fs.createReadStream(file.path);
        await workbook.csv.read(stream);
      } else {
        const stream = fs.createReadStream(file.path);
        await workbook.xlsx.read(stream);
      }

      // Get first worksheet
      const worksheet = workbook.worksheets[0];

      if (!worksheet) {
        throw new BadRequestException('File does not contain any data');
      }

      // Get headers from first row
      const headers: string[] = [];
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell, colNumber) => {
        headers[colNumber - 1] = cell.value?.toString().trim() || '';
      });

      this.logger.log(
        `Processing students file with headers: ${headers.join(', ')}`,
      );

      // Process rows using for await
      let rowNumber = 1;
      const totalRowCount = worksheet.rowCount || 0;

      if (totalRowCount < 2) {
        throw new BadRequestException(
          'File must contain at least one data row',
        );
      }

      const rows = worksheet.getRows(2, totalRowCount - 1);
      if (!rows) {
        throw new BadRequestException('Unable to read rows from file');
      }

      for (const row of rows) {
        rowNumber++;
        totalRows++;

        try {
          // Build row data object
          const rowData: any = {};
          row.eachCell((cell, colNumber) => {
            const header = headers[colNumber - 1];
            if (header && header !== 'userId' && header !== 'studentId') {
              let value = cell.value;

              // Handle special cell types
              if (value && typeof value === 'object') {
                if ('text' in value) {
                  value = value.text;
                } else if ('result' in value) {
                  value = value.result;
                }
              }

              // Convert boolean strings
              if (value === 'true' || value === 'TRUE') value = true;
              if (value === 'false' || value === 'FALSE') value = false;

              // Convert empty strings to undefined
              if (value === '' || value === null) value = undefined;

              rowData[header] = value;
            }
          });

          // Skip empty rows
          if (Object.keys(rowData).length === 0) {
            totalRows--;
            continue;
          }

          const normalizedRowData: StudentRowData = {
            ...rowData,
          };

          if (
            normalizedRowData.phone !== undefined &&
            normalizedRowData.phone !== null
          ) {
            normalizedRowData.phone = String(normalizedRowData.phone);
          }

          let effectiveSchoolId: string | null | undefined;

          if (baseContext.enforcedSchoolId !== undefined) {
            effectiveSchoolId = baseContext.enforcedSchoolId;
          } else {
            const rowSchoolId =
              typeof normalizedRowData.schoolId === 'string'
                ? normalizedRowData.schoolId
                : undefined;

            effectiveSchoolId =
              rowSchoolId ?? validatedDefaultSchoolId ?? undefined;

            if (
              dominantRole === ValidRole.ADMIN &&
              (effectiveSchoolId === undefined || effectiveSchoolId === null)
            ) {
              throw new Error(
                'Missing schoolId for student row. Provide it in the file or as a request parameter.',
              );
            }

            if (
              dominantRole !== ValidRole.ADMIN &&
              dominantRole !== ValidRole.COORDINATOR &&
              (effectiveSchoolId === undefined || effectiveSchoolId === null)
            ) {
              throw new Error('Missing schoolId for student row.');
            }
          }

          if (effectiveSchoolId) {
            normalizedRowData.schoolId = effectiveSchoolId;
          } else {
            delete normalizedRowData.schoolId;
          }

          // Create DTO instance for validation
          const createDto = plainToInstance(CreateStudentDto, {
            ...normalizedRowData,
          });

          // Validate DTO
          const validationErrors = await validate(createDto, {
            skipMissingProperties: true,
          });

          if (validationErrors.length > 0) {
            const errorMessages = validationErrors
              .map((error) => Object.values(error.constraints || {}).join(', '))
              .join('; ');
            throw new Error(errorMessages);
          }

          const rowContext =
            baseContext.enforcedSchoolId !== undefined
              ? baseContext
              : {
                  ...baseContext,
                  enforcedSchoolId:
                    effectiveSchoolId !== undefined
                      ? effectiveSchoolId
                      : undefined,
                  skipSchoolValidation:
                    !!validatedDefaultSchoolId &&
                    effectiveSchoolId === validatedDefaultSchoolId,
                };

          // Create student
          await this.create(createDto, rowContext);
          successCount++;

          // Log progress every 100 rows
          if (successCount % 100 === 0) {
            this.logger.log(`Processed ${successCount} students successfully`);
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
            `Error processing student row ${rowNumber}: ${errorMessage}`,
          );

          // Limit error collection to prevent memory issues
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
        `Students import completed: ${successCount} success, ${errorCount} errors in ${processingTime}ms`,
      );

      return {
        success: errorCount === 0,
        totalRows,
        successCount,
        errorCount,
        errors: errors.slice(0, 100),
        message:
          errorCount === 0
            ? `Successfully imported ${successCount} students`
            : `Import completed with ${errorCount} errors out of ${totalRows} rows`,
        processingTime,
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      this.logger.error(
        `Students import failed: ${error.message}`,
        error.stack,
      );

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
      // Clean up temporary file
      try {
        await file.delete();
        this.logger.log('Temporary file deleted');
      } catch (error) {
        this.logger.warn(`Failed to delete temporary file: ${error.message}`);
      }
    }
  }
}
