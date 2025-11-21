import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
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

    // Remove invalid fields for Prisma update (fields that cannot be updated directly)
    const {
      media, // Media files must be handled separately
      challengeId, // Cannot change challenge relationship
      stage, // Cannot change stage
      ...questionData
    } = restData;

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

    // Update the question
    await this.prisma.question.update({
      where: { id: questionId },
      data: questionData,
    });

    // Handle media file update if provided
    if (media) {
      // Upload new media file
      const uploadedFile =
        await this.questionMediaService.uploadSingleFile(media);

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
   * Update a topic_based_audio_subquestion
   */
  async updateTopicBasedAudioSubquestion(
    id: string,
    updateData: any,
  ): Promise<any> {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      throw new NotFoundException('Subquestion not found');
    }

    // Check if question is deleted
    if (question.deletedAt !== null) {
      throw new BadRequestException(
        'Cannot update a deleted question. This question was deleted and is archived for data integrity.',
      );
    }

    if (question.type !== 'topic_based_audio_subquestion') {
      throw new BadRequestException(
        'Question must be of type topic_based_audio_subquestion',
      );
    }

    // Validate answer is in options if both are being updated
    const finalOptions = updateData.options || question.options;
    const finalAnswer = updateData.answer || question.answer;

    if (Array.isArray(finalOptions) && !finalOptions.includes(finalAnswer)) {
      throw new BadRequestException('Answer must be one of the options');
    }

    // Update the subquestion
    await this.prisma.question.update({
      where: { id },
      data: updateData,
    });

    // If points were updated, recalculate parent points
    if (question.parentQuestionId && updateData.points !== undefined) {
      await this.recalculateParentPoints(question.parentQuestionId);
    }

    // Fetch the updated question with all relations (same as findOne)
    const questionWithRelations = await this.prisma.question.findUnique({
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

    if (!questionWithRelations) {
      throw new NotFoundException('Subquestion not found after update');
    }

    // Enrich with media and configurations (including subQuestions recursively)
    const enrichedQuestion =
      this.questionMediaService.enrichQuestionWithMedia(questionWithRelations);

    // Format based on question type for optimal frontend structure
    const formattedQuestion =
      this.questionFormatterService.formatQuestion(enrichedQuestion);

    if (!formattedQuestion) {
      throw new BadRequestException(
        'Failed to format subquestion. Invalid question type or data.',
      );
    }

    return formattedQuestion;
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
