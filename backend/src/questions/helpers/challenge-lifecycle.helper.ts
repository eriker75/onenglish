import { PrismaService } from '../../database/prisma.service';

/**
 * Helper functions for managing challenge lifecycle
 * Handles soft delete, archiving, and activation/deactivation
 */

/**
 * Soft deletes a challenge instead of permanently removing it
 * This is REQUIRED when the challenge has student answers to preserve data integrity
 *
 * @param prisma - Prisma service instance
 * @param challengeId - ID of the challenge to soft delete
 * @returns Updated challenge with deletedAt timestamp
 */
export async function softDeleteChallenge(
  prisma: PrismaService,
  challengeId: string,
) {
  return prisma.challenge.update({
    where: { id: challengeId },
    data: {
      deletedAt: new Date(),
      isActive: false,
    } as any, // Type will be correct after migration
  });
}

/**
 * Restores a soft-deleted challenge
 *
 * @param prisma - Prisma service instance
 * @param challengeId - ID of the challenge to restore
 * @returns Updated challenge with deletedAt cleared
 */
export async function restoreChallenge(
  prisma: PrismaService,
  challengeId: string,
) {
  return prisma.challenge.update({
    where: { id: challengeId },
    data: {
      deletedAt: null,
      isActive: true,
    } as any, // Type will be correct after migration
  });
}

/**
 * Archives a challenge (for old challenges that should be hidden but not deleted)
 * Archived challenges can still be viewed for historical purposes
 *
 * @param prisma - Prisma service instance
 * @param challengeId - ID of the challenge to archive
 * @returns Updated challenge with archivedAt timestamp
 */
export async function archiveChallenge(
  prisma: PrismaService,
  challengeId: string,
) {
  return prisma.challenge.update({
    where: { id: challengeId },
    data: {
      archivedAt: new Date(),
      isActive: false, // Archived challenges are not active
    } as any, // Type will be correct after migration
  });
}

/**
 * Unarchives a challenge
 *
 * @param prisma - Prisma service instance
 * @param challengeId - ID of the challenge to unarchive
 * @returns Updated challenge with archivedAt cleared
 */
export async function unarchiveChallenge(
  prisma: PrismaService,
  challengeId: string,
) {
  return prisma.challenge.update({
    where: { id: challengeId },
    data: {
      archivedAt: null,
      isActive: true,
    } as any, // Type will be correct after migration
  });
}

/**
 * Deactivates a challenge without deleting or archiving it
 * Useful for temporarily disabling challenges
 *
 * @param prisma - Prisma service instance
 * @param challengeId - ID of the challenge to deactivate
 * @returns Updated challenge
 */
export async function deactivateChallenge(
  prisma: PrismaService,
  challengeId: string,
) {
  return prisma.challenge.update({
    where: { id: challengeId },
    data: {
      isActive: false,
    } as any, // Type will be correct after migration
  });
}

/**
 * Activates a previously deactivated challenge
 *
 * @param prisma - Prisma service instance
 * @param challengeId - ID of the challenge to activate
 * @returns Updated challenge
 */
export async function activateChallenge(
  prisma: PrismaService,
  challengeId: string,
) {
  return prisma.challenge.update({
    where: { id: challengeId },
    data: {
      isActive: true,
    } as any, // Type will be correct after migration
  });
}

/**
 * Checks if a challenge has any student answers
 * This is critical before attempting to delete a challenge
 *
 * @param prisma - Prisma service instance
 * @param challengeId - ID of the challenge to check
 * @returns true if the challenge has been answered, false otherwise
 */
export async function challengeHasStudentAnswers(
  prisma: PrismaService,
  challengeId: string,
): Promise<boolean> {
  const count = await prisma.studentAnswer.count({
    where: { challengeId },
  });
  return count > 0;
}

/**
 * Checks if a challenge can be safely hard-deleted
 * A challenge can only be hard-deleted if it has no student answers, questions, or assignments
 *
 * @param prisma - Prisma service instance
 * @param challengeId - ID of the challenge to check
 * @returns Object with deletion safety status and reasons
 */
export async function canHardDeleteChallenge(
  prisma: PrismaService,
  challengeId: string,
): Promise<{
  canDelete: boolean;
  reasons: string[];
}> {
  const reasons: string[] = [];

  // Check for student answers
  const answerCount = await prisma.studentAnswer.count({
    where: { challengeId },
  });
  if (answerCount > 0) {
    reasons.push(`Has ${answerCount} student answers`);
  }

  // Check for questions
  const questionCount = await prisma.question.count({
    where: { challengeId },
  });
  if (questionCount > 0) {
    reasons.push(`Has ${questionCount} questions`);
  }

  // Check for student challenge assignments
  const assignmentCount = await prisma.studentChallenge.count({
    where: { challengeId },
  });
  if (assignmentCount > 0) {
    reasons.push(`Has ${assignmentCount} student assignments`);
  }

  // Check for school assignments
  const schoolAssignmentCount = await prisma.schoolChallenge.count({
    where: { challengeId },
  });
  if (schoolAssignmentCount > 0) {
    reasons.push(`Has ${schoolAssignmentCount} school assignments`);
  }

  return {
    canDelete: reasons.length === 0,
    reasons,
  };
}

/**
 * Safe delete function that automatically determines whether to soft or hard delete
 * This is the recommended way to delete challenges
 *
 * LOGIC:
 * - If has student answers → SOFT DELETE (preserve historical data)
 * - If no student answers → CASCADE DELETE (clean removal of all related data + files)
 *
 * @param prisma - Prisma service instance
 * @param challengeId - ID of the challenge to delete
 * @param deleteMediaFiles - Function to delete associated media files (optional)
 * @returns Result object indicating what type of deletion was performed
 */
export async function safeDeleteChallenge(
  prisma: PrismaService,
  challengeId: string,
  deleteMediaFiles?: (mediaFileIds: string[]) => Promise<void>,
): Promise<{
  deletionType: 'soft' | 'hard';
  message: string;
  deletedCount?: {
    questions: number;
    mediaFiles: number;
  };
}> {
  // Check if challenge has student answers
  const hasAnswers = await challengeHasStudentAnswers(prisma, challengeId);

  if (hasAnswers) {
    // HAS ANSWERS → SOFT DELETE (preserve data)
    await softDeleteChallenge(prisma, challengeId);

    return {
      deletionType: 'soft',
      message: 'Challenge soft-deleted to preserve student answer history',
    };
  } else {
    // NO ANSWERS → HARD DELETE (cascade delete everything)

    // 1. Get all questions and their media files before deletion
    const questions = await prisma.question.findMany({
      where: { challengeId },
      include: {
        questionMedia: {
          include: {
            mediaFile: true,
          },
        },
      },
    });

    const questionCount = questions.length;
    const mediaFileIds = questions.flatMap(q =>
      q.questionMedia.map(qm => qm.mediaFileId)
    );
    const uniqueMediaFileIds = [...new Set(mediaFileIds)];

    // 2. Delete media files from storage (if function provided)
    if (deleteMediaFiles && uniqueMediaFileIds.length > 0) {
      await deleteMediaFiles(uniqueMediaFileIds);
    }

    // 3. Delete questions (cascade will delete questionMedia, configurations, etc.)
    await prisma.question.deleteMany({
      where: { challengeId },
    });

    // 4. Delete media files from database
    if (uniqueMediaFileIds.length > 0) {
      await prisma.mediaFile.deleteMany({
        where: {
          id: { in: uniqueMediaFileIds },
        },
      });
    }

    // 5. Finally, delete the challenge
    await prisma.challenge.delete({
      where: { id: challengeId },
    });

    return {
      deletionType: 'hard',
      message: `Challenge and all related data permanently deleted (no student answers existed)`,
      deletedCount: {
        questions: questionCount,
        mediaFiles: uniqueMediaFileIds.length,
      },
    };
  }
}

/**
 * Default where clause for querying active challenges only
 * Use this in queries to automatically exclude soft-deleted and archived challenges
 */
export const activeChallengesWhere = {
  deletedAt: null,
  archivedAt: null,
  isActive: true,
};

/**
 * Where clause for including archived challenges (but not deleted)
 */
export const archivedChallengesWhere = {
  deletedAt: null,
  archivedAt: { not: null },
};
