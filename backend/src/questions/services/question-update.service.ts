import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class QuestionUpdateService {
  constructor(private readonly prisma: PrismaService) {}

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

    // Extraer configuraciones de wordbox si existen
    const { gridWidth, gridHeight, maxWords, ...questionData } = updateData;

    // Update the question
    const updatedQuestion = await this.prisma.question.update({
      where: { id: questionId },
      data: questionData,
    });

    // Actualizar configuraciones de wordbox si se proporcionaron
    if (
      question.type === 'wordbox' &&
      (gridWidth !== undefined ||
        gridHeight !== undefined ||
        maxWords !== undefined)
    ) {
      // Obtener configuraciones existentes
      const existingConfigs =
        await this.prisma.questionConfiguration.findMany({
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

    // If this is a sub-question and points were updated, recalculate parent points
    if (question.parentQuestionId && updateData.points !== undefined) {
      await this.recalculateParentPoints(question.parentQuestionId);
    }

    return updatedQuestion;
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
    const updatedQuestion = await this.prisma.question.update({
      where: { id },
      data: updateData,
    });

    // If points were updated, recalculate parent points
    if (question.parentQuestionId && updateData.points !== undefined) {
      await this.recalculateParentPoints(question.parentQuestionId);
    }

    return updatedQuestion;
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
   * Update question position within phase
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
   * Update question phase
   */
  async updateQuestionPhase(questionId: string, phase: string): Promise<any> {
    // Validate phase format (should be "phase_1", "phase_2", etc.)
    const phaseRegex = /^phase_\d+$/;
    if (!phaseRegex.test(phase)) {
      throw new BadRequestException(
        'Phase must follow format: phase_1, phase_2, etc.',
      );
    }
    return this.updateQuestion(questionId, { phase });
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
   * Delete a question (and cascade to sub-questions if parent)
   */
  async deleteQuestion(questionId: string): Promise<void> {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: {
        subQuestions: true,
        parentQuestion: true,
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // Delete the question (will cascade to sub-questions due to Prisma schema)
    await this.prisma.question.delete({
      where: { id: questionId },
    });

    // If this was a sub-question, recalculate parent points
    if (question.parentQuestionId) {
      await this.recalculateParentPoints(question.parentQuestionId);
    }
  }
}
