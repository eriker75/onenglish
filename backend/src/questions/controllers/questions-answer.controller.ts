import {
  Controller,
  Post,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { PrismaService } from '../../database/prisma.service';
import { QuestionValidationService } from '../services/question-validation.service';
import { Auth } from '../../auth/decorators/auth.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { ValidRole } from '../../common/definitions/enums';
import {
  AnswerImageToMultipleChoicesDto,
  AnswerWordboxDto,
  AnswerAudioQuestionDto,
  AnswerWordAssociationsDto,
  AnswerUnscrambleDto,
  AnswerTensesDto,
  AnswerTagItDto,
  AnswerReportItDto,
  AnswerReadItDto,
  AnswerWordMatchDto,
  AnswerTopicBasedAudioDto,
  AnswerLyricsTrainingDto,
  AnswerSentenceMakerDto,
  AnswerFastTestDto,
  AnswerTalesDto,
  AnswerDebateDto,
} from '../dto/answer';

interface ValidationResponseDto {
  success: boolean;
  isCorrect: boolean;
  pointsEarned: number;
  feedbackEnglish?: string;
  feedbackSpanish?: string;
  details?: any;
  studentAnswer: {
    id: string;
    questionId: string;
    studentId: string;
    isCorrect: boolean;
    pointsEarned: number;
    attemptNumber: number;
    timeSpent: number;
  };
}

@ApiTags('Questions - Answer')
@ApiBearerAuth()
@Auth(ValidRole.STUDENT)
@Controller('questions/answer')
export class QuestionsAnswerController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validationService: QuestionValidationService,
  ) {}

  private async processAnswer(
    questionId: string,
    userId: string,
    userAnswer: any,
    timeSpent?: number,
    audioFile?: any,
  ): Promise<ValidationResponseDto> {
    // Get question
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      select: { id: true, challengeId: true, maxAttempts: true, type: true },
    });

    if (!question) {
      throw new BadRequestException('Question not found');
    }

    // Get student record
    const student = await this.prisma.student.findFirst({
      where: { userId },
    });

    if (!student) {
      throw new BadRequestException('Student profile not found');
    }

    // Check attempts
    const previousAttempts = await this.prisma.studentAnswer.count({
      where: {
        questionId,
        studentId: student.id,
      },
    });

    if (previousAttempts >= question.maxAttempts) {
      throw new BadRequestException(
        `Maximum attempts (${question.maxAttempts}) reached for this question`,
      );
    }

    // Validate the answer
    const validation = await this.validationService.validateAnswer(
      questionId,
      userAnswer,
      audioFile,
    );

    // Save to StudentAnswer
    const studentAnswer = await this.prisma.studentAnswer.create({
      data: {
        studentId: student.id,
        questionId: question.id,
        challengeId: question.challengeId,
        userAnswer: audioFile ? { audioUrl: 'temp-url' } : userAnswer,
        isCorrect: validation.isCorrect,
        pointsEarned: validation.pointsEarned,
        attemptNumber: previousAttempts + 1,
        timeSpent: timeSpent || 0,
        feedbackEnglish: validation.feedbackEnglish,
        feedbackSpanish: validation.feedbackSpanish,
        audioUrl: audioFile ? `temp-audio-url-${Date.now()}` : null,
      },
    });

    return {
      success: true,
      isCorrect: validation.isCorrect,
      pointsEarned: validation.pointsEarned,
      feedbackEnglish: validation.feedbackEnglish,
      feedbackSpanish: validation.feedbackSpanish,
      details: validation.details,
      studentAnswer: {
        id: studentAnswer.id,
        questionId: studentAnswer.questionId,
        studentId: studentAnswer.studentId,
        isCorrect: studentAnswer.isCorrect,
        pointsEarned: studentAnswer.pointsEarned,
        attemptNumber: studentAnswer.attemptNumber,
        timeSpent: studentAnswer.timeSpent,
      },
    };
  }

  // ==================== VOCABULARY ====================

  @Post('image_to_multiple_choices/:id')
  @ApiOperation({
    summary: 'Answer image_to_multiple_choices question',
    description: 'Submit answer for an image to multiple choices question.',
  })
  @ApiResponse({
    status: 201,
    description: 'Answer submitted and validated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async answerImageToMultipleChoices(
    @Param('id') id: string,
    @Body() dto: AnswerImageToMultipleChoicesDto,
    @GetUser('id') userId: string,
  ): Promise<ValidationResponseDto> {
    return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
  }

  @Post('wordbox/:id')
  @ApiOperation({
    summary: 'Answer wordbox question',
    description: 'Submit answer for a wordbox question.',
  })
  @ApiResponse({
    status: 201,
    description: 'Answer submitted and validated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async answerWordbox(
    @Param('id') id: string,
    @Body() dto: AnswerWordboxDto,
    @GetUser('id') userId: string,
  ): Promise<ValidationResponseDto> {
    return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
  }

  @Post('spelling/:id')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Answer spelling question with audio',
    description: 'Submit audio recording spelling the word letter-by-letter.',
  })
  @ApiResponse({
    status: 201,
    description: 'Answer submitted and validated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async answerSpelling(
    @Param('id') id: string,
    @Body() dto: AnswerAudioQuestionDto,
    @GetUser('id') userId: string,
  ): Promise<ValidationResponseDto> {
    if (!dto.audio) {
      throw new BadRequestException('Audio file is required');
    }
    return this.processAnswer(id, userId, null, dto.timeSpent, dto.audio);
  }

  @Post('word_associations/:id')
  @ApiOperation({
    summary: 'Answer word_associations question',
    description: 'Submit array of associated words.',
  })
  @ApiResponse({
    status: 201,
    description: 'Answer submitted and validated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async answerWordAssociations(
    @Param('id') id: string,
    @Body() dto: AnswerWordAssociationsDto,
    @GetUser('id') userId: string,
  ): Promise<ValidationResponseDto> {
    return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
  }

  // ==================== GRAMMAR ====================

  @Post('unscramble/:id')
  @ApiOperation({
    summary: 'Answer unscramble question',
    description: 'Submit words in correct order.',
  })
  @ApiResponse({
    status: 201,
    description: 'Answer submitted and validated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async answerUnscramble(
    @Param('id') id: string,
    @Body() dto: AnswerUnscrambleDto,
    @GetUser('id') userId: string,
  ): Promise<ValidationResponseDto> {
    return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
  }

  @Post('tenses/:id')
  @ApiOperation({
    summary: 'Answer tenses question',
    description: 'Submit selected verb tense.',
  })
  @ApiResponse({
    status: 201,
    description: 'Answer submitted and validated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async answerTenses(
    @Param('id') id: string,
    @Body() dto: AnswerTensesDto,
    @GetUser('id') userId: string,
  ): Promise<ValidationResponseDto> {
    return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
  }

  @Post('tag_it/:id')
  @ApiOperation({
    summary: 'Answer tag_it question',
    description: 'Submit array of selected tags.',
  })
  @ApiResponse({
    status: 201,
    description: 'Answer submitted and validated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async answerTagIt(
    @Param('id') id: string,
    @Body() dto: AnswerTagItDto,
    @GetUser('id') userId: string,
  ): Promise<ValidationResponseDto> {
    return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
  }

  @Post('report_it/:id')
  @ApiOperation({
    summary: 'Answer report_it question',
    description: 'Submit written report/paragraph.',
  })
  @ApiResponse({
    status: 201,
    description: 'Answer submitted and validated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async answerReportIt(
    @Param('id') id: string,
    @Body() dto: AnswerReportItDto,
    @GetUser('id') userId: string,
  ): Promise<ValidationResponseDto> {
    return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
  }

  @Post('read_it/:id')
  @ApiOperation({
    summary: 'Answer read_it question',
    description: 'Submit answers for all sub-questions (true/false).',
  })
  @ApiResponse({
    status: 201,
    description: 'Answer submitted and validated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async answerReadIt(
    @Param('id') id: string,
    @Body() dto: AnswerReadItDto,
    @GetUser('id') userId: string,
  ): Promise<ValidationResponseDto> {
    return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
  }

  // ==================== LISTENING ====================

  @Post('word_match/:id')
  @ApiOperation({
    summary: 'Answer word_match question',
    description: 'Submit word-to-audio matches.',
  })
  @ApiResponse({
    status: 201,
    description: 'Answer submitted and validated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async answerWordMatch(
    @Param('id') id: string,
    @Body() dto: AnswerWordMatchDto,
    @GetUser('id') userId: string,
  ): Promise<ValidationResponseDto> {
    return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
  }

  @Post('gossip/:id')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Answer gossip question with audio',
    description: 'Submit audio recording repeating what you heard.',
  })
  @ApiResponse({
    status: 201,
    description: 'Answer submitted and validated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async answerGossip(
    @Param('id') id: string,
    @Body() dto: AnswerAudioQuestionDto,
    @GetUser('id') userId: string,
  ): Promise<ValidationResponseDto> {
    if (!dto.audio) {
      throw new BadRequestException('Audio file is required');
    }
    return this.processAnswer(id, userId, null, dto.timeSpent, dto.audio);
  }

  @Post('topic_based_audio/:id')
  @ApiOperation({
    summary: 'Answer topic_based_audio question',
    description: 'Submit answers for all sub-questions based on audio.',
  })
  @ApiResponse({
    status: 201,
    description: 'Answer submitted and validated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async answerTopicBasedAudio(
    @Param('id') id: string,
    @Body() dto: AnswerTopicBasedAudioDto,
    @GetUser('id') userId: string,
  ): Promise<ValidationResponseDto> {
    return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
  }

  @Post('lyrics_training/:id')
  @ApiOperation({
    summary: 'Answer lyrics_training question',
    description: 'Submit missing words filled in from song lyrics.',
  })
  @ApiResponse({
    status: 201,
    description: 'Answer submitted and validated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async answerLyricsTraining(
    @Param('id') id: string,
    @Body() dto: AnswerLyricsTrainingDto,
    @GetUser('id') userId: string,
  ): Promise<ValidationResponseDto> {
    return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
  }

  // ==================== WRITING ====================

  @Post('sentence_maker/:id')
  @ApiOperation({
    summary: 'Answer sentence_maker question',
    description: 'Submit written sentence describing images.',
  })
  @ApiResponse({
    status: 201,
    description: 'Answer submitted and validated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async answerSentenceMaker(
    @Param('id') id: string,
    @Body() dto: AnswerSentenceMakerDto,
    @GetUser('id') userId: string,
  ): Promise<ValidationResponseDto> {
    return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
  }

  @Post('fast_test/:id')
  @ApiOperation({
    summary: 'Answer fast_test question',
    description: 'Submit quick answer or completion.',
  })
  @ApiResponse({
    status: 201,
    description: 'Answer submitted and validated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async answerFastTest(
    @Param('id') id: string,
    @Body() dto: AnswerFastTestDto,
    @GetUser('id') userId: string,
  ): Promise<ValidationResponseDto> {
    return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
  }

  @Post('tales/:id')
  @ApiOperation({
    summary: 'Answer tales question',
    description: 'Submit creative story based on images.',
  })
  @ApiResponse({
    status: 201,
    description: 'Answer submitted and validated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async answerTales(
    @Param('id') id: string,
    @Body() dto: AnswerTalesDto,
    @GetUser('id') userId: string,
  ): Promise<ValidationResponseDto> {
    return this.processAnswer(id, userId, dto.userAnswer, dto.timeSpent);
  }

  // ==================== SPEAKING ====================

  @Post('superbrain/:id')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Answer superbrain question with audio',
    description: 'Submit audio recording responding to the prompt.',
  })
  @ApiResponse({
    status: 201,
    description: 'Answer submitted and validated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async answerSuperbrain(
    @Param('id') id: string,
    @Body() dto: AnswerAudioQuestionDto,
    @GetUser('id') userId: string,
  ): Promise<ValidationResponseDto> {
    if (!dto.audio) {
      throw new BadRequestException('Audio file is required');
    }
    return this.processAnswer(id, userId, null, dto.timeSpent, dto.audio);
  }

  @Post('tell_me_about_it/:id')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Answer tell_me_about_it question with audio',
    description: 'Submit audio recording telling a story.',
  })
  @ApiResponse({
    status: 201,
    description: 'Answer submitted and validated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async answerTellMeAboutIt(
    @Param('id') id: string,
    @Body() dto: AnswerAudioQuestionDto,
    @GetUser('id') userId: string,
  ): Promise<ValidationResponseDto> {
    if (!dto.audio) {
      throw new BadRequestException('Audio file is required');
    }
    return this.processAnswer(id, userId, null, dto.timeSpent, dto.audio);
  }

  @Post('debate/:id')
  @FormDataRequest()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Answer debate question with audio and stance',
    description:
      'Submit audio recording with your argument and your stance (support or oppose).',
  })
  @ApiResponse({
    status: 201,
    description: 'Answer submitted and validated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async answerDebate(
    @Param('id') id: string,
    @Body() dto: AnswerDebateDto,
    @GetUser('id') userId: string,
  ): Promise<ValidationResponseDto> {
    if (!dto.audio) {
      throw new BadRequestException('Audio file is required');
    }
    // Pass stance as userAnswer for validation context
    return this.processAnswer(id, userId, dto.stance, dto.timeSpent, dto.audio);
  }
}
