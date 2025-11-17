import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
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
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { QuerySchoolDto } from './dto/query-school.dto';
import { School } from './entities/school.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRole } from '../common/definitions/enums';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';

@ApiTags('Schools')
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Post()
  @Auth(ValidRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new school (Admin only) - Code is auto-generated',
  })
  @ApiResponse({
    status: 201,
    description: 'School successfully created with auto-generated code',
    type: School,
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
    description: 'Forbidden - User does not have admin role',
  })
  create(@Body() createSchoolDto: CreateSchoolDto): Promise<School> {
    return this.schoolsService.create(createSchoolDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all schools paginated' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of schools retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  findAll(
    @Query() query: QuerySchoolDto,
  ): Promise<PaginatedResponseDto<School>> {
    return this.schoolsService.findAllPaginated(query);
  }

  @Get('active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all active schools' })
  @ApiResponse({
    status: 200,
    description: 'List of active schools retrieved successfully',
    type: [School],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  findActive(): Promise<School[]> {
    return this.schoolsService.findActive();
  }

  @Get('code/:code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get school by code (e.g., SCH0001)' })
  @ApiResponse({
    status: 200,
    description: 'School retrieved successfully',
    type: School,
  })
  @ApiResponse({
    status: 404,
    description: 'School not found',
  })
  findByCode(@Param('code') code: string): Promise<School | null> {
    return this.schoolsService.findByCode(code);
  }

  @Get('school-id/:schoolId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get school by sequential school ID' })
  @ApiResponse({
    status: 200,
    description: 'School retrieved successfully',
    type: School,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid school ID',
  })
  @ApiResponse({
    status: 404,
    description: 'School not found',
  })
  findBySchoolId(@Param('schoolId') schoolId: string): Promise<School | null> {
    const schoolIdNumber = parseInt(schoolId, 10);
    if (isNaN(schoolIdNumber)) {
      throw new Error('Invalid school ID');
    }
    return this.schoolsService.findBySchoolId(schoolIdNumber);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get school by UUID' })
  @ApiResponse({
    status: 200,
    description: 'School retrieved successfully',
    type: School,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'School not found',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<School> {
    return this.schoolsService.findOne(id);
  }

  @Patch(':id')
  @Put(':id')
  @Auth(ValidRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update school (Admin only) - Code cannot be modified',
  })
  @ApiResponse({
    status: 200,
    description: 'School successfully updated',
    type: School,
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
    description: 'School not found',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSchoolDto: UpdateSchoolDto,
  ): Promise<School> {
    return this.schoolsService.update(id, updateSchoolDto);
  }

  @Delete(':id')
  @Auth(ValidRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete school (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'School successfully deleted',
    type: School,
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
    description: 'School not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Cannot delete school with associated entities',
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<School> {
    return this.schoolsService.remove(id);
  }

  @Post('import')
  @Auth(ValidRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
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
  async importSchools(
    @Body() dto: ImportFileDto,
  ): Promise<ImportResponseDto> {
    return this.schoolsService.importFromFile(dto.file);
  }
}
