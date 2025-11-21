import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { QuestionsService } from '../services/questions.service';
import { QuestionStage } from '@prisma/client';
import { Question } from '../entities';

@ApiTags('Questions - Query')
@ApiBearerAuth()
@Controller('questions')
export class QuestionsQueryController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all questions with optional filters',
    description:
      'Retrieves all root-level questions (without parent) with optional filters by challengeId or stage.',
  })
  @ApiQuery({
    name: 'challengeId',
    required: false,
    description: 'Filter by challenge ID',
  })
  @ApiQuery({
    name: 'stage',
    required: false,
    enum: QuestionStage,
    description: 'Filter by question stage',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns filtered questions with sub-questions included',
    type: [Question],
  })
  findAll(
    @Query('challengeId') challengeId?: string,
    @Query('stage') stage?: QuestionStage,
  ) {
    return this.questionsService.findAll({ challengeId, stage });
  }

  @Get('challenge/:challengeId')
  @ApiOperation({
    summary: 'Get all questions for a specific challenge',
    description:
      'Retrieves all active, non-deleted questions for a challenge with optional filters by stage or type. Each question is formatted according to its type for optimal frontend consumption.',
  })
  @ApiQuery({
    name: 'stage',
    required: false,
    enum: QuestionStage,
    description: 'Filter by question stage (optional)',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter by question type (optional). Examples: image_to_multiple_choices, wordbox, spelling, unscramble, etc.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns formatted questions with sub-questions included',
    type: [Question],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - challenge not found',
  })
  findByChallengeId(
    @Param('challengeId') challengeId: string,
    @Query('stage') stage?: QuestionStage,
    @Query('type') type?: string,
  ) {
    const filters: {
      stage?: QuestionStage;
      type?: string;
    } = {};

    // Only add filters if they have valid non-empty values
    if (stage) {
      filters.stage = stage;
    }
    if (type && type.trim() !== '') {
      filters.type = type;
    }

    return this.questionsService.findByChallengeId(challengeId, filters);
  }

  @Get('schools/:schoolId/stats')
  @ApiOperation({
    summary: 'Get question statistics for a school',
    description:
      'Retrieves aggregated statistics for questions answered by students from a specific school. Includes total attempts, correct answers, average time, and success rate.',
  })
  @ApiQuery({
    name: 'questionId',
    required: false,
    description: 'Optional: filter stats for a specific question',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns aggregated question statistics',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          questionId: { type: 'string' },
          questionText: { type: 'string' },
          questionType: { type: 'string' },
          totalAttempts: { type: 'number' },
          correctAnswers: { type: 'number' },
          averageTime: {
            type: 'number',
            description: 'Average time in seconds',
          },
          successRate: {
            type: 'number',
            description: 'Success percentage (0-100)',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'School not found',
  })
  getSchoolStats(
    @Param('schoolId') schoolId: string,
    @Query('questionId') questionId?: string,
  ) {
    return this.questionsService.getSchoolStats(schoolId, questionId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a question by ID',
    description:
      'Retrieves a single question with all related data including sub-questions, parent question, and challenge.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the question with full details',
    type: Question,
  })
  @ApiResponse({
    status: 404,
    description: 'Question not found',
  })
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(id);
  }
}
