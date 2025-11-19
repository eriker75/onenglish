import { Challenge } from '@prisma/client';

/**
 * Challenge snapshot interface
 * Captures essential challenge data at the time of answering
 */
export interface ChallengeSnapshot {
  name: string;
  grade: string;
  type: string;
  stage?: string;
  year?: number;
  exactDate?: Date;
}

/**
 * Creates a lightweight snapshot of a challenge
 * This preserves the challenge context at the moment a student answers a question
 *
 * @param challenge - The challenge entity
 * @returns ChallengeSnapshot object
 */
export function createChallengeSnapshot(challenge: Challenge): ChallengeSnapshot {
  return {
    name: challenge.name,
    grade: challenge.grade,
    type: challenge.type,
    ...(challenge.stage && { stage: challenge.stage }),
    ...(challenge.year && { year: challenge.year }),
    ...(challenge.exactDate && { exactDate: challenge.exactDate }),
  };
}

/**
 * Validates if a challenge snapshot has all required fields
 *
 * @param snapshot - The snapshot to validate
 * @returns true if valid, false otherwise
 */
export function isValidChallengeSnapshot(snapshot: any): snapshot is ChallengeSnapshot {
  return (
    snapshot &&
    typeof snapshot === 'object' &&
    typeof snapshot.name === 'string' &&
    typeof snapshot.grade === 'string' &&
    typeof snapshot.type === 'string'
  );
}

/**
 * Reconstructs challenge display data from a snapshot
 * Useful for showing historical context in student answer views
 *
 * @param snapshot - The challenge snapshot
 * @returns Formatted challenge data for display
 */
export function reconstructChallengeFromSnapshot(snapshot: ChallengeSnapshot) {
  return {
    name: snapshot.name,
    grade: snapshot.grade,
    type: snapshot.type,
    stage: snapshot.stage,
    year: snapshot.year,
    exactDate: snapshot.exactDate,
  };
}
