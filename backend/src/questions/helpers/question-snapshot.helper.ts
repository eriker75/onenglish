import { Question } from '@prisma/client';

/**
 * Question snapshot interface
 * Captures essential question data at the time of answering
 */
export interface QuestionSnapshot {
  text: string;
  type: string;
  instructions: string;
  points: number;
  timeLimit: number;
  maxAttempts: number;
  stage: string;
  phase: string;
  // Optional fields that may exist depending on question type
  content?: any;
  options?: any;
  answer?: any;
}

/**
 * Creates a lightweight snapshot of a question
 * This preserves the question state at the moment a student answers it
 *
 * @param question - The question entity
 * @returns QuestionSnapshot object
 */
export function createQuestionSnapshot(question: Question): QuestionSnapshot {
  return {
    text: question.text,
    type: question.type,
    instructions: question.instructions,
    points: question.points,
    timeLimit: question.timeLimit,
    maxAttempts: question.maxAttempts,
    stage: question.stage,
    phase: question.phase,
    // Only include these if they exist
    ...(question.content && { content: question.content }),
    ...(question.options && { options: question.options }),
    ...(question.answer && { answer: question.answer }),
  };
}

/**
 * Validates if a question snapshot has all required fields
 *
 * @param snapshot - The snapshot to validate
 * @returns true if valid, false otherwise
 */
export function isValidQuestionSnapshot(
  snapshot: any,
): snapshot is QuestionSnapshot {
  return (
    snapshot &&
    typeof snapshot === 'object' &&
    typeof snapshot.text === 'string' &&
    typeof snapshot.type === 'string' &&
    typeof snapshot.instructions === 'string' &&
    typeof snapshot.points === 'number' &&
    typeof snapshot.timeLimit === 'number' &&
    typeof snapshot.maxAttempts === 'number' &&
    typeof snapshot.stage === 'string' &&
    typeof snapshot.phase === 'string'
  );
}

/**
 * Reconstructs question display data from a snapshot
 * Useful for showing historical answers with the original question
 *
 * @param snapshot - The question snapshot
 * @returns Formatted question data for display
 */
export function reconstructQuestionFromSnapshot(snapshot: QuestionSnapshot) {
  return {
    text: snapshot.text,
    type: snapshot.type,
    instructions: snapshot.instructions,
    points: snapshot.points,
    timeLimit: snapshot.timeLimit,
    maxAttempts: snapshot.maxAttempts,
    stage: snapshot.stage,
    phase: snapshot.phase,
    content: snapshot.content,
    options: snapshot.options,
    // Note: We don't expose the answer in the reconstruction
    // as it should only be used for validation purposes
  };
}
