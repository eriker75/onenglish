import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { QuestionsService } from '../services/questions.service';
import { QuestionStage } from '@prisma/client';
import * as QuestionDtos from '../dto';
import { Question } from '../entities';

@ApiTags('Questions')
@ApiBearerAuth()
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // ==================== VOCABULARY ENDPOINTS ====================

  @Post('create/image_to_multiple_choices')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create an image to multiple choices question',
    description:
      'Creates a vocabulary question where students match an image to the correct word from multiple options. Default validation method: AUTO.',
  })
  @ApiResponse({
    status: 201,
    description: 'Question created successfully',
    type: Question,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  createImageToMultipleChoices(
    @Body() dto: QuestionDtos.CreateImageToMultipleChoicesDto,
  ) {
    return this.questionsService.createImageToMultipleChoices(dto);
  }

  @Post('create/wordbox')
  @ApiOperation({
    summary: 'Create a wordbox question',
    description:
      'Creates a vocabulary question where students build a word using a grid of letters. Default validation method: IA.',
  })
  @ApiResponse({
    status: 201,
    description: 'Question created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  createWordbox(@Body() dto: QuestionDtos.CreateWordboxDto) {
    return this.questionsService.createWordbox(dto);
  }

  @Post('create/spelling')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a spelling question',
    description:
      'Creates a vocabulary question where students spell the name of an object shown in an image or heard in audio. Default validation method: IA.',
  })
  @ApiResponse({
    status: 201,
    description: 'Question created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  createSpelling(@Body() dto: QuestionDtos.CreateSpellingDto) {
    return this.questionsService.createSpelling(dto);
  }

  @Post('create/word_associations')
  @ApiOperation({
    summary: 'Create a word associations question',
    description:
      'Creates a vocabulary question where students connect a target word with related concepts. Default validation method: IA.',
  })
  @ApiResponse({
    status: 201,
    description: 'Question created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  createWordAssociations(@Body() dto: QuestionDtos.CreateWordAssociationsDto) {
    return this.questionsService.createWordAssociations(dto);
  }

  // ==================== GRAMMAR ENDPOINTS ====================

  @Post('create/unscramble')
  @ApiOperation({
    summary: 'Create an unscramble sentence question',
    description:
      'Creates a grammar question where students reorder scrambled words to form a correct sentence. Default validation method: AUTO.',
  })
  @ApiResponse({
    status: 201,
    description: 'Question created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  createUnscramble(@Body() dto: QuestionDtos.CreateUnscrambleDto) {
    return this.questionsService.createUnscramble(dto);
  }

  @Post('create/tenses')
  @ApiOperation({
    summary: 'Create a verb tenses question',
    description:
      'Creates a grammar question where students identify or select the correct verb tense. Default validation method: AUTO.',
  })
  @ApiResponse({
    status: 201,
    description: 'Question created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  createTenses(@Body() dto: QuestionDtos.CreateTensesDto) {
    return this.questionsService.createTenses(dto);
  }

  @Post('create/tag_it')
  @ApiOperation({
    summary: 'Create a tag question',
    description:
      'Creates a grammar question where students complete a sentence with the correct question tag. Default validation method: AUTO.',
  })
  @ApiResponse({
    status: 201,
    description: 'Question created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  createTagIt(@Body() dto: QuestionDtos.CreateTagItDto) {
    return this.questionsService.createTagIt(dto);
  }

  @Post('create/report_it')
  @ApiOperation({
    summary: 'Create a reported speech question',
    description:
      'Creates a grammar question where students convert direct speech to reported speech. Default validation method: IA.',
  })
  @ApiResponse({
    status: 201,
    description: 'Question created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  createReportIt(@Body() dto: QuestionDtos.CreateReportItDto) {
    return this.questionsService.createReportIt(dto);
  }

  @Post('create/read_it')
  @ApiOperation({
    summary: 'Create a reading comprehension question with sub-questions',
    description:
      'Creates a grammar/reading question where students read a passage and answer true/false sub-questions. Default validation method: AUTO.',
  })
  @ApiResponse({
    status: 201,
    description: 'Question and sub-questions created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  createReadIt(@Body() dto: QuestionDtos.CreateReadItDto) {
    return this.questionsService.createReadIt(dto);
  }

  // ==================== LISTENING ENDPOINTS ====================

  @Post('create/word_match')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a word match listening question',
    description:
      'Creates a listening question where students match audio to the correct word. Default validation method: AUTO.',
  })
  @ApiResponse({
    status: 201,
    description: 'Question created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  createWordMatch(@Body() dto: QuestionDtos.CreateWordMatchDto) {
    return this.questionsService.createWordMatch(dto);
  }

  @Post('create/gossip')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a gossip (transcription) question',
    description:
      'Creates a listening question where students transcribe audio into English text. Default validation method: IA.',
  })
  @ApiResponse({
    status: 201,
    description: 'Question created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  createGossip(@Body() dto: QuestionDtos.CreateGossipDto) {
    return this.questionsService.createGossip(dto);
  }

  @Post('create/topic_based_audio')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a topic-based audio question with sub-questions',
    description:
      'Creates a listening question where students listen to audio and answer multiple-choice sub-questions. Default validation method: AUTO.',
  })
  @ApiResponse({
    status: 201,
    description: 'Question and sub-questions created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  createTopicBasedAudio(@Body() dto: QuestionDtos.CreateTopicBasedAudioDto) {
    return this.questionsService.createTopicBasedAudio(dto);
  }

  @Post('create/lyrics_training')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a lyrics training question',
    description:
      'Creates a listening question where students complete lyrics after listening to a song clip. Default validation method: AUTO.',
  })
  @ApiResponse({
    status: 201,
    description: 'Question created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  createLyricsTraining(@Body() dto: QuestionDtos.CreateLyricsTrainingDto) {
    return this.questionsService.createLyricsTraining(dto);
  }

  // ==================== WRITING ENDPOINTS ====================

  @Post('create/sentence_maker')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a sentence maker question',
    description:
      'Creates a writing question where students create a sentence inspired by provided images. Default validation method: IA.',
  })
  @ApiResponse({
    status: 201,
    description: 'Question created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  createSentenceMaker(@Body() dto: QuestionDtos.CreateSentenceMakerDto) {
    return this.questionsService.createSentenceMaker(dto);
  }

  @Post('create/fast_test')
  @ApiOperation({
    summary: 'Create a fast test question',
    description:
      'Creates a writing question where students complete a sentence by selecting the correct option. Default validation method: AUTO.',
  })
  @ApiResponse({
    status: 201,
    description: 'Question created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  createFastTest(@Body() dto: QuestionDtos.CreateFastTestDto) {
    return this.questionsService.createFastTest(dto);
  }

  @Post('create/tales')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a tales (story writing) question',
    description:
      'Creates a writing question where students write a short story based on provided images. Default validation method: IA.',
  })
  @ApiResponse({
    status: 201,
    description: 'Question created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  createTales(@Body() dto: QuestionDtos.CreateTalesDto) {
    return this.questionsService.createTales(dto);
  }

  // ==================== SPEAKING ENDPOINTS ====================

  @Post('create/superbrain')
  @ApiOperation({
    summary: 'Create a superbrain question',
    description:
      'Creates a speaking question where students respond to a prompt with a single audio response. Default validation method: IA.',
  })
  @ApiResponse({
    status: 201,
    description: 'Question created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  createSuperbrain(@Body() dto: QuestionDtos.CreateSuperbrainDto) {
    return this.questionsService.createSuperbrain(dto);
  }

  @Post('create/tell_me_about_it')
  @ApiOperation({
    summary: 'Create a tell me about it question',
    description:
      'Creates a speaking question where students create an audio story based on a prompt. Default validation method: IA.',
  })
  @ApiResponse({
    status: 201,
    description: 'Question created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  createTellMeAboutIt(@Body() dto: QuestionDtos.CreateTellMeAboutItDto) {
    return this.questionsService.createTellMeAboutIt(dto);
  }

  @Post('create/debate')
  @ApiOperation({
    summary: 'Create a debate question',
    description:
      'Creates a speaking question where students defend or oppose a provided statement with an audio argument. Default validation method: IA.',
  })
  @ApiResponse({
    status: 201,
    description: 'Question created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  createDebate(@Body() dto: QuestionDtos.CreateDebateDto) {
    return this.questionsService.createDebate(dto);
  }

  // ==================== QUERY ENDPOINTS ====================

  @Get()
  @ApiOperation({
    summary: 'Get all questions with optional filters',
    description:
      'Retrieves all root-level questions (without parent) with optional filters by challengeId, stage, or phase.',
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
  @ApiQuery({
    name: 'phase',
    required: false,
    description: 'Filter by phase identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns filtered questions with sub-questions included',
    type: [Question],
  })
  findAll(
    @Query('challengeId') challengeId?: string,
    @Query('stage') stage?: QuestionStage,
    @Query('phase') phase?: string,
  ) {
    return this.questionsService.findAll({ challengeId, stage, phase });
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
}
