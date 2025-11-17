import { QuestionStage } from "../types/Question";

export const QUERY_KEYS = {
  STUDENTS: "students" as const,
  TEACHERS: "teachers" as const,
  COORDINATORS: "coordinators" as const,
  SCHOOLS: "schools" as const,
  ADMINS: "admins" as const,
  PAYMENTS: "payments" as const,
  CHALLENGES: "challenges" as const,
  ACHIEVEMENTS: "achievements" as const,
  ANSWERS: "answers" as const,
  STATISTICS: "statistics" as const,
  QUESTIONS: "questions" as const,
  byChallengeId: (challengeId: string) =>
    [QUERY_KEYS.QUESTIONS, "challenge", challengeId] as const,
  byStage: (challengeId: string, stage: QuestionStage) =>
    [...QUERY_KEYS.byChallengeId(challengeId), "stage", stage] as const,
  byPhase: (challengeId: string, stage: QuestionStage, phase: string) =>
    [...QUERY_KEYS.byStage(challengeId, stage), "phase", phase] as const,
} as const;

export type QueryKey = (typeof QUERY_KEYS)[keyof typeof QUERY_KEYS];
