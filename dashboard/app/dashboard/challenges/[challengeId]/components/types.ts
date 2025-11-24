// Shared types for question components

export interface Question {
  id: string;
  question?: string;
  text?: string;
  type: string;
  questionTypeName?: string;
  options?: string[];
  correctAnswer?: string;
  answer?: string | string[];
  stage?: string;
  instructions?: string;
  content?: unknown;
  points?: number;
  timeLimit?: number;
  maxAttempts?: number;
  position?: number;

  // Media fields - Backend returns paths as strings
  image?: string;
  audio?: string;
  video?: string;
  mediaUrl?: string;

  // Additional fields
  subQuestions?: unknown[];
  [key: string]: unknown; // Allow additional backend fields
}

export interface Statement {
  id: string;
  text: string;
  correct: boolean;
}

export type QuestionFieldValue = string | string[] | Statement[] | undefined;
