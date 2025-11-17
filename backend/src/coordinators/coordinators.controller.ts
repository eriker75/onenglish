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
import { CoordinatorsService } from './coordinators.service';
import { CreateCoordinatorDto } from './dto/create-coordinator.dto';
import { UpdateCoordinatorDto } from './dto/update-coordinator.dto';
import { QueryCoordinatorDto } from './dto/query-coordinator.dto';
import { Coordinator } from './entities/coordinator.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { SchoolAuth } from '../auth/decorators/school-ownership.decorator';
import {
  SchoolRead,
  SkipSchoolReadCheck,
} from '../auth/decorators/school-read.decorator';
import { ValidRole } from '../common/definitions/enums';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';

@ApiTags('Coordinators')
@Controller('coordinators')
export class CoordinatorsController {
  constructor(private readonly coordinatorsService: CoordinatorsService) {}

  @Post()
  @SchoolAuth(ValidRole.ADMIN, ValidRole.COORDINATOR)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      'Create a new coordinator (Admin for any school, Coordinator only for their school)',
  })
  @ApiResponse({
    status: 201,
    description: 'Coordinator successfully created',
    type: Coordinator,
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
  @ApiResponse({
    status: 404,
    description: 'User or School not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Coordinator with same email already exists',
  })
  create(
    @Body() createCoordinatorDto: CreateCoordinatorDto,
  ): Promise<Coordinator> {
    return this.coordinatorsService.create(createCoordinatorDto);
  }

  @Get()
  @SkipSchoolReadCheck()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all coordinators paginated (public)' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of coordinators retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  findAll(
    @Query() query: QueryCoordinatorDto,
  ): Promise<PaginatedResponseDto<Coordinator>> {
    return this.coordinatorsService.findAllPaginated(query);
  }

  @Get('active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all active coordinators' })
  @ApiResponse({
    status: 200,
    description: 'List of active coordinators retrieved successfully',
    type: [Coordinator],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  findActive(): Promise<Coordinator[]> {
    return this.coordinatorsService.findActive();
  }

  @Get('school/:schoolId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get coordinators by school ID' })
  @ApiResponse({
    status: 200,
    description: 'List of coordinators from school retrieved successfully',
    type: [Coordinator],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid UUID format',
  })
  findBySchool(
    @Param('schoolId', ParseUUIDPipe) schoolId: string,
  ): Promise<Coordinator[]> {
    return this.coordinatorsService.findBySchool(schoolId);
  }

  @Get(':id')
  @SchoolRead(ValidRole.ADMIN, ValidRole.COORDINATOR, ValidRole.TEACHER)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Get coordinator by ID (Admin: any school, Coordinator/Teacher: only their school)',
  })
  @ApiResponse({
    status: 200,
    description: 'Coordinator retrieved successfully',
    type: Coordinator,
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
    description: 'Forbidden - Can only access coordinators from your school',
  })
  @ApiResponse({
    status: 404,
    description: 'Coordinator not found',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Coordinator> {
    return this.coordinatorsService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update coordinator (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Coordinator successfully updated',
    type: Coordinator,
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
    description: 'Coordinator or School not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Coordinator with same email already exists',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCoordinatorDto: UpdateCoordinatorDto,
  ): Promise<Coordinator> {
    return this.coordinatorsService.update(id, updateCoordinatorDto);
  }

  @Delete(':id')
  @Auth(ValidRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete coordinator (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Coordinator successfully deleted',
    type: Coordinator,
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
    description: 'Coordinator not found',
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<Coordinator> {
    return this.coordinatorsService.remove(id);
  }

  @Post('import')
  @Auth(ValidRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Import coordinators from CSV or Excel file',
    description: `
      Upload a CSV or Excel file to bulk import coordinators.
      Maximum file size: 100MB
      
      Required columns:
      - firstName: Coordinator first name
      - lastName: Coordinator last name
      - email: Coordinator email (unique)
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
  async importCoordinators(
    @Body() dto: ImportFileDto,
  ): Promise<ImportResponseDto> {
    return this.coordinatorsService.importFromFile(dto.file);
  }
}
