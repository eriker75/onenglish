import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { QueryStudentDto } from './dto/query-student.dto';
import { Student } from './entities/student.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { SchoolAuth } from '../auth/decorators/school-ownership.decorator';
import {
  SchoolRead,
  SkipSchoolReadCheck,
} from '../auth/decorators/school-read.decorator';
import { ValidRole } from '../common/definitions/enums';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';
import { ImportResponseDto } from '../common';
import { GetUser } from '../auth/decorators/user.decorator';
import type { User } from '../common/definitions/interfaces/user.types';
import { ImportStudentsDto } from './dto/import-students.dto';

@ApiTags('Students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @SchoolAuth(ValidRole.ADMIN, ValidRole.COORDINATOR)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      'Create a new student (Admin for any school, Coordinator only for their school)',
  })
  @ApiResponse({
    status: 201,
    description: 'Student successfully created',
    type: Student,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have required role',
  })
  @ApiResponse({
    status: 404,
    description: 'User or School not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Student with same email already exists',
  })
  create(
    @Body() createStudentDto: CreateStudentDto,
    @GetUser() user: User,
  ): Promise<Student> {
    return this.studentsService.create(createStudentDto, {
      requesterId: user.id,
      roles: user.roles,
    });
  }

  @Get()
  @SkipSchoolReadCheck()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all students paginated (public)' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of students retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  findAll(
    @Query() query: QueryStudentDto,
  ): Promise<PaginatedResponseDto<Student>> {
    return this.studentsService.findAllPaginated(query);
  }

  @Get('active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all active students' })
  @ApiResponse({
    status: 200,
    description: 'List of active students retrieved successfully',
    type: [Student],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  findActive(): Promise<Student[]> {
    return this.studentsService.findActive();
  }

  @Get('school/:schoolId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get students by school ID' })
  @ApiResponse({
    status: 200,
    description: 'List of students from school retrieved successfully',
    type: [Student],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid UUID format',
  })
  findBySchool(
    @Param('schoolId', ParseUUIDPipe) schoolId: string,
  ): Promise<Student[]> {
    return this.studentsService.findBySchool(schoolId);
  }

  @Get(':id')
  @SchoolRead(ValidRole.ADMIN, ValidRole.COORDINATOR, ValidRole.TEACHER)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Get student by ID (Admin: any school, Coordinator/Teacher: only their school)',
  })
  @ApiResponse({
    status: 200,
    description: 'Student retrieved successfully',
    type: Student,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid UUID format',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Can only access students from your school',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Student> {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update student (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Student successfully updated',
    type: Student,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data or UUID format',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have admin role',
  })
  @ApiResponse({
    status: 404,
    description: 'Student or School not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Student with same email already exists',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @Auth(ValidRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete student (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Student successfully deleted',
    type: Student,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid UUID format',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have admin role',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Cannot delete student with active challenges',
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<Student> {
    return this.studentsService.remove(id);
  }

  @Post('import')
  @Auth(ValidRole.ADMIN, ValidRole.COORDINATOR)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
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
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Import completed (may include errors for specific rows)',
    type: ImportResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file or file format',
  })
  @FormDataRequest()
  async importStudents(
    @Body() dto: ImportStudentsDto,
    @GetUser() user: User,
  ): Promise<ImportResponseDto> {
    return this.studentsService.importFromFile(dto.file, {
      requesterId: user.id,
      roles: user.roles,
      schoolIdFromRequest: dto.schoolId,
    });
  }
}
