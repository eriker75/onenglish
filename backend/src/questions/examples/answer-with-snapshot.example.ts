/**
 * EXAMPLE: How to implement question snapshots when students submit answers
 *
 * This example shows the recommended pattern for:
 * 1. Validating the answer
 * 2. Creating a question snapshot
 * 3. Saving the answer with snapshot
 * 4. Handling the questionId reference properly
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { createQuestionSnapshot, createChallengeSnapshot } from '../helpers';

@Injectable()
export class ExampleAnswerService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Example: Submit a student answer with snapshot
   */
  async submitAnswer(
    studentId: string,
    questionId: string,
    userAnswer: any,
    timeSpent?: number,
  ) {
    // 1. Fetch the question with challenge (including validation)
    const question = await this.prisma.question.findUnique({
      where: {
        id: questionId,
      },
      include: {
        challenge: true, // Include challenge for snapshot
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    // Validate question is active (after migration)
    // if (!question.isActive || question.deletedAt) {
    //   throw new NotFoundException('Question is no longer available');
    // }

    // 2. Create snapshots of both question and challenge
    const questionSnapshot = createQuestionSnapshot(question);
    const challengeSnapshot = createChallengeSnapshot(question.challenge);

    // 3. Validate the answer (your validation logic here)
    const isCorrect = this.validateAnswer(userAnswer, question.answer);

    // 4. Calculate points earned
    const pointsEarned = isCorrect ? question.points : 0;

    // 5. Save the answer with snapshots
    const studentAnswer = await this.prisma.studentAnswer.create({
      data: {
        studentId,
        questionId, // Reference (can be null later if question deleted)
        challengeId: question.challengeId,
        questionSnapshot, // Frozen copy of question data
        // questionVersion: question.version, // Track which version (after migration)
        challengeSnapshot, // Frozen copy of challenge context
        userAnswer,
        isCorrect,
        timeSpent: timeSpent || 0,
        pointsEarned,
        attemptNumber: await this.getNextAttemptNumber(studentId, questionId),
      } as any, // Type will be correct after migration + prisma generate
    });

    return studentAnswer;
  }

  /**
   * Example: Retrieve answer history with original question data
   */
  async getAnswerHistory(studentId: string, questionId: string) {
    const answers = await this.prisma.studentAnswer.findMany({
      where: {
        studentId,
        questionId,
      },
      include: {
        question: true, // Current state of question (may be null if deleted)
      },
      orderBy: {
        answeredAt: 'desc',
      },
    });

    return answers.map((answer) => ({
      id: answer.id,
      userAnswer: answer.userAnswer,
      isCorrect: answer.isCorrect,
      pointsEarned: answer.pointsEarned,
      timeSpent: answer.timeSpent,
      answeredAt: answer.answeredAt,
      attemptNumber: answer.attemptNumber,

      // The question as it was when answered (from snapshot)
      questionAtTimeOfAnswer: answer.questionSnapshot,

      // Current state of the question (may be different or null)
      currentQuestion: answer.question,

      // Helpful flags
      wasQuestionModified: answer.question
        ? answer.question.version !== answer.questionVersion
        : null,
      isQuestionDeleted: !answer.question || answer.question.deletedAt !== null,
    }));
  }

  /**
   * Example: Get student progress with snapshot data
   */
  async getStudentProgress(studentId: string, challengeId: string) {
    const answers = await this.prisma.studentAnswer.findMany({
      where: {
        studentId,
        challengeId,
      },
      include: {
        question: {
          select: {
            id: true,
            stage: true,
            isActive: true,
            deletedAt: true,
          },
        },
      },
    });

    const totalQuestions = await this.prisma.question.count({
      where: {
        challengeId,
        isActive: true,
        deletedAt: null,
      },
    });

    const totalPoints = answers.reduce(
      (sum, answer) => sum + answer.pointsEarned,
      0
    );

    const correctAnswers = answers.filter((answer) => answer.isCorrect).length;

    // Calculate max possible points from snapshots
    // (uses snapshot data since questions may have been modified)
    const maxPossiblePoints = answers.reduce(
      (sum, answer) => sum + (answer.questionSnapshot as any).points,
      0
    );

    return {
      totalQuestions,
      answeredQuestions: answers.length,
      correctAnswers,
      totalPoints,
      maxPossiblePoints,
      successRate:
        answers.length > 0
          ? ((correctAnswers / answers.length) * 100).toFixed(2)
          : 0,
      progress: ((answers.length / totalQuestions) * 100).toFixed(2),
    };
  }

  /**
   * Example: Admin view - detect questions that need attention
   */
  async getQuestionsNeedingReview(challengeId: string) {
    const questions = await this.prisma.question.findMany({
      where: {
        challengeId,
        isActive: true,
      },
      include: {
        studentAnswers: {
          select: {
            id: true,
            questionVersion: true,
            isCorrect: true,
          },
        },
      },
    });

    return questions.map((question) => {
      const totalAnswers = question.studentAnswers.length;
      const correctAnswers = question.studentAnswers.filter(
        (a) => a.isCorrect
      ).length;
      const successRate =
        totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;

      // Detect if question was modified after being answered
      const versionsUsed = new Set(
        question.studentAnswers.map((a) => a.questionVersion)
      );
      const hasMultipleVersions = versionsUsed.size > 1;

      return {
        questionId: question.id,
        currentVersion: question.version,
        totalAnswers,
        correctAnswers,
        successRate: successRate.toFixed(2),
        hasMultipleVersions,
        versionsAnswered: Array.from(versionsUsed),
        // Flag questions with low success rate for review
        needsReview: successRate < 30 && totalAnswers >= 5,
      };
    });
  }

  // Helper methods

  private async getNextAttemptNumber(
    studentId: string,
    questionId: string,
  ): Promise<number> {
    const lastAttempt = await this.prisma.studentAnswer.findFirst({
      where: { studentId, questionId },
      orderBy: { attemptNumber: 'desc' },
    });

    return lastAttempt ? lastAttempt.attemptNumber + 1 : 1;
  }

  private validateAnswer(userAnswer: any, correctAnswer: any): boolean {
    // Your validation logic here
    // This is simplified - implement based on question type
    return JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);
  }
}
