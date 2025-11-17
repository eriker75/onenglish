import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
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
} from '@nestjs/swagger';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { QueryChallengeDto } from './dto/query-challenge.dto';
import { Challenge } from './entities/challenge.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { SkipSchoolReadCheck } from '../auth/decorators/school-read.decorator';
import { ValidRole } from '../common/definitions/enums';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';

@ApiTags('Challenges')
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  /*   @Post()
  @Auth(ValidRole.ADMIN, ValidRole.COORDINATOR)
  @ApiBearerAuth() */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new challenge',
    description: 'Creates a new challenge. The name and year are automatically generated. Name format: "{year} - {Grade} - {Type} - Demo (if applicable)"',
  })
  @ApiResponse({
    status: 201,
    description: 'Challenge successfully created. Name and year are auto-generated.',
    type: Challenge,
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
  create(@Body() createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    return this.challengesService.create(createChallengeDto);
  }

  @Get()
  @SkipSchoolReadCheck()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all challenges paginated (public)' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of challenges retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  findAll(
    @Query() query: QueryChallengeDto,
  ): Promise<PaginatedResponseDto<Challenge>> {
    return this.challengesService.findAllPaginated(query);
  }

  @Get('active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all active challenges' })
  @ApiResponse({
    status: 200,
    description: 'List of active challenges retrieved successfully',
    type: [Challenge],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  findActive(): Promise<Challenge[]> {
    return this.challengesService.findActive();
  }

  @Get('grade/:grade')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get challenges by grade' })
  @ApiResponse({
    status: 200,
    description: 'List of challenges by grade retrieved successfully',
    type: [Challenge],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  findByGrade(@Param('grade') grade: string): Promise<Challenge[]> {
    return this.challengesService.findByGrade(grade);
  }

  @Get('type/:type')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get challenges by type' })
  @ApiResponse({
    status: 200,
    description: 'List of challenges by type retrieved successfully',
    type: [Challenge],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  findByType(@Param('type') type: string): Promise<Challenge[]> {
    return this.challengesService.findByType(type);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get challenge by ID' })
  @ApiResponse({
    status: 200,
    description: 'Challenge retrieved successfully',
    type: Challenge,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid UUID format',
  })
  @ApiResponse({
    status: 404,
    description: 'Challenge not found',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Challenge> {
    return this.challengesService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRole.ADMIN, ValidRole.COORDINATOR)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update challenge',
    description: 'Updates a challenge. If any of grade, type, isDemo, or exactDate are modified, the name will be automatically regenerated. Year is recalculated from exactDate if provided.',
  })
  @ApiResponse({
    status: 200,
    description: 'Challenge successfully updated. Name and year may be auto-regenerated based on changes.',
    type: Challenge,
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
    description: 'Forbidden - User does not have required role',
  })
  @ApiResponse({
    status: 404,
    description: 'Challenge not found',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateChallengeDto: UpdateChallengeDto,
  ): Promise<Challenge> {
    return this.challengesService.update(id, updateChallengeDto);
  }

  @Delete(':id')
  @Auth(ValidRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete challenge (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Challenge successfully deleted',
    type: Challenge,
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
    description: 'Challenge not found',
  })
  @ApiResponse({
    status: 409,
    description:
      'Conflict - Cannot delete challenge with associated schools or students',
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<Challenge> {
    return this.challengesService.remove(id);
  }
}
