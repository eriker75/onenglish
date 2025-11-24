import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { QuestionStage, ValidationMethod } from '@prisma/client';
import { QuestionMediaService } from './question-media.service';
import { QuestionFormatterService } from './question-formatter.service';

@Injectable()
export class QuestionUpdateService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly questionMediaService: QuestionMediaService,
    private readonly questionFormatterService: QuestionFormatterService,
  ) {}

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

  /**
   * Update a question and recalculate parent points if it's a sub-question
   */
  async updateQuestion(questionId: string, updateData: any): Promise<any> {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: { parentQuestion: true },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // Check if question is deleted
    if (question.deletedAt !== null) {
      throw new BadRequestException(
        'Cannot update a deleted question. This question was deleted and is archived for data integrity.',
      );
    }

    // Extraer configuraciones de wordbox y word_associations si existen
    const { gridWidth, gridHeight, maxWords, maxAssociations, ...restData } = updateData;

    // Question types that always have GRAMMAR stage
    const grammarQuestionTypes = [
      'unscramble',
      'tenses',
      'read_it',
      'tag_it',
      'report_it',
    ];

    // Question types that always have LISTENING stage
    const listeningQuestionTypes = [
      'word_match',
      'gossip',
      'topic_based_audio',
      'lyrics_training',
    ];

    // Question types that always have WRITING stage
    const writingQuestionTypes = [
      'sentence_maker',
      'fast_test',
      'tales',
    ];

    // Question types that always have SPEAKING stage
    const speakingQuestionTypes = [
      'superbrain',
      'tell_me_about_it',
      'debate',
    ];

    // Remove invalid fields for Prisma update (fields that cannot be updated directly)
    const {
      media, // Media files must be handled separately
      image,
      audio,
      video,
      images,
      audios,
      subQuestions, // Sub-questions must be handled separately
      challengeId, // Cannot change challenge relationship
      stage, // Stage is handled separately for grammar/listening/writing/speaking question types
      stance, // For debate questions, stance is stored in answer field
      ...questionData
    } = restData;

    // For grammar question types, always set stage to GRAMMAR
    if (grammarQuestionTypes.includes(question.type)) {
      questionData.stage = QuestionStage.GRAMMAR;
    }

    // For listening question types, always set stage to LISTENING
    if (listeningQuestionTypes.includes(question.type)) {
      questionData.stage = QuestionStage.LISTENING;
    }

    // For writing question types, always set stage to WRITING
    if (writingQuestionTypes.includes(question.type)) {
      questionData.stage = QuestionStage.WRITING;
    }

    // For speaking question types, always set stage to SPEAKING
    if (speakingQuestionTypes.includes(question.type)) {
      questionData.stage = QuestionStage.SPEAKING;
    }

    // Validate answer is in options for multiple choice question types
    const multipleChoiceTypes = [
      'image_to_multiple_choices',
      'word_match',
      'fast_test',
      'lyrics_training',
    ];

    if (multipleChoiceTypes.includes(question.type)) {
      // Determine final values after update
      const finalOptions = questionData.options || question.options;
      const finalAnswer = questionData.answer || question.answer;

      // Validate answer is in options (case-insensitive for image_to_multiple_choices)
      if (Array.isArray(finalOptions) && finalAnswer) {
        const isValid =
          question.type === 'image_to_multiple_choices'
            ? finalOptions
                .map((opt) => opt.toLowerCase())
                .includes(finalAnswer.toLowerCase())
            : finalOptions.includes(finalAnswer);

        if (!isValid) {
          throw new BadRequestException(
            `Answer "${finalAnswer}" must be one of the options: ${finalOptions.join(', ')}`,
          );
        }
      }
    }

    // Validate wordbox grid has no repeated letters
    if (question.type === 'wordbox' && questionData.content) {
      this.validateWordboxGrid(questionData.content);
    }

    // For debate questions, map stance to answer field
    if (question.type === 'debate' && stance !== undefined) {
      questionData.answer = stance;
    }

    // Update the question
    await this.prisma.question.update({
      where: { id: questionId },
      data: questionData,
    });

    // Handle single media file update if provided (media, image, audio, or video)
    const singleFile = media || image || audio || video;
    if (singleFile && !Array.isArray(singleFile)) {
      // Upload new media file
      const uploadedFile =
        await this.questionMediaService.uploadSingleFile(singleFile);

      // Delete old media file records
      await this.prisma.questionMedia.deleteMany({
        where: { questionId },
      });

      // Attach new media file
      await this.questionMediaService.attachMediaFiles(questionId, [
        {
          id: uploadedFile.id,
          context: 'main',
          position: 0,
        },
      ]);
    }

    // Handle multiple media files update if provided (images, audios, or media array)
    const multipleFiles = images || audios || (Array.isArray(media) ? media : null);
    if (multipleFiles && Array.isArray(multipleFiles)) {
      // Upload all files
      const uploadedFiles = await Promise.all(
        multipleFiles.map((file) =>
          this.questionMediaService.uploadSingleFile(file),
        ),
      );

      // Delete old media file records
      await this.prisma.questionMedia.deleteMany({
        where: { questionId },
      });

      // Attach new media files
      await this.questionMediaService.attachMediaFiles(
        questionId,
        uploadedFiles.map((file, index) => ({
          id: file.id,
          context: 'main',
          position: index,
        })),
      );
    }

    // Actualizar configuraciones de wordbox si se proporcionaron
    if (
      question.type === 'wordbox' &&
      (gridWidth !== undefined ||
        gridHeight !== undefined ||
        maxWords !== undefined)
    ) {
      // Obtener configuraciones existentes
      const existingConfigs = await this.prisma.questionConfiguration.findMany({
        where: { questionId },
      });

      // Helper para actualizar o crear configuración
      const upsertConfig = async (key: string, value: number) => {
        const existing = existingConfigs.find((c) => c.metaKey === key);
        if (existing) {
          await this.prisma.questionConfiguration.update({
            where: { id: existing.id },
            data: { metaValue: String(value) },
          });
        } else {
          await this.prisma.questionConfiguration.create({
            data: {
              questionId,
              metaKey: key,
              metaValue: String(value),
            },
          });
        }
      };

      // Actualizar cada configuración si fue proporcionada
      if (gridWidth !== undefined) {
        await upsertConfig('gridWidth', gridWidth);
      }
      if (gridHeight !== undefined) {
        await upsertConfig('gridHeight', gridHeight);
      }
      if (maxWords !== undefined) {
        await upsertConfig('maxWords', maxWords);
      }
    }

    // Actualizar configuraciones de word_associations si se proporcionó maxAssociations
    if (question.type === 'word_associations' && maxAssociations !== undefined) {
      // Obtener configuraciones existentes
      const existingConfigs = await this.prisma.questionConfiguration.findMany({
        where: { questionId },
      });

      // Helper para actualizar o crear configuración
      const upsertConfig = async (key: string, value: number) => {
        const existing = existingConfigs.find((c) => c.metaKey === key);
        if (existing) {
          await this.prisma.questionConfiguration.update({
            where: { id: existing.id },
            data: { metaValue: String(value) },
          });
        } else {
          await this.prisma.questionConfiguration.create({
            data: {
              questionId,
              metaKey: key,
              metaValue: String(value),
            },
          });
        }
      };

      await upsertConfig('maxAssociations', maxAssociations);
    }

    // Handle sub-questions update for read_it and topic_based_audio
    if (subQuestions !== undefined && (question.type === 'read_it' || question.type === 'topic_based_audio')) {
      // Parse subQuestions from JSON string
      let parsedSubQuestions: any[];
      try {
        parsedSubQuestions = typeof subQuestions === 'string' 
          ? JSON.parse(subQuestions) 
          : subQuestions;
      } catch (error) {
        throw new BadRequestException(
          'subQuestions must be a valid JSON string array',
        );
      }

      // Validate that it's an array
      if (!Array.isArray(parsedSubQuestions) || parsedSubQuestions.length === 0) {
        throw new BadRequestException('Must provide at least one sub-question');
      }

      // Validate each sub-question structure based on question type
      parsedSubQuestions.forEach((sub, index) => {
        if (question.type === 'read_it') {
          // Validate read_it sub-question structure
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
        } else if (question.type === 'topic_based_audio') {
          // Validate topic_based_audio sub-question structure
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
        }
      });

      // Delete all existing sub-questions
      await this.prisma.question.deleteMany({
        where: { parentQuestionId: questionId },
      });

      // Create new sub-questions
      const subQuestionType = question.type === 'read_it' 
        ? 'read_it_subquestion' 
        : 'topic_based_audio_subquestion';

      await this.prisma.question.createMany({
        data: parsedSubQuestions.map((sub, index) => {
          if (question.type === 'read_it') {
            return {
              challengeId: question.challengeId,
              stage: question.stage,
              position: index + 1,
              type: subQuestionType,
              points: sub.points,
              timeLimit: 0,
              maxAttempts: 0,
              text: sub.content,
              instructions: 'Select true or false',
              validationMethod: 'AUTO' as ValidationMethod,
              content: sub.content,
              options: JSON.parse(JSON.stringify(sub.options)),
              answer: sub.answer,
              parentQuestionId: questionId,
            };
          } else {
            return {
              challengeId: question.challengeId,
              stage: question.stage,
              position: index + 1,
              type: subQuestionType,
              points: sub.points,
              timeLimit: 0,
              maxAttempts: 0,
              text: 'Sub-question',
              content: sub.content,
              instructions: 'Select the correct option',
              validationMethod: 'AUTO' as ValidationMethod,
              options: JSON.parse(JSON.stringify(sub.options)),
              answer: sub.answer,
              parentQuestionId: questionId,
            };
          }
        }),
      });

      // Recalculate parent points
      const totalPoints = parsedSubQuestions.reduce(
        (sum, sub) => sum + sub.points,
        0,
      );

      await this.prisma.question.update({
        where: { id: questionId },
        data: { points: totalPoints },
      });
    }

    // If this is a sub-question and points were updated, recalculate parent points
    if (question.parentQuestionId && updateData.points !== undefined) {
      await this.recalculateParentPoints(question.parentQuestionId);
    }

    // Fetch the updated question with all relations (same as findOne)
    const questionWithRelations = await this.prisma.question.findUnique({
      where: { id: questionId },
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

    if (!questionWithRelations) {
      throw new NotFoundException('Question not found after update');
    }

    // Enrich with media and configurations (including subQuestions recursively)
    const enrichedQuestion =
      this.questionMediaService.enrichQuestionWithMedia(questionWithRelations);

    // Format based on question type for optimal frontend structure
    const formattedQuestion =
      this.questionFormatterService.formatQuestion(enrichedQuestion);

    if (!formattedQuestion) {
      throw new BadRequestException(
        'Failed to format question. Invalid question type or data.',
      );
    }

    return formattedQuestion;
  }

  /**
   * Recalculate parent question points based on sum of sub-questions
   */
  async recalculateParentPoints(parentQuestionId: string): Promise<void> {
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

  /**
   * Calculate total points when creating a parent question with sub-questions
   */
  calculatePointsFromSubQuestions(subQuestions: any[]): number {
    return subQuestions.reduce((sum, sq) => sum + (sq.points || 0), 0);
  }

  /**
   * Update question text
   */
  async updateQuestionText(questionId: string, text: string): Promise<any> {
    return this.updateQuestion(questionId, { text });
  }

  /**
   * Update question instructions
   */
  async updateQuestionInstructions(
    questionId: string,
    instructions: string,
  ): Promise<any> {
    return this.updateQuestion(questionId, { instructions });
  }

  /**
   * Update question time limit
   */
  async updateQuestionTimeLimit(
    questionId: string,
    timeLimit: number,
  ): Promise<any> {
    if (timeLimit < 1) {
      throw new BadRequestException('Time limit must be at least 1 second');
    }
    return this.updateQuestion(questionId, { timeLimit });
  }

  /**
   * Update question max attempts
   */
  async updateQuestionMaxAttempts(
    questionId: string,
    maxAttempts: number,
  ): Promise<any> {
    if (maxAttempts < 1) {
      throw new BadRequestException('Max attempts must be at least 1');
    }
    return this.updateQuestion(questionId, { maxAttempts });
  }

  /**
   * Update question points (with parent recalculation if needed)
   */
  async updateQuestionPoints(questionId: string, points: number): Promise<any> {
    if (points < 0) {
      throw new BadRequestException('Points cannot be negative');
    }
    return this.updateQuestion(questionId, { points });
  }

  /**
   * Update question content (JSON field)
   */
  async updateQuestionContent(questionId: string, content: any): Promise<any> {
    return this.updateQuestion(questionId, { content });
  }

  /**
   * Update question options (JSON field)
   */
  async updateQuestionOptions(questionId: string, options: any): Promise<any> {
    return this.updateQuestion(questionId, { options });
  }

  /**
   * Update question answer (JSON field)
   */
  async updateQuestionAnswer(questionId: string, answer: any): Promise<any> {
    return this.updateQuestion(questionId, { answer });
  }

  /**
   * Update question position within challenge
   */
  async updateQuestionPosition(
    questionId: string,
    position: number,
  ): Promise<any> {
    if (position < 1) {
      throw new BadRequestException('Position must be at least 1');
    }
    return this.updateQuestion(questionId, { position });
  }

  /**
   * Bulk update multiple questions
   */
  async bulkUpdateQuestions(
    updates: { questionId: string; data: any }[],
  ): Promise<any[]> {
    const results: any[] = [];

    for (const update of updates) {
      const result = await this.updateQuestion(update.questionId, update.data);
      results.push(result);
    }

    return results;
  }

  /**
   * Delete a question (soft delete if has answers, hard delete otherwise)
   */
  async deleteQuestion(questionId: string): Promise<void> {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: {
        subQuestions: true,
        parentQuestion: true,
        studentAnswers: true, // Check if there are student answers
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // Check if question has student answers
    const hasAnswers = question.studentAnswers && question.studentAnswers.length > 0;

    if (hasAnswers) {
      // Soft delete: mark as deleted without removing data
      await this.prisma.question.update({
        where: { id: questionId },
        data: {
          deletedAt: new Date(),
          isActive: false,
        },
      });

      // If has sub-questions, soft delete them too
      if (question.subQuestions && question.subQuestions.length > 0) {
        await this.prisma.question.updateMany({
          where: { parentQuestionId: questionId },
          data: {
            deletedAt: new Date(),
            isActive: false,
          },
        });
      }
    } else {
      // Hard delete: no student answers, safe to remove
      await this.prisma.question.delete({
        where: { id: questionId },
      });
    }

    // If this was a sub-question, recalculate parent points
    if (question.parentQuestionId) {
      await this.recalculateParentPoints(question.parentQuestionId);
    }
  }
}
