import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { QuestionsService } from '../services/questions.service';
import * as QuestionDtos from '../dto';
import { Question } from '../entities';
import { FormDataLoggingInterceptor } from 'src/common/interceptors/form-data-logging.interceptor';

@ApiTags('Questions - Creation')
@ApiBearerAuth()
@Controller('questions/create')
@UseInterceptors(FormDataLoggingInterceptor)
export class QuestionsCreationController {
  constructor(private readonly questionsService: QuestionsService) {}

  // ==================== VOCABULARY ENDPOINTS ====================

  @Post('image_to_multiple_choices')
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

  @Post('wordbox')
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

  @Post('spelling')
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

  @Post('word_associations')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a word associations question',
    description:
      'Creates a vocabulary question where students connect a target word with related concepts. Optionally include a reference image. Default validation method: IA.',
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
    const dtoAny = dto as any;
    console.log('[CONTROLLER] createWordAssociations called with DTO:', {
      challengeId: dto.challengeId,
      content: dto.content,
      maxAssociations: dtoAny.maxAssociations,
      maxAssociationsType: typeof dtoAny.maxAssociations,
      points: dto.points,
      hasMedia: !!dto.media,
    });
    return this.questionsService.createWordAssociations(dto);
  }

  // ==================== GRAMMAR ENDPOINTS ====================

  @Post('unscramble')
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

  @Post('tenses')
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

  @Post('tag_it')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a tag question',
    description:
      'Creates a grammar question where students complete a sentence with the correct question tag. Optionally include a reference image (PNG with transparency recommended). Default validation method: AUTO.',
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

  @Post('report_it')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a reported speech question',
    description:
      'Creates a grammar question where students convert direct speech to reported speech. Optionally include a reference image (PNG with transparency recommended). Default validation method: IA.',
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

  @Post('read_it')
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

  @Post('word_match')
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

  @Post('gossip')
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

  @Post('topic_based_audio')
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

  @Post('topic_based_audio_subquestion')
  @ApiOperation({
    summary: 'Create a topic-based audio subquestion',
    description:
      'Creates a single subquestion for a topic_based_audio question. The subquestion is a multiple-choice question about the audio content.',
  })
  @ApiResponse({
    status: 201,
    description: 'Subquestion created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  @ApiResponse({
    status: 404,
    description: 'Parent question not found',
  })
  createTopicBasedAudioSubquestion(
    @Body() dto: QuestionDtos.CreateTopicBasedAudioSubquestionDto,
  ) {
    return this.questionsService.createTopicBasedAudioSubquestion(dto);
  }

  @Post('lyrics_training')
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

  @Post('sentence_maker')
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

  @Post('fast_test')
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

  @Post('tales')
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

  @Post('superbrain')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a superbrain question',
    description:
      'Creates a speaking question where students respond to a prompt with a single audio response. Optionally includes a decorative reference image. Default validation method: IA.',
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

  @Post('tell_me_about_it')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Create a tell me about it question',
    description:
      'Creates a speaking question where students create an audio story based on a prompt. Optionally accepts a reference image. Default validation method: IA.',
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

  @Post('debate')
  @ApiOperation({
    summary: 'Create a debate question',
    description:
      'Creates a speaking question where students defend or oppose a provided statement with an audio argument. Default validation method: IA. The response includes the debate topic, minimum duration (90 seconds), and the assigned stance.',
  })
  @ApiResponse({
    status: 201,
    description: 'Question created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'ee6d6331-e681-4a50-a607-19f9b7ffbdd1' },
        type: { type: 'string', example: 'debate' },
        stage: { type: 'string', example: 'SPEAKING' },
        position: { type: 'number', example: 1 },
        points: { type: 'number', example: 20 },
        timeLimit: { type: 'number', example: 240 },
        maxAttempts: { type: 'number', example: 1 },
        text: {
          type: 'string',
          example: 'Defend or oppose the provided statement.',
        },
        instructions: {
          type: 'string',
          example:
            'Record an audio argument supporting or opposing the viewpoint.',
        },
        validationMethod: { type: 'string', example: 'IA' },
        topic: { type: 'string', example: 'Bubble gum' },
        minDuration: { type: 'number', example: 90 },
        stance: {
          type: 'string',
          example: 'support',
          enum: ['support', 'oppose'],
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-11-18T17:06:42.875Z',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          example: '2025-11-18T17:06:42.875Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - validation failed',
  })
  createDebate(@Body() dto: QuestionDtos.CreateDebateDto) {
    return this.questionsService.createDebate(dto);
  }
}
