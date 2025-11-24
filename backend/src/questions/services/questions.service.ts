import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { QuestionStage, ValidationMethod, Prisma } from '@prisma/client';
import { QuestionMediaService, QuestionFormatterService } from '.';
import * as QuestionDtos from '../dto';
import {
  getDefaultValidationMethod,
  getDefaultText,
  getDefaultInstructions,
} from '../helpers';
import { FormattedQuestion } from './types';

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly questionMediaService: QuestionMediaService,
    private readonly questionFormatterService: QuestionFormatterService,
  ) {}

  // ==================== HELPER METHODS ====================

  private async calculateNextPosition(
    challengeId: string,
    stage: QuestionStage,
  ): Promise<number> {
    const maxPosition = await this.prisma.question.findFirst({
      where: {
        challengeId,
        stage,
        parentQuestionId: null, // Only count root questions, not sub-questions
        deletedAt: null, // Exclude deleted questions
      },
      orderBy: {
        position: 'desc',
      },
      select: {
        position: true,
      },
    });

    return maxPosition ? maxPosition.position + 1 : 1;
  }

  private async attachConfigurations(
    questionId: string,
    configurations: Array<{ metaKey: string; metaValue: string }>,
  ) {
    if (!configurations?.length) return;

    await this.prisma.questionConfiguration.createMany({
      data: configurations.map((config) => ({
        questionId,
        ...config,
      })),
    });
  }

  /**
   * Validate that the wordbox grid doesn't contain repeated letters
   */
  private validateWordboxGrid(grid: string[][]): void {
    if (!grid || !Array.isArray(grid) || grid.length === 0) {
      throw new BadRequestException('Invalid wordbox grid structure');
    }

    // Flatten grid to get all letters (case-insensitive)
    const allLetters = grid
      .flat()
      .map((letter) => letter.toLowerCase());

    // Check for duplicates
    const letterSet = new Set(allLetters);

    if (letterSet.size !== allLetters.length) {
      // Find which letters are repeated
      const letterCounts: Record<string, number> = {};
      for (const letter of allLetters) {
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
      }

      const repeatedLetters = Object.entries(letterCounts)
        .filter(([_, count]) => count > 1)
        .map(([letter, count]) => `'${letter.toUpperCase()}' (${count} times)`)
        .join(', ');

      throw new BadRequestException(
        `Repeated letters found in wordbox grid: ${repeatedLetters}. Each letter must appear only once.`,
      );
    }
  }

  // ==================== VOCABULARY QUESTIONS ====================

  async createImageToMultipleChoices(
    dto: QuestionDtos.CreateImageToMultipleChoicesDto,
  ) {
    await this.validateChallenge(dto.challengeId);

    // Validate answer is in options (case-insensitive)
    const optionsLowerCase = dto.options.map((opt) => opt.toLowerCase());
    const answerLowerCase = dto.answer.toLowerCase();

    if (!optionsLowerCase.includes(answerLowerCase)) {
      throw new BadRequestException(
        `Answer "${dto.answer}" must be one of the options: ${dto.options.join(', ')}`,
      );
    }

    const questionType = 'image_to_multiple_choices';
    // image_to_multiple_choices is always VOCABULARY stage
    const stage = QuestionStage.VOCABULARY;

    // Auto-calculate position
    const position = await this.calculateNextPosition(
      dto.challengeId,
      stage,
    );

    // Upload single image file
    const uploadedFile = await this.questionMediaService.uploadSingleFile(
      dto.image,
    );

    // Create the question
    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || getDefaultText(questionType),
        instructions: dto.instructions || getDefaultInstructions(questionType),
        validationMethod: getDefaultValidationMethod(questionType),
        options: dto.options,
        answer: dto.answer,
        // Explicitly set status fields for new questions
        isActive: true,
        deletedAt: null,
      },
    });

    // Attach media file
    await this.questionMediaService.attachMediaFiles(question.id, [
      {
        id: uploadedFile.id,
        context: 'main',
        position: 0,
      },
    ]);

    // Return enriched question
    return this.findOne(question.id);
  }

  async createWordbox(dto: QuestionDtos.CreateWordboxDto) {
    await this.validateChallenge(dto.challengeId);

    // Validaciones ya se hacen en el DTO con el validador personalizado
    // Solo validamos que cada celda sea string
    const isValid = dto.content.every((row) =>
      row.every((cell) => typeof cell === 'string'),
    );

    if (!isValid) {
      throw new BadRequestException(
        'All grid cells must be strings (single letters)',
      );
    }

    // Validate no repeated letters in grid
    this.validateWordboxGrid(dto.content);

    const questionType = 'wordbox';
    // wordbox is always VOCABULARY stage
    const stage = QuestionStage.VOCABULARY;

    const position = await this.calculateNextPosition(
      dto.challengeId,
      stage,
    );

    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || getDefaultText(questionType),
        instructions: dto.instructions || getDefaultInstructions(questionType),
        validationMethod: getDefaultValidationMethod(questionType),
        content: dto.content,
      },
    });

    // Guardar gridWidth, gridHeight y maxWords como configuraciones
    const configs = [
      { metaKey: 'gridWidth', metaValue: String(dto.gridWidth) },
      { metaKey: 'gridHeight', metaValue: String(dto.gridHeight) },
      { metaKey: 'maxWords', metaValue: String(dto.maxWords ?? 5) },
    ];

    await this.attachConfigurations(question.id, configs);

    return this.findOne(question.id);
  }

  async createSpelling(dto: QuestionDtos.CreateSpellingDto) {
    await this.validateChallenge(dto.challengeId);

    if (!dto.answer || dto.answer.trim().length === 0) {
      throw new BadRequestException('Answer must be a non-empty string');
    }

    const questionType = 'spelling';
    // spelling is always VOCABULARY stage
    const stage = QuestionStage.VOCABULARY;

    const position = await this.calculateNextPosition(
      dto.challengeId,
      stage,
    );

    // Upload the file
    const uploadedFile = await this.questionMediaService.uploadSingleFile(
      dto.image,
    );

    // Create the question
    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || getDefaultText(questionType),
        instructions: dto.instructions || getDefaultInstructions(questionType),
        validationMethod: getDefaultValidationMethod(questionType),
        answer: dto.answer,
      },
    });

    // Attach media file
    await this.questionMediaService.attachMediaFiles(question.id, [
      { id: uploadedFile.id, context: 'main', position: 0 },
    ]);

    // Return enriched question
    return this.findOne(question.id);
  }

  async createWordAssociations(dto: QuestionDtos.CreateWordAssociationsDto) {
    await this.validateChallenge(dto.challengeId);

    if (!dto.content || dto.content.trim().length === 0) {
      throw new BadRequestException('Content must be a non-empty string');
    }

    const questionType = 'word_associations';
    const stage = QuestionStage.VOCABULARY;

    const position = await this.calculateNextPosition(
      dto.challengeId,
      stage,
    );

    let uploadedFile: Awaited<
      ReturnType<typeof this.questionMediaService.uploadSingleFile>
    > | null = null;
    if (dto.image) {
      uploadedFile = await this.questionMediaService.uploadSingleFile(
        dto.image,
      );
    }

    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || getDefaultText(questionType),
        instructions: dto.instructions || getDefaultInstructions(questionType),
        validationMethod: getDefaultValidationMethod(questionType),
        content: dto.content,
      },
    });

    if (uploadedFile) {
      await this.questionMediaService.attachMediaFiles(question.id, [
        { id: uploadedFile.id, context: 'main', position: 0 },
      ]);
    }

    await this.attachConfigurations(question.id, [
      {
        metaKey: 'maxAssociations',
        metaValue: String(dto.maxAssociations ?? 10),
      },
    ]);

    return this.findOne(question.id);
  }

  // ==================== GRAMMAR QUESTIONS ====================

  async createUnscramble(dto: QuestionDtos.CreateUnscrambleDto) {
    await this.validateChallenge(dto.challengeId);

    if (dto.content.length !== dto.answer.length) {
      throw new BadRequestException(
        'Content and answer must have the same number of words',
      );
    }

    const questionType = 'unscramble';
    // unscramble is always GRAMMAR stage
    const stage = QuestionStage.GRAMMAR;

    const position = await this.calculateNextPosition(
      dto.challengeId,
      stage,
    );

    // Upload optional media file if provided
    let uploadedFile: Awaited<
      ReturnType<typeof this.questionMediaService.uploadSingleFile>
    > | null = null;
    if (dto.image) {
      uploadedFile = await this.questionMediaService.uploadSingleFile(
        dto.image,
      );
    }

    // Create the question
    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || getDefaultText(questionType),
        instructions: dto.instructions || getDefaultInstructions(questionType),
        validationMethod: getDefaultValidationMethod(questionType),
        content: dto.content,
        answer: dto.answer,
      },
    });

    // Attach media file if uploaded
    if (uploadedFile) {
      await this.questionMediaService.attachMediaFiles(question.id, [
        { id: uploadedFile.id, context: 'main', position: 0 },
      ]);
    }

    // Return enriched question
    return this.findOne(question.id);
  }

  async createTenses(dto: QuestionDtos.CreateTensesDto) {
    await this.validateChallenge(dto.challengeId);

    if (!dto.options.includes(dto.answer as any)) {
      throw new BadRequestException('Answer must be one of the options');
    }

    const questionType = 'tenses';
    // tenses is always GRAMMAR stage
    const stage = QuestionStage.GRAMMAR;

    const position = await this.calculateNextPosition(
      dto.challengeId,
      stage,
    );

    // Upload optional media file if provided
    let uploadedFile: Awaited<
      ReturnType<typeof this.questionMediaService.uploadSingleFile>
    > | null = null;
    if (dto.image) {
      uploadedFile = await this.questionMediaService.uploadSingleFile(
        dto.image,
      );
    }

    // Create the question
    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || getDefaultText(questionType),
        instructions: dto.instructions || getDefaultInstructions(questionType),
        validationMethod: getDefaultValidationMethod(questionType),
        content: dto.content,
        options: dto.options,
        answer: dto.answer,
      },
    });

    // Attach media file if uploaded
    if (uploadedFile) {
      await this.questionMediaService.attachMediaFiles(question.id, [
        { id: uploadedFile.id, context: 'main', position: 0 },
      ]);
    }

    // Return enriched question
    return this.findOne(question.id);
  }

  async createTagIt(dto: QuestionDtos.CreateTagItDto) {
    await this.validateChallenge(dto.challengeId);

    if (dto.answer.length === 0) {
      throw new BadRequestException('Must provide at least one valid answer');
    }

    const questionType = 'tag_it';
    // tag_it is always GRAMMAR stage
    const stage = QuestionStage.GRAMMAR;

    const position = await this.calculateNextPosition(
      dto.challengeId,
      stage,
    );

    // Upload optional media file if provided
    let uploadedFile: Awaited<
      ReturnType<typeof this.questionMediaService.uploadSingleFile>
    > | null = null;
    if (dto.image) {
      uploadedFile = await this.questionMediaService.uploadSingleFile(
        dto.image,
      );
    }

    // Create the question
    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || getDefaultText(questionType),
        instructions: dto.instructions || getDefaultInstructions(questionType),
        validationMethod: getDefaultValidationMethod(questionType),
        content: dto.content,
        answer: dto.answer,
      },
    });

    // Attach media file if uploaded
    if (uploadedFile) {
      await this.questionMediaService.attachMediaFiles(question.id, [
        { id: uploadedFile.id, context: 'main', position: 0 },
      ]);
    }

    // Return enriched question
    return this.findOne(question.id);
  }

  async createReportIt(dto: QuestionDtos.CreateReportItDto) {
    await this.validateChallenge(dto.challengeId);

    if (!dto.content || dto.content.trim().length === 0) {
      throw new BadRequestException('Content must be a non-empty string');
    }

    const questionType = 'report_it';
    // report_it is always GRAMMAR stage
    const stage = QuestionStage.GRAMMAR;

    const position = await this.calculateNextPosition(
      dto.challengeId,
      stage,
    );

    // Upload optional media file if provided
    let uploadedFile: Awaited<
      ReturnType<typeof this.questionMediaService.uploadSingleFile>
    > | null = null;
    if (dto.image) {
      uploadedFile = await this.questionMediaService.uploadSingleFile(
        dto.image,
      );
    }

    // Create the question
    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || getDefaultText(questionType),
        instructions: dto.instructions || getDefaultInstructions(questionType),
        validationMethod: getDefaultValidationMethod(questionType),
        content: dto.content,
      },
    });

    // Attach media file if uploaded
    if (uploadedFile) {
      await this.questionMediaService.attachMediaFiles(question.id, [
        { id: uploadedFile.id, context: 'main', position: 0 },
      ]);
    }

    // Return enriched question
    return this.findOne(question.id);
  }

  async createReadIt(dto: QuestionDtos.CreateReadItDto) {
    await this.validateChallenge(dto.challengeId);

    if (!dto.content || dto.content.trim().length === 0) {
      throw new BadRequestException('Content must be a non-empty string');
    }

    // Parse subQuestions from JSON string
    let parsedSubQuestions: any[];
    try {
      parsedSubQuestions = JSON.parse(dto.subQuestions);
    } catch (error) {
      throw new BadRequestException(
        'subQuestions must be a valid JSON string array',
      );
    }

    // Validate that it's an array
    if (!Array.isArray(parsedSubQuestions) || parsedSubQuestions.length === 0) {
      throw new BadRequestException('Must provide at least one sub-question');
    }

    // Validate each sub-question structure
    parsedSubQuestions.forEach((sub, index) => {
      if (!sub.content || typeof sub.content !== 'string') {
        throw new BadRequestException(
          `Sub-question ${index + 1}: content is required and must be a string`,
        );
      }
      if (!Array.isArray(sub.options) || sub.options.length !== 2) {
        throw new BadRequestException(
          `Sub-question ${index + 1}: options must be an array with exactly 2 boolean values [true, false]`,
        );
      }
      if (
        typeof sub.options[0] !== 'boolean' ||
        typeof sub.options[1] !== 'boolean'
      ) {
        throw new BadRequestException(
          `Sub-question ${index + 1}: options must contain only boolean values`,
        );
      }
      if (typeof sub.answer !== 'boolean') {
        throw new BadRequestException(
          `Sub-question ${index + 1}: answer is required and must be a boolean`,
        );
      }
      if (!sub.options.includes(sub.answer)) {
        throw new BadRequestException(
          `Sub-question ${index + 1}: answer must match one of the provided options`,
        );
      }
      if (!sub.points || typeof sub.points !== 'number') {
        throw new BadRequestException(
          `Sub-question ${index + 1}: points is required and must be a number`,
        );
      }
      if (sub.points < 0) {
        throw new BadRequestException(
          `Sub-question ${index + 1}: points cannot be negative`,
        );
      }
    });

    // Validate parent question exists if provided
    if (dto.parentQuestionId) {
      const parentQuestion = await this.prisma.question.findUnique({
        where: { id: dto.parentQuestionId },
      });

      if (!parentQuestion) {
        throw new NotFoundException(
          `Parent question with ID ${dto.parentQuestionId} not found`,
        );
      }
    }

    const questionType = 'read_it';
    // read_it is always GRAMMAR stage
    const stage = QuestionStage.GRAMMAR;

    const position = await this.calculateNextPosition(
      dto.challengeId,
      stage,
    );

    // Upload optional media file if provided
    let uploadedFile: Awaited<
      ReturnType<typeof this.questionMediaService.uploadSingleFile>
    > | null = null;
    if (dto.image) {
      uploadedFile = await this.questionMediaService.uploadSingleFile(
        dto.image,
      );
    }

    const parentId = await this.prisma.$transaction(async (tx) => {
      // Calculate total points from sub-questions
      const totalPoints = parsedSubQuestions.reduce(
        (sum, sub) => sum + sub.points,
        0,
      );

      const parent = await tx.question.create({
        data: {
          challengeId: dto.challengeId,
          stage,
          position,
          type: questionType,
          points: totalPoints, // Auto-calculated from sub-questions
          timeLimit: dto.timeLimit,
          maxAttempts: dto.maxAttempts,
          text: dto.text || getDefaultText(questionType),
          instructions:
            dto.instructions || getDefaultInstructions(questionType),
          validationMethod: getDefaultValidationMethod(questionType),
          content: dto.content,
          parentQuestionId: dto.parentQuestionId,
        },
      });

      // Attach media file if uploaded
      if (uploadedFile) {
        await tx.questionMedia.create({
          data: {
            questionId: parent.id,
            mediaFileId: uploadedFile.id,
            position: 0,
            context: 'main',
          },
        });
      }

      await tx.question.createMany({
        data: parsedSubQuestions.map((sub, index) => ({
          challengeId: dto.challengeId,
          stage,
          position: index + 1,
          type: 'read_it_subquestion',
          points: sub.points, // Use points from DTO
          timeLimit: 0,
          maxAttempts: 0,
          text: sub.content,
          instructions: 'Select true or false',
          validationMethod: 'AUTO' as ValidationMethod,
          content: sub.content,
          options: JSON.parse(JSON.stringify(sub.options)),
          answer: sub.answer,
          parentQuestionId: parent.id,
        })),
      });

      return parent.id;
    });

    // Return enriched question
    return this.findOne(parentId);
  }

  // ==================== LISTENING QUESTIONS ====================

  async createWordMatch(dto: QuestionDtos.CreateWordMatchDto) {
    await this.validateChallenge(dto.challengeId);

    if (!dto.options.includes(dto.answer)) {
      throw new BadRequestException('Answer must be one of the options');
    }

    const questionType = 'word_match';
    // word_match is always LISTENING stage
    const stage = QuestionStage.LISTENING;

    const position = await this.calculateNextPosition(
      dto.challengeId,
      stage,
    );

    // Upload the file
    const uploadedFile = await this.questionMediaService.uploadSingleFile(
      dto.audio,
    );

    // Create the question
    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || getDefaultText(questionType),
        instructions: dto.instructions || getDefaultInstructions(questionType),
        validationMethod: getDefaultValidationMethod(questionType),
        options: dto.options,
        answer: dto.answer,
      },
    });

    // Attach media file
    await this.questionMediaService.attachMediaFiles(question.id, [
      { id: uploadedFile.id, context: 'main', position: 0 },
    ]);

    // Return enriched question
    return this.findOne(question.id);
  }

  async createGossip(dto: QuestionDtos.CreateGossipDto) {
    await this.validateChallenge(dto.challengeId);

    if (!dto.answer || dto.answer.trim().length === 0) {
      throw new BadRequestException('Answer must be a non-empty string');
    }

    const questionType = 'gossip';
    // gossip is always LISTENING stage
    const stage = QuestionStage.LISTENING;

    const position = await this.calculateNextPosition(
      dto.challengeId,
      stage,
    );

    // Upload the file
    const uploadedFile = await this.questionMediaService.uploadSingleFile(
      dto.audio,
    );

    // Create the question
    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || getDefaultText(questionType),
        instructions: dto.instructions || getDefaultInstructions(questionType),
        validationMethod: getDefaultValidationMethod(questionType),
        answer: dto.answer,
      },
    });

    // Attach media file
    await this.questionMediaService.attachMediaFiles(question.id, [
      { id: uploadedFile.id, context: 'main', position: 0 },
    ]);

    // Return enriched question
    return this.findOne(question.id);
  }

  async createTopicBasedAudio(dto: QuestionDtos.CreateTopicBasedAudioDto) {
    await this.validateChallenge(dto.challengeId);

    // Parse subQuestions from JSON string
    let parsedSubQuestions: any[];
    try {
      parsedSubQuestions = JSON.parse(dto.subQuestions);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'subQuestions must be a valid JSON string array',
      );
    }

    // Validate that it's an array
    if (!Array.isArray(parsedSubQuestions) || parsedSubQuestions.length === 0) {
      throw new BadRequestException('Must provide at least one sub-question');
    }

    // Validate each sub-question structure
    parsedSubQuestions.forEach((sub, index) => {
      if (!sub.content || typeof sub.content !== 'string') {
        throw new BadRequestException(
          `Sub-question ${index + 1}: content is required and must be a string`,
        );
      }
      if (!sub.points || typeof sub.points !== 'number') {
        throw new BadRequestException(
          `Sub-question ${index + 1}: points is required and must be a number`,
        );
      }
      if (!Array.isArray(sub.options) || sub.options.length < 2) {
        throw new BadRequestException(
          `Sub-question ${index + 1}: must provide at least 2 options`,
        );
      }
      if (!sub.answer || typeof sub.answer !== 'string') {
        throw new BadRequestException(
          `Sub-question ${index + 1}: answer is required and must be a string`,
        );
      }
      if (!sub.options.includes(sub.answer)) {
        throw new BadRequestException(
          `Sub-question ${index + 1}: answer must match one of the provided options`,
        );
      }
    });

    // Validate parent question exists if provided
    if (dto.parentQuestionId) {
      const parentQuestion = await this.prisma.question.findUnique({
        where: { id: dto.parentQuestionId },
      });

      if (!parentQuestion) {
        throw new NotFoundException(
          `Parent question with ID ${dto.parentQuestionId} not found`,
        );
      }
    }

    const questionType = 'topic_based_audio';
    // topic_based_audio is always LISTENING stage
    const stage = QuestionStage.LISTENING;

    const position = await this.calculateNextPosition(
      dto.challengeId,
      stage,
    );

    // Upload the file
    const uploadedFile = await this.questionMediaService.uploadSingleFile(
      dto.audio,
    );

    const parentId = await this.prisma.$transaction(async (tx) => {
      // Calculate total points from sub-questions
      const totalPoints = parsedSubQuestions.reduce(
        (sum, sub) => sum + sub.points,
        0,
      );

      const parent = await tx.question.create({
        data: {
          challengeId: dto.challengeId,
          stage,
          position,
          type: questionType,
          points: totalPoints, // Auto-calculated from sub-questions
          timeLimit: dto.timeLimit,
          maxAttempts: dto.maxAttempts,
          text: dto.text || getDefaultText(questionType),
          instructions:
            dto.instructions || getDefaultInstructions(questionType),
          validationMethod: getDefaultValidationMethod(questionType),
          parentQuestionId: dto.parentQuestionId,
        },
      });

      // Attach media file
      await tx.questionMedia.create({
        data: {
          questionId: parent.id,
          mediaFileId: uploadedFile.id,
          position: 0,
          context: 'main',
        },
      });

      await tx.question.createMany({
        data: parsedSubQuestions.map((sub, index) => ({
          challengeId: dto.challengeId,
          stage,
          position: index + 1,
          type: 'topic_based_audio_subquestion',
          points: sub.points,
          timeLimit: 0,
          maxAttempts: 0,
          text: 'Sub-question',
          content: sub.content,
          instructions: 'Select the correct option',
          validationMethod: 'AUTO' as ValidationMethod,
          options: JSON.parse(JSON.stringify(sub.options)),
          answer: sub.answer,
          parentQuestionId: parent.id,
        })),
      });

      return parent.id;
    });

    // Return enriched question
    return this.findOne(parentId);
  }

  /**
   * Recalculate parent question points based on sum of sub-questions
   */
  private async recalculateParentPoints(
    parentQuestionId: string,
  ): Promise<void> {
    const subQuestions = await this.prisma.question.findMany({
      where: { parentQuestionId },
      select: { points: true },
    });

    const totalPoints = subQuestions.reduce((sum, sq) => sum + sq.points, 0);

    await this.prisma.question.update({
      where: { id: parentQuestionId },
      data: { points: totalPoints },
    });
  }

  async createLyricsTraining(dto: QuestionDtos.CreateLyricsTrainingDto) {
    await this.validateChallenge(dto.challengeId);

    if (!dto.options.includes(dto.answer)) {
      throw new BadRequestException('Answer must be one of the options');
    }

    const questionType = 'lyrics_training';
    // lyrics_training is always LISTENING stage
    const stage = QuestionStage.LISTENING;

    const position = await this.calculateNextPosition(
      dto.challengeId,
      stage,
    );

    // Upload the file
    const uploadedFile = await this.questionMediaService.uploadSingleFile(
      dto.video,
    );

    // Create the question
    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || getDefaultText(questionType),
        instructions: dto.instructions || getDefaultInstructions(questionType),
        validationMethod: getDefaultValidationMethod(questionType),
        options: dto.options,
        answer: dto.answer,
      },
    });

    // Attach media file
    await this.questionMediaService.attachMediaFiles(question.id, [
      { id: uploadedFile.id, context: 'main', position: 0 },
    ]);

    // Return enriched question
    return this.findOne(question.id);
  }

  // ==================== WRITING QUESTIONS ====================

  async createSentenceMaker(dto: QuestionDtos.CreateSentenceMakerDto) {
    await this.validateChallenge(dto.challengeId);

    const questionType = 'sentence_maker';
    const stage = QuestionStage.WRITING;

    const position = await this.calculateNextPosition(
      dto.challengeId,
      stage,
    );

    // Upload all files
    const uploadedFiles = await Promise.all(
      dto.images.map((file) => this.questionMediaService.uploadSingleFile(file)),
    );

    // Create the question
    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || getDefaultText(questionType),
        instructions: dto.instructions || getDefaultInstructions(questionType),
        validationMethod: getDefaultValidationMethod(questionType),
      },
    });

    // Attach all media files
    await this.questionMediaService.attachMediaFiles(
      question.id,
      uploadedFiles.map((file, index) => ({
        id: file.id,
        position: index,
        context: 'main',
      })),
    );

    // Return enriched question
    return this.findOne(question.id);
  }

  async createFastTest(dto: QuestionDtos.CreateFastTestDto) {
    await this.validateChallenge(dto.challengeId);

    if (!dto.options.includes(dto.answer)) {
      throw new BadRequestException('Answer must be one of the options');
    }

    const questionType = 'fast_test';
    const stage = QuestionStage.WRITING;

    const position = await this.calculateNextPosition(
      dto.challengeId,
      stage,
    );

    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || getDefaultText(questionType),
        instructions: dto.instructions || getDefaultInstructions(questionType),
        validationMethod: getDefaultValidationMethod(questionType),
        content: JSON.parse(JSON.stringify(dto.content)),
        options: JSON.parse(JSON.stringify(dto.options)),
        answer: dto.answer,
      },
    });

    // Return enriched question
    return this.findOne(question.id);
  }

  async createTales(dto: QuestionDtos.CreateTalesDto) {
    await this.validateChallenge(dto.challengeId);

    const questionType = 'tales';
    const stage = QuestionStage.WRITING;

    const position = await this.calculateNextPosition(
      dto.challengeId,
      stage,
    );

    // Upload the file
    const uploadedFile = await this.questionMediaService.uploadSingleFile(
      dto.image,
    );

    // Create the question
    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || getDefaultText(questionType),
        instructions: dto.instructions || getDefaultInstructions(questionType),
        validationMethod: getDefaultValidationMethod(questionType),
      },
    });

    // Attach media file
    await this.questionMediaService.attachMediaFiles(question.id, [
      { id: uploadedFile.id, context: 'main', position: 0 },
    ]);

    // Return enriched question
    return this.findOne(question.id);
  }

  // ==================== SPEAKING QUESTIONS ====================

  async createSuperbrain(dto: QuestionDtos.CreateSuperbrainDto) {
    await this.validateChallenge(dto.challengeId);

    if (!dto.content || dto.content.trim().length === 0) {
      throw new BadRequestException('Content must be a non-empty string');
    }

    const questionType = 'superbrain';
    const stage = QuestionStage.SPEAKING;

    const position = await this.calculateNextPosition(
      dto.challengeId,
      stage,
    );

    // Upload the optional image if provided
    let uploadedFile: Awaited<
      ReturnType<typeof this.questionMediaService.uploadSingleFile>
    > | null = null;
    if (dto.image) {
      uploadedFile = await this.questionMediaService.uploadSingleFile(
        dto.image,
      );
    }

    // Create the question
    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || getDefaultText(questionType),
        instructions: dto.instructions || getDefaultInstructions(questionType),
        validationMethod: getDefaultValidationMethod(questionType),
        content: dto.content,
      },
    });

    // Attach media file if uploaded
    if (uploadedFile) {
      await this.questionMediaService.attachMediaFiles(question.id, [
        { id: uploadedFile.id, context: 'main', position: 0 },
      ]);
    }

    // Return enriched question
    return this.findOne(question.id);
  }

  async createTellMeAboutIt(dto: QuestionDtos.CreateTellMeAboutItDto) {
    await this.validateChallenge(dto.challengeId);

    if (!dto.content || dto.content.trim().length === 0) {
      throw new BadRequestException('Content must be a non-empty string');
    }

    const questionType = 'tell_me_about_it';
    const stage = QuestionStage.SPEAKING;

    const position = await this.calculateNextPosition(
      dto.challengeId,
      stage,
    );

    // Upload the optional image if provided
    let uploadedFile: Awaited<
      ReturnType<typeof this.questionMediaService.uploadSingleFile>
    > | null = null;
    if (dto.image) {
      uploadedFile = await this.questionMediaService.uploadSingleFile(
        dto.image,
      );
    }

    // Create the question
    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || getDefaultText(questionType),
        instructions: dto.instructions || getDefaultInstructions(questionType),
        validationMethod: getDefaultValidationMethod(questionType),
        content: dto.content,
      },
    });

    // Attach media file if uploaded
    if (uploadedFile) {
      await this.questionMediaService.attachMediaFiles(question.id, [
        { id: uploadedFile.id, context: 'main', position: 0 },
      ]);
    }

    // Return enriched question
    return this.findOne(question.id);
  }

  async createDebate(dto: QuestionDtos.CreateDebateDto) {
    await this.validateChallenge(dto.challengeId);

    if (!dto.content || dto.content.trim().length === 0) {
      throw new BadRequestException('Content must be a non-empty string');
    }

    const questionType = 'debate';
    const stage = QuestionStage.SPEAKING;

    const position = await this.calculateNextPosition(
      dto.challengeId,
      stage,
    );

    // Upload optional media file if provided
    let uploadedFile: Awaited<
      ReturnType<typeof this.questionMediaService.uploadSingleFile>
    > | null = null;
    if (dto.image) {
      uploadedFile = await this.questionMediaService.uploadSingleFile(
        dto.image,
      );
    }

    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || getDefaultText(questionType),
        instructions: dto.instructions || getDefaultInstructions(questionType),
        validationMethod: getDefaultValidationMethod(questionType),
        content: dto.content,
      },
    });

    // Store stance directly on the question record
    const updatedQuestion = await this.prisma.question.update({
      where: { id: question.id },
      data: {
        answer: dto.stance, // Store stance in answer field
      },
    });

    // Attach minDuration configuration
    await this.attachConfigurations(updatedQuestion.id, [
      {
        metaKey: 'minDuration',
        metaValue: '90',
      },
    ]);

    // Attach media file if uploaded
    if (uploadedFile) {
      await this.questionMediaService.attachMediaFiles(updatedQuestion.id, [
        { id: uploadedFile.id, context: 'main', position: 0 },
      ]);
    }

    return this.findOne(updatedQuestion.id);
  }

  // ==================== QUERY METHODS ====================

  async findAll(filters?: {
    challengeId?: string;
    stage?: QuestionStage;
  }) {
    const questions = await this.prisma.question.findMany({
      where: {
        challengeId: filters?.challengeId,
        stage: filters?.stage,
        parentQuestionId: null,
      },
      include: {
        questionMedia: {
          include: {
            mediaFile: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
        configurations: true,
        subQuestions: {
          include: {
            questionMedia: {
              include: {
                mediaFile: true,
              },
            },
            configurations: true,
          },
        },
        challenge: true,
      },
      orderBy: [{ stage: 'asc' }, { type: 'asc' }, { position: 'asc' }],
    });

    // Enrich all questions with media and configurations (including subQuestions recursively)
    const enrichedQuestions = questions.map((question) =>
      this.questionMediaService.enrichQuestionWithMedia(question),
    );

    // Format each question based on its type
    return this.questionFormatterService.formatQuestions(enrichedQuestions);
  }

  async findByChallengeId(
    challengeId: string,
    filters?: {
      stage?: QuestionStage;
      type?: string;
    },
  ) {
    // Validate challenge exists
    await this.validateChallenge(challengeId);

    // Build where clause conditionally - all filters must match (AND logic)
    const where: Prisma.QuestionWhereInput = {
      challengeId,
      parentQuestionId: null,
      deletedAt: null,
    };

    // Apply filters only if they have valid values
    if (filters?.stage) {
      where.stage = filters.stage;
    }

    if (filters?.type && filters.type.trim() !== '') {
      where.type = filters.type;
    }

    const questions = await this.prisma.question.findMany({
      where,
      include: {
        questionMedia: {
          include: {
            mediaFile: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
        configurations: true,
        subQuestions: {
          include: {
            questionMedia: {
              include: {
                mediaFile: true,
              },
            },
            configurations: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
        challenge: true,
      },
      orderBy: { position: 'asc' },
    });

    // Enrich all questions with media and configurations (including subQuestions recursively)
    const enrichedQuestions = questions.map((question) =>
      this.questionMediaService.enrichQuestionWithMedia(question),
    );

    // Format each question based on its type
    const formattedQuestions =
      this.questionFormatterService.formatQuestions(enrichedQuestions);

    // Case 1: Only challengeId - group by stage, then by type
    if (!filters?.stage && !filters?.type) {
      const groupedByStage: Record<
        string,
        Record<string, FormattedQuestion[]>
      > = {};

      formattedQuestions.forEach((question) => {
        const stage = question.stage;
        const type = question.type;

        if (!groupedByStage[stage]) {
          groupedByStage[stage] = {};
        }

        if (!groupedByStage[stage][type]) {
          groupedByStage[stage][type] = [];
        }

        groupedByStage[stage][type].push(question);
      });

      return groupedByStage;
    }

    // Case 2: challengeId + stage - group by type
    if (filters?.stage && !filters?.type) {
      const groupedByType: Record<string, FormattedQuestion[]> = {};

      formattedQuestions.forEach((question) => {
        const type = question.type;

        if (!groupedByType[type]) {
          groupedByType[type] = [];
        }

        groupedByType[type].push(question);
      });

      return groupedByType;
    }

    // Case 3: challengeId + stage + type - return array of questions
    return formattedQuestions;
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        questionMedia: {
          include: {
            mediaFile: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
        configurations: true,
        subQuestions: {
          include: {
            questionMedia: {
              include: {
                mediaFile: true,
              },
            },
            configurations: true,
          },
        },
        challenge: true,
        parentQuestion: true,
      },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }

    // Enrich with media and configurations (including subQuestions recursively)
    const enrichedQuestion =
      this.questionMediaService.enrichQuestionWithMedia(question);

    // Format based on question type for optimal frontend structure
    return this.questionFormatterService.formatQuestion(enrichedQuestion);
  }

  async getSchoolStats(schoolId: string, questionId?: string) {
    // Validate school exists
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school) {
      throw new NotFoundException(`School with ID ${schoolId} not found`);
    }

    // Build where clause for questions
    const whereCondition: any = {
      // Only include active, non-deleted questions
      isActive: true,
      deletedAt: null,
      studentAnswers: {
        some: {
          student: {
            schoolId: schoolId,
          },
        },
      },
    };

    if (questionId) {
      whereCondition.id = questionId;
    }

    // Get questions with their student answers filtered by school
    const questions = await this.prisma.question.findMany({
      where: whereCondition,
      include: {
        studentAnswers: {
          where: {
            student: {
              schoolId: schoolId,
            },
          },
          select: {
            id: true,
            isCorrect: true,
            timeSpent: true,
          },
        },
      },
    });

    // Calculate statistics for each question
    return questions
      .map((question) => {
        const totalAttempts = question.studentAnswers.length;
        const correctAnswers = question.studentAnswers.filter(
          (sa) => sa.isCorrect,
        ).length;
        const averageTime =
          totalAttempts > 0
            ? Math.round(
                question.studentAnswers.reduce(
                  (sum, sa) => sum + (sa.timeSpent || 0),
                  0,
                ) / totalAttempts,
              )
            : 0;
        const successRate =
          totalAttempts > 0
            ? parseFloat(((correctAnswers / totalAttempts) * 100).toFixed(2))
            : 0;

        return {
          questionId: question.id,
          questionText: question.text,
          questionType: question.type,
          totalAttempts,
          correctAnswers,
          averageTime,
          successRate,
        };
      })
      .sort((a, b) => b.totalAttempts - a.totalAttempts);
  }

  // ==================== HELPER METHODS ====================

  private async validateChallenge(challengeId: string): Promise<void> {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new BadRequestException(
        `Challenge with ID ${challengeId} not found`,
      );
    }
  }
}
