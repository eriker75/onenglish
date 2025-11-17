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

  @Post()
  @Auth(ValidRole.ADMIN, ValidRole.COORDINATOR)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new challenge (Admin or Coordinator only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Challenge successfully created',
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
  @ApiResponse({
    status: 409,
    description: 'Conflict - Challenge with same slug already exists',
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

  @Get('published')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all published and active challenges' })
  @ApiResponse({
    status: 200,
    description: 'List of published challenges retrieved successfully',
    type: [Challenge],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  findPublished(): Promise<Challenge[]> {
    return this.challengesService.findPublished();
  }

  @Get('category/:category')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get challenges by category' })
  @ApiResponse({
    status: 200,
    description: 'List of challenges by category retrieved successfully',
    type: [Challenge],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  findByCategory(@Param('category') category: string): Promise<Challenge[]> {
    return this.challengesService.findByCategory(category);
  }

  @Get('level/:level')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get challenges by level' })
  @ApiResponse({
    status: 200,
    description: 'List of challenges by level retrieved successfully',
    type: [Challenge],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  findByLevel(@Param('level') level: string): Promise<Challenge[]> {
    return this.challengesService.findByLevel(level);
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
  @ApiOperation({ summary: 'Update challenge (Admin or Coordinator only)' })
  @ApiResponse({
    status: 200,
    description: 'Challenge successfully updated',
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
  @ApiResponse({
    status: 409,
    description: 'Conflict - Challenge with same slug already exists',
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
