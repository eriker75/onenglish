import { PrismaService } from '../../database/prisma.service';

/**
 * Helper functions for managing question lifecycle
 * Handles soft delete, versioning, and activation/deactivation
 */

/**
 * Safe delete function for questions
 * Automatically determines whether to soft or hard delete based on student answers
 *
 * LOGIC:
 * - If has student answers → SOFT DELETE (preserve historical data)
 * - If no student answers → CASCADE DELETE (clean removal of question + subquestions + media files)
 *
 * @param prisma - Prisma service instance
 * @param questionId - ID of the question to delete
 * @param deleteMediaFiles - Function to delete associated media files (optional)
 * @returns Result object indicating what type of deletion was performed
 */
export async function safeDeleteQuestion(
  prisma: PrismaService,
  questionId: string,
  deleteMediaFiles?: (mediaFileIds: string[]) => Promise<void>,
): Promise<{
  deletionType: 'soft' | 'hard';
  message: string;
  deletedCount?: {
    subQuestions: number;
    mediaFiles: number;
  };
}> {
  // Check if question has student answers
  const hasAnswers = await hasStudentAnswers(prisma, questionId);

  if (hasAnswers) {
    // HAS ANSWERS → SOFT DELETE (preserve data)
    await softDeleteQuestion(prisma, questionId);

    return {
      deletionType: 'soft',
      message: 'Question soft-deleted to preserve student answer history',
    };
  } else {
    // NO ANSWERS → HARD DELETE (cascade delete everything)

    // 1. Get question with subquestions and media
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        subQuestions: {
          include: {
            questionMedia: {
              include: {
                mediaFile: true,
              },
            },
          },
        },
        questionMedia: {
          include: {
            mediaFile: true,
          },
        },
      },
    });

    if (!question) {
      throw new Error(`Question with ID ${questionId} not found`);
    }

    // 2. Collect all media file IDs (parent + subquestions)
    const parentMediaIds = question.questionMedia.map((qm) => qm.mediaFileId);
    const subQuestionMediaIds = question.subQuestions.flatMap((sq) =>
      sq.questionMedia.map((qm) => qm.mediaFileId),
    );
    const allMediaFileIds = [...parentMediaIds, ...subQuestionMediaIds];
    const uniqueMediaFileIds = [...new Set(allMediaFileIds)];

    const subQuestionCount = question.subQuestions.length;

    // 3. Delete media files from storage (if function provided)
    if (deleteMediaFiles && uniqueMediaFileIds.length > 0) {
      await deleteMediaFiles(uniqueMediaFileIds);
    }

    // 4. Delete subquestions first (cascade will delete their media relations)
    if (subQuestionCount > 0) {
      await prisma.question.deleteMany({
        where: {
          parentQuestionId: questionId,
        },
      });
    }

    // 5. Delete the parent question (cascade will delete questionMedia, configurations)
    await prisma.question.delete({
      where: { id: questionId },
    });

    // 6. Delete media files from database
    if (uniqueMediaFileIds.length > 0) {
      await prisma.mediaFile.deleteMany({
        where: {
          id: { in: uniqueMediaFileIds },
        },
      });
    }

    return {
      deletionType: 'hard',
      message: `Question and all related data permanently deleted (no student answers existed)`,
      deletedCount: {
        subQuestions: subQuestionCount,
        mediaFiles: uniqueMediaFileIds.length,
      },
    };
  }
}

/**
 * Soft deletes a question instead of permanently removing it
 * This preserves historical data integrity for student answers
 *
 * @param prisma - Prisma service instance
 * @param questionId - ID of the question to soft delete
 * @returns Updated question with deletedAt timestamp
 */
export async function softDeleteQuestion(
  prisma: PrismaService,
  questionId: string,
) {
  return prisma.question.update({
    where: { id: questionId },
    data: {
      deletedAt: new Date(),
      isActive: false,
    } as any, // Type will be correct after migration
  });
}

/**
 * Restores a soft-deleted question
 *
 * @param prisma - Prisma service instance
 * @param questionId - ID of the question to restore
 * @returns Updated question with deletedAt cleared
 */
export async function restoreQuestion(
  prisma: PrismaService,
  questionId: string,
) {
  return prisma.question.update({
    where: { id: questionId },
    data: {
      deletedAt: null,
      isActive: true,
    } as any, // Type will be correct after migration
  });
}

/**
 * Deactivates a question without deleting it
 * Useful for temporarily disabling questions
 *
 * @param prisma - Prisma service instance
 * @param questionId - ID of the question to deactivate
 * @returns Updated question
 */
export async function deactivateQuestion(
  prisma: PrismaService,
  questionId: string,
) {
  return prisma.question.update({
    where: { id: questionId },
    data: {
      isActive: false,
    } as any, // Type will be correct after migration
  });
}

/**
 * Activates a previously deactivated question
 *
 * @param prisma - Prisma service instance
 * @param questionId - ID of the question to activate
 * @returns Updated question
 */
export async function activateQuestion(
  prisma: PrismaService,
  questionId: string,
) {
  return prisma.question.update({
    where: { id: questionId },
    data: {
      isActive: true,
    } as any, // Type will be correct after migration
  });
}

/**
 * Increments the version number when a question is significantly modified
 * This helps track which version of a question a student answered
 *
 * @param prisma - Prisma service instance
 * @param questionId - ID of the question to version
 * @returns Updated question with incremented version
 */
export async function incrementQuestionVersion(
  prisma: PrismaService,
  questionId: string,
) {
  return prisma.question.update({
    where: { id: questionId },
    data: {
      version: {
        increment: 1,
      },
    } as any, // Type will be correct after migration
  });
}

/**
 * Checks if a question has any student answers
 * Useful for determining if a question should be edited or versioned
 *
 * @param prisma - Prisma service instance
 * @param questionId - ID of the question to check
 * @returns true if the question has been answered, false otherwise
 */
export async function hasStudentAnswers(
  prisma: PrismaService,
  questionId: string,
): Promise<boolean> {
  const count = await prisma.studentAnswer.count({
    where: { questionId },
  });
  return count > 0;
}

/**
 * Default where clause for querying active questions only
 * Use this in queries to automatically exclude soft-deleted questions
 */
export const activeQuestionsWhere = {
  deletedAt: null,
  isActive: true,
};
