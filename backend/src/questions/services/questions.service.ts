import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { QuestionStage, ValidationMethod } from '@prisma/client';
import { QuestionMediaService, QuestionFormatterService } from '.';
import * as QuestionDtos from '../dto';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly questionMediaService: QuestionMediaService,
    private readonly questionFormatterService: QuestionFormatterService,
  ) {}

  // ==================== HELPER METHODS ====================

  private async calculateNextPosition(
    challengeId: string,
    stage: QuestionStage,
    phase: string,
  ): Promise<number> {
    const maxPosition = await this.prisma.question.findFirst({
      where: {
        challengeId,
        stage,
        phase,
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

  private getDefaultValidationMethod(questionType: string): ValidationMethod {
    // Default validation methods based on question type
    const defaultValidationMethods: Record<string, ValidationMethod> = {
      // Vocabulary
      image_to_multiple_choices: ValidationMethod.AUTO,
      wordbox: ValidationMethod.IA,
      spelling: ValidationMethod.IA,
      word_associations: ValidationMethod.IA,
      // Grammar
      unscramble: ValidationMethod.AUTO,
      tenses: ValidationMethod.AUTO,
      tag_it: ValidationMethod.AUTO,
      report_it: ValidationMethod.IA,
      read_it: ValidationMethod.AUTO,
      // Listening
      word_match: ValidationMethod.AUTO,
      gossip: ValidationMethod.IA,
      topic_based_audio: ValidationMethod.AUTO,
      lyrics_training: ValidationMethod.AUTO,
      // Writing
      sentence_maker: ValidationMethod.IA,
      fast_test: ValidationMethod.AUTO,
      tales: ValidationMethod.IA,
      // Speaking
      superbrain: ValidationMethod.IA,
      tell_me_about_it: ValidationMethod.IA,
      debate: ValidationMethod.IA,
    };

    return defaultValidationMethods[questionType] || ValidationMethod.AUTO;
  }

  private getDefaultText(questionType: string): string {
    const defaultTexts: Record<string, string> = {
      // Vocabulary
      image_to_multiple_choices: 'What is shown in the image?',
      wordbox:
        'Form as many valid English words as you can using the letters in the grid.',
      spelling: 'Spell the word shown in the image letter by letter.',
      word_associations: 'Write words related to the given topic.',
      // Grammar
      unscramble: 'Put the words in the correct order to form a sentence.',
      tenses: 'Identify the verb tense used in the sentence.',
      tag_it: 'Select all the words that belong to the indicated category.',
      report_it: 'Convert the direct speech into reported speech.',
      read_it: 'Read the text and answer the questions below.',
      // Listening
      word_match: 'Match each word with its corresponding audio pronunciation.',
      gossip: 'Listen to the audio and repeat what you heard.',
      topic_based_audio: 'Listen to the audio and answer the questions below.',
      lyrics_training: 'Listen to the song and fill in the missing words.',
      // Writing
      sentence_maker: 'Create a sentence describing the images shown.',
      fast_test: 'Complete the sentence with the correct word.',
      tales: 'Write a creative story based on the images provided.',
      // Speaking
      superbrain: 'Answer the question with a complete spoken response.',
      tell_me_about_it: 'Tell a story about what you see in the images.',
      debate: 'Present your argument for or against the given statement.',
    };

    return defaultTexts[questionType] || 'Complete the question.';
  }

  private getDefaultInstructions(questionType: string): string {
    const defaultInstructions: Record<string, string> = {
      // Vocabulary
      image_to_multiple_choices:
        'Select the correct option that matches the image.',
      wordbox:
        'Use the letters in the grid to form valid English words. You can move horizontally or vertically.',
      spelling: 'Say each letter clearly, one by one (e.g., C-A-T).',
      word_associations:
        'Think of words that are related or associated with the given topic.',
      // Grammar
      unscramble:
        'Arrange the words to create a grammatically correct sentence.',
      tenses:
        'Choose the tense that best describes the verb usage in the sentence.',
      tag_it: 'Select all words that fit the specified grammatical category.',
      report_it:
        'Rewrite the sentence converting direct speech to reported speech.',
      read_it:
        'Read carefully and determine if each statement is true or false.',
      // Listening
      word_match:
        'Listen to each audio clip and match it with the correct word.',
      gossip: 'Listen carefully and repeat exactly what you heard.',
      topic_based_audio:
        'Listen to the audio and answer each question based on what you heard.',
      lyrics_training: 'Listen to the song and type the missing words.',
      // Writing
      sentence_maker:
        'Write a complete sentence that describes what you see in the images.',
      fast_test: 'Fill in the blank with the appropriate word.',
      tales: 'Use your creativity to write a story inspired by the images.',
      // Speaking
      superbrain:
        'Speak clearly and provide a complete answer to the question.',
      tell_me_about_it:
        'Look at the images and tell a story about what you see.',
      debate: 'Present a clear argument with reasons supporting your position.',
    };

    return (
      defaultInstructions[questionType] || 'Follow the instructions carefully.'
    );
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

  // ==================== VOCABULARY QUESTIONS ====================

  async createImageToMultipleChoices(
    dto: QuestionDtos.CreateImageToMultipleChoicesDto,
  ) {
    await this.validateChallenge(dto.challengeId);

    // Validate answer is in options
    if (!dto.options.includes(dto.answer)) {
      throw new BadRequestException('Answer must be one of the options');
    }

    const questionType = 'image_to_multiple_choices';

    // Auto-calculate position
    const position = await this.calculateNextPosition(
      dto.challengeId,
      dto.stage,
      dto.phase,
    );

    // Upload the file
    const uploadedFile = await this.questionMediaService.uploadSingleFile(
      dto.media,
    );

    // Create the question
    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage: dto.stage,
        phase: dto.phase,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || this.getDefaultText(questionType),
        instructions:
          dto.instructions || this.getDefaultInstructions(questionType),
        validationMethod: this.getDefaultValidationMethod(questionType),
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

  async createWordbox(dto: QuestionDtos.CreateWordboxDto) {
    await this.validateChallenge(dto.challengeId);

    if (!Array.isArray(dto.content) || dto.content.length === 0) {
      throw new BadRequestException('Content must be a non-empty 2D array');
    }

    const rowLength = dto.content[0].length;
    const isValid = dto.content.every(
      (row) =>
        Array.isArray(row) &&
        row.length === rowLength &&
        row.every((cell) => typeof cell === 'string'),
    );

    if (!isValid) {
      throw new BadRequestException(
        'Content must be a valid 2D array of strings with consistent row length',
      );
    }

    const questionType = 'wordbox';

    const position = await this.calculateNextPosition(
      dto.challengeId,
      dto.stage,
      dto.phase,
    );

    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage: dto.stage,
        phase: dto.phase,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || this.getDefaultText(questionType),
        instructions:
          dto.instructions || this.getDefaultInstructions(questionType),
        validationMethod: this.getDefaultValidationMethod(questionType),
        content: dto.content,
      },
    });

    // Attach configurations if provided
    if (dto.configuration) {
      const configs = Object.entries(dto.configuration).map(([key, value]) => ({
        metaKey: key,
        metaValue: String(value),
      }));
      await this.attachConfigurations(question.id, configs);
    }

    return this.findOne(question.id);
  }

  async createSpelling(dto: QuestionDtos.CreateSpellingDto) {
    await this.validateChallenge(dto.challengeId);

    if (!dto.answer || dto.answer.trim().length === 0) {
      throw new BadRequestException('Answer must be a non-empty string');
    }

    const questionType = 'spelling';

    const position = await this.calculateNextPosition(
      dto.challengeId,
      dto.stage,
      dto.phase,
    );

    // Upload the file
    const uploadedFile = await this.questionMediaService.uploadSingleFile(
      dto.media,
    );

    // Create the question
    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage: dto.stage,
        phase: dto.phase,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || this.getDefaultText(questionType),
        instructions:
          dto.instructions || this.getDefaultInstructions(questionType),
        validationMethod: this.getDefaultValidationMethod(questionType),
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

    if (!dto.configuration || !dto.configuration.totalAssociations) {
      throw new BadRequestException(
        'Configuration must include totalAssociations',
      );
    }

    const questionType = 'word_associations';

    const position = await this.calculateNextPosition(
      dto.challengeId,
      dto.stage,
      dto.phase,
    );

    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage: dto.stage,
        phase: dto.phase,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || this.getDefaultText(questionType),
        instructions:
          dto.instructions || this.getDefaultInstructions(questionType),
        validationMethod: this.getDefaultValidationMethod(questionType),
        content: dto.content,
      },
    });

    // Attach configurations
    const configs = Object.entries(dto.configuration).map(([key, value]) => ({
      metaKey: key,
      metaValue: String(value),
    }));
    await this.attachConfigurations(question.id, configs);

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

    const position = await this.calculateNextPosition(
      dto.challengeId,
      dto.stage,
      dto.phase,
    );

    return this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage: dto.stage,
        phase: dto.phase,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || this.getDefaultText(questionType),
        instructions:
          dto.instructions || this.getDefaultInstructions(questionType),
        validationMethod: this.getDefaultValidationMethod(questionType),
        content: dto.content,
        answer: dto.answer,
      },
    });
  }

  async createTenses(dto: QuestionDtos.CreateTensesDto) {
    await this.validateChallenge(dto.challengeId);

    if (!dto.options.includes(dto.answer as any)) {
      throw new BadRequestException('Answer must be one of the options');
    }

    const questionType = 'tenses';

    const position = await this.calculateNextPosition(
      dto.challengeId,
      dto.stage,
      dto.phase,
    );

    return this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage: dto.stage,
        phase: dto.phase,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || this.getDefaultText(questionType),
        instructions:
          dto.instructions || this.getDefaultInstructions(questionType),
        validationMethod: this.getDefaultValidationMethod(questionType),
        content: dto.content,
        options: dto.options,
        answer: dto.answer,
      },
    });
  }

  async createTagIt(dto: QuestionDtos.CreateTagItDto) {
    await this.validateChallenge(dto.challengeId);

    if (dto.answer.length === 0) {
      throw new BadRequestException('Must provide at least one valid answer');
    }

    const questionType = 'tag_it';

    const position = await this.calculateNextPosition(
      dto.challengeId,
      dto.stage,
      dto.phase,
    );

    return this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage: dto.stage,
        phase: dto.phase,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || this.getDefaultText(questionType),
        instructions:
          dto.instructions || this.getDefaultInstructions(questionType),
        validationMethod: this.getDefaultValidationMethod(questionType),
        content: dto.content,
        answer: dto.answer,
      },
    });
  }

  async createReportIt(dto: QuestionDtos.CreateReportItDto) {
    await this.validateChallenge(dto.challengeId);

    if (!dto.content || dto.content.trim().length === 0) {
      throw new BadRequestException('Content must be a non-empty string');
    }

    const questionType = 'report_it';

    const position = await this.calculateNextPosition(
      dto.challengeId,
      dto.stage,
      dto.phase,
    );

    return this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage: dto.stage,
        phase: dto.phase,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || this.getDefaultText(questionType),
        instructions:
          dto.instructions || this.getDefaultInstructions(questionType),
        validationMethod: this.getDefaultValidationMethod(questionType),
        content: dto.content,
      },
    });
  }

  async createReadIt(dto: QuestionDtos.CreateReadItDto) {
    await this.validateChallenge(dto.challengeId);

    if (!Array.isArray(dto.content) || dto.content.length === 0) {
      throw new BadRequestException(
        'Content must be a non-empty array of passages',
      );
    }

    if (!Array.isArray(dto.subQuestions) || dto.subQuestions.length === 0) {
      throw new BadRequestException('Must provide at least one sub-question');
    }

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

    const position = await this.calculateNextPosition(
      dto.challengeId,
      dto.stage,
      dto.phase,
    );

    return this.prisma.$transaction(async (tx) => {
      // Calculate total points from sub-questions
      const totalPoints = dto.subQuestions.reduce(
        (sum, sub) => sum + sub.points,
        0,
      );

      const parent = await tx.question.create({
        data: {
          challengeId: dto.challengeId,
          stage: dto.stage,
          phase: dto.phase,
          position,
          type: questionType,
          points: totalPoints, // Auto-calculated from sub-questions
          timeLimit: dto.timeLimit,
          maxAttempts: dto.maxAttempts,
          text: dto.text || this.getDefaultText(questionType),
          instructions:
            dto.instructions || this.getDefaultInstructions(questionType),
          validationMethod: this.getDefaultValidationMethod(questionType),
          content: JSON.parse(JSON.stringify(dto.content)),
          parentQuestionId: dto.parentQuestionId,
        },
      });

      await tx.question.createMany({
        data: dto.subQuestions.map((sub, index) => ({
          challengeId: dto.challengeId,
          stage: dto.stage,
          phase: dto.phase,
          position: index + 1,
          type: 'true_false',
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

      return tx.question.findUnique({
        where: { id: parent.id },
        include: { subQuestions: true },
      });
    });
  }

  // ==================== LISTENING QUESTIONS ====================

  async createWordMatch(dto: QuestionDtos.CreateWordMatchDto) {
    await this.validateChallenge(dto.challengeId);

    if (!dto.options.includes(dto.answer)) {
      throw new BadRequestException('Answer must be one of the options');
    }

    const questionType = 'word_match';

    const position = await this.calculateNextPosition(
      dto.challengeId,
      dto.stage,
      dto.phase,
    );

    // Upload all files
    const uploadedFiles = await Promise.all(
      dto.media.map((file) => this.questionMediaService.uploadSingleFile(file)),
    );

    // Create the question
    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage: dto.stage,
        phase: dto.phase,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || this.getDefaultText(questionType),
        instructions:
          dto.instructions || this.getDefaultInstructions(questionType),
        validationMethod: this.getDefaultValidationMethod(questionType),
        options: dto.options,
        answer: dto.answer,
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

  async createGossip(dto: QuestionDtos.CreateGossipDto) {
    await this.validateChallenge(dto.challengeId);

    if (!dto.answer || dto.answer.trim().length === 0) {
      throw new BadRequestException('Answer must be a non-empty string');
    }

    const questionType = 'gossip';

    const position = await this.calculateNextPosition(
      dto.challengeId,
      dto.stage,
      dto.phase,
    );

    // Upload the file
    const uploadedFile = await this.questionMediaService.uploadSingleFile(
      dto.media,
    );

    // Create the question
    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage: dto.stage,
        phase: dto.phase,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || this.getDefaultText(questionType),
        instructions:
          dto.instructions || this.getDefaultInstructions(questionType),
        validationMethod: this.getDefaultValidationMethod(questionType),
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

    if (!Array.isArray(dto.subQuestions) || dto.subQuestions.length === 0) {
      throw new BadRequestException('Must provide at least one sub-question');
    }

    // Validate each sub-question
    dto.subQuestions.forEach((sub, index) => {
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

    const position = await this.calculateNextPosition(
      dto.challengeId,
      dto.stage,
      dto.phase,
    );

    // Upload the file
    const uploadedFile = await this.questionMediaService.uploadSingleFile(
      dto.media,
    );

    return this.prisma.$transaction(async (tx) => {
      // Calculate total points from sub-questions
      const totalPoints = dto.subQuestions.reduce(
        (sum, sub) => sum + sub.points,
        0,
      );

      const parent = await tx.question.create({
        data: {
          challengeId: dto.challengeId,
          stage: dto.stage,
          phase: dto.phase,
          position,
          type: questionType,
          points: totalPoints, // Auto-calculated from sub-questions
          timeLimit: dto.timeLimit,
          maxAttempts: dto.maxAttempts,
          text: dto.text || this.getDefaultText(questionType),
          instructions:
            dto.instructions || this.getDefaultInstructions(questionType),
          validationMethod: this.getDefaultValidationMethod(questionType),
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
        data: dto.subQuestions.map((sub, index) => ({
          challengeId: dto.challengeId,
          stage: dto.stage,
          phase: dto.phase,
          position: index + 1,
          type: 'multiple_choice',
          points: sub.points,
          timeLimit: 0,
          maxAttempts: 0,
          text: sub.text,
          instructions: 'Select the correct option',
          validationMethod: 'AUTO' as ValidationMethod,
          options: JSON.parse(JSON.stringify(sub.options)),
          answer: sub.answer,
          parentQuestionId: parent.id,
        })),
      });

      return tx.question.findUnique({
        where: { id: parent.id },
        include: { subQuestions: true },
      });
    });
  }

  async createLyricsTraining(dto: QuestionDtos.CreateLyricsTrainingDto) {
    await this.validateChallenge(dto.challengeId);

    if (!dto.options.includes(dto.answer)) {
      throw new BadRequestException('Answer must be one of the options');
    }

    const questionType = 'lyrics_training';

    const position = await this.calculateNextPosition(
      dto.challengeId,
      dto.stage,
      dto.phase,
    );

    // Upload the file
    const uploadedFile = await this.questionMediaService.uploadSingleFile(
      dto.media,
    );

    // Create the question
    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage: dto.stage,
        phase: dto.phase,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || this.getDefaultText(questionType),
        instructions:
          dto.instructions || this.getDefaultInstructions(questionType),
        validationMethod: this.getDefaultValidationMethod(questionType),
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

    const position = await this.calculateNextPosition(
      dto.challengeId,
      dto.stage,
      dto.phase,
    );

    // Upload all files
    const uploadedFiles = await Promise.all(
      dto.media.map((file) => this.questionMediaService.uploadSingleFile(file)),
    );

    // Create the question
    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage: dto.stage,
        phase: dto.phase,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || this.getDefaultText(questionType),
        instructions:
          dto.instructions || this.getDefaultInstructions(questionType),
        validationMethod: this.getDefaultValidationMethod(questionType),
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

    const position = await this.calculateNextPosition(
      dto.challengeId,
      dto.stage,
      dto.phase,
    );

    return this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage: dto.stage,
        phase: dto.phase,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || this.getDefaultText(questionType),
        instructions:
          dto.instructions || this.getDefaultInstructions(questionType),
        validationMethod: this.getDefaultValidationMethod(questionType),
        content: JSON.parse(JSON.stringify(dto.content)),
        options: JSON.parse(JSON.stringify(dto.options)),
        answer: dto.answer,
      },
    });
  }

  async createTales(dto: QuestionDtos.CreateTalesDto) {
    await this.validateChallenge(dto.challengeId);

    const questionType = 'tales';

    const position = await this.calculateNextPosition(
      dto.challengeId,
      dto.stage,
      dto.phase,
    );

    // Upload all files
    const uploadedFiles = await Promise.all(
      dto.media.map((file) => this.questionMediaService.uploadSingleFile(file)),
    );

    // Create the question
    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage: dto.stage,
        phase: dto.phase,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || this.getDefaultText(questionType),
        instructions:
          dto.instructions || this.getDefaultInstructions(questionType),
        validationMethod: this.getDefaultValidationMethod(questionType),
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

  // ==================== SPEAKING QUESTIONS ====================

  async createSuperbrain(dto: QuestionDtos.CreateSuperbrainDto) {
    await this.validateChallenge(dto.challengeId);

    if (!dto.content || dto.content.trim().length === 0) {
      throw new BadRequestException('Content must be a non-empty string');
    }

    const questionType = 'superbrain';

    const position = await this.calculateNextPosition(
      dto.challengeId,
      dto.stage,
      dto.phase,
    );

    return this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage: dto.stage,
        phase: dto.phase,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || this.getDefaultText(questionType),
        instructions:
          dto.instructions || this.getDefaultInstructions(questionType),
        validationMethod: this.getDefaultValidationMethod(questionType),
        content: dto.content,
      },
    });
  }

  async createTellMeAboutIt(dto: QuestionDtos.CreateTellMeAboutItDto) {
    await this.validateChallenge(dto.challengeId);

    if (!dto.content || dto.content.trim().length === 0) {
      throw new BadRequestException('Content must be a non-empty string');
    }

    const questionType = 'tell_me_about_it';

    const position = await this.calculateNextPosition(
      dto.challengeId,
      dto.stage,
      dto.phase,
    );

    // Upload the optional image if provided
    let uploadedFile: Awaited<
      ReturnType<typeof this.questionMediaService.uploadSingleFile>
    > | null = null;
    if (dto.media) {
      uploadedFile = await this.questionMediaService.uploadSingleFile(
        dto.media,
      );
    }

    // Create the question
    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage: dto.stage,
        phase: dto.phase,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || this.getDefaultText(questionType),
        instructions:
          dto.instructions || this.getDefaultInstructions(questionType),
        validationMethod: this.getDefaultValidationMethod(questionType),
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

    const position = await this.calculateNextPosition(
      dto.challengeId,
      dto.stage,
      dto.phase,
    );

    const question = await this.prisma.question.create({
      data: {
        challengeId: dto.challengeId,
        stage: dto.stage,
        phase: dto.phase,
        position,
        type: questionType,
        points: dto.points,
        timeLimit: dto.timeLimit,
        maxAttempts: dto.maxAttempts,
        text: dto.text || this.getDefaultText(questionType),
        instructions:
          dto.instructions || this.getDefaultInstructions(questionType),
        validationMethod: this.getDefaultValidationMethod(questionType),
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

    return this.findOne(updatedQuestion.id);
  }

  // ==================== QUERY METHODS ====================

  async findAll(filters?: {
    challengeId?: string;
    stage?: QuestionStage;
    phase?: string;
  }) {
    const questions = await this.prisma.question.findMany({
      where: {
        challengeId: filters?.challengeId,
        stage: filters?.stage,
        phase: filters?.phase,
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
      orderBy: [{ stage: 'asc' }, { phase: 'asc' }, { position: 'asc' }],
    });

    // Enrich all questions with media and configurations (including subQuestions recursively)
    const enrichedQuestions = questions.map((question) =>
      this.questionMediaService.enrichQuestionWithMedia(question),
    );

    // Format each question based on its type
    return this.questionFormatterService.formatQuestions(enrichedQuestions);
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

    const whereClause = questionId ? `AND q.id = '${questionId}'` : '';

    return this.prisma.$queryRawUnsafe(`
      SELECT
        q.id as "questionId",
        q.text as "questionText",
        q.type as "questionType",
        COUNT(sa.id)::int as "totalAttempts",
        SUM(CASE WHEN sa."isCorrect" THEN 1 ELSE 0 END)::int as "correctAnswers",
        ROUND(AVG(sa."timeSpent"))::int as "averageTime",
        ROUND(AVG(CASE WHEN sa."isCorrect" THEN 100 ELSE 0 END), 2) as "successRate"
      FROM questions q
      INNER JOIN student_answers sa ON sa."questionId" = q.id
      INNER JOIN students s ON s.id = sa."studentId"
      WHERE s."schoolId" = '${schoolId}'
      ${whereClause}
      GROUP BY q.id, q.text, q.type
      ORDER BY "totalAttempts" DESC
    `);
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
