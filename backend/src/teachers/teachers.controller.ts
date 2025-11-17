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
import { ImportFileDto, ImportResponseDto } from '../common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { QueryTeacherDto } from './dto/query-teacher.dto';
import { Teacher } from './entities/teacher.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { SchoolAuth } from '../auth/decorators/school-ownership.decorator';
import { SchoolRead, SkipSchoolReadCheck } from '../auth/decorators/school-read.decorator';
import { ValidRole } from '../common/definitions/enums';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';

@ApiTags('Teachers')
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @SchoolAuth(ValidRole.ADMIN, ValidRole.COORDINATOR)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      'Create a new teacher (Admin for any school, Coordinator only for their school)',
  })
  @ApiResponse({
    status: 201,
    description: 'Teacher successfully created',
    type: Teacher,
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
    description: 'Conflict - Teacher with same email already exists',
  })
  create(@Body() createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    return this.teachersService.create(createTeacherDto);
  }

  @Get()
  @SkipSchoolReadCheck()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all teachers paginated (public)' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of teachers retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  findAll(
    @Query() query: QueryTeacherDto,
  ): Promise<PaginatedResponseDto<Teacher>> {
    return this.teachersService.findAllPaginated(query);
  }

  @Get('active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all active teachers' })
  @ApiResponse({
    status: 200,
    description: 'List of active teachers retrieved successfully',
    type: [Teacher],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  findActive(): Promise<Teacher[]> {
    return this.teachersService.findActive();
  }

  @Get('school/:schoolId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get teachers by school ID' })
  @ApiResponse({
    status: 200,
    description: 'List of teachers from school retrieved successfully',
    type: [Teacher],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid UUID format',
  })
  findBySchool(
    @Param('schoolId', ParseUUIDPipe) schoolId: string,
  ): Promise<Teacher[]> {
    return this.teachersService.findBySchool(schoolId);
  }

  @Get(':id')
  @SchoolRead(ValidRole.ADMIN, ValidRole.COORDINATOR, ValidRole.TEACHER)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Get teacher by ID (Admin: any school, Coordinator/Teacher: only their school)',
  })
  @ApiResponse({
    status: 200,
    description: 'Teacher retrieved successfully',
    type: Teacher,
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
    description: 'Forbidden - Can only access teachers from your school',
  })
  @ApiResponse({
    status: 404,
    description: 'Teacher not found',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Teacher> {
    return this.teachersService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update teacher (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Teacher successfully updated',
    type: Teacher,
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
    description: 'Teacher or School not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Teacher with same email already exists',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ): Promise<Teacher> {
    return this.teachersService.update(id, updateTeacherDto);
  }

  @Delete(':id')
  @Auth(ValidRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete teacher (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Teacher successfully deleted',
    type: Teacher,
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
    description: 'Teacher not found',
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<Teacher> {
    return this.teachersService.remove(id);
  }

  @Post('import')
  @Auth(ValidRole.ADMIN, ValidRole.COORDINATOR)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Import teachers from CSV or Excel file',
    description: `
      Upload a CSV or Excel file to bulk import teachers.
      Maximum file size: 100MB
      
      Required columns:
      - firstName: Teacher first name
      - lastName: Teacher last name
      - email: Teacher email (unique)
      - schoolId: UUID of the school
      
      Optional columns:
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
  async importTeachers(
    @Body() dto: ImportFileDto,
  ): Promise<ImportResponseDto> {
    return this.teachersService.importFromFile(dto.file);
  }
}
