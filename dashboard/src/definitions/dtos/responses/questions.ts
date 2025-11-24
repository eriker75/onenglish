/**
 * Question Response DTOs
 * These DTOs match the backend response structures
 */

import {
  Question,
  QuestionStage,
  ValidationMethod,
  QuestionType,
} from '../../types/Question';

// ==================== MAIN RESPONSE DTO ====================

export interface QuestionResponseDto {
  id: string;
  challengeId: string;
  stage: QuestionStage;
  position: number;
  type: QuestionType;
  points: number;
  timeLimit: number;
  maxAttempts: number;
  text: string;
  instructions: string;
  validationMethod: ValidationMethod;

  // Optional fields (structure varies by question type)
  content?: unknown;
  options?: unknown;

  // Hierarchical structure
  parentQuestionId?: string;
  subQuestions?: QuestionResponseDto[];

  // Media files
  media?: Array<{
    id: string;
    type: 'image' | 'audio' | 'video';
    url: string;
    filename: string;
    position: number;
    context: string;
  }>;

  // Additional configurations
  configurations?: Record<string, string>;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ==================== VALIDATION RESPONSE DTO ====================

export interface ValidationResponseDto {
  success: boolean;
  isCorrect: boolean;
  pointsEarned: number;
  feedbackEnglish?: string;
  feedbackSpanish?: string;
  details?: unknown;
  studentAnswer: {
    id: string;
    questionId: string;
    studentId: string;
    isCorrect: boolean;
    pointsEarned: number;
    attemptNumber: number;
    timeSpent: number;
  };
}

// ==================== SCHOOL STATISTICS RESPONSE DTO ====================

export interface SchoolStatsResponseDto {
  questionId: string;
  questionText: string;
  questionType: QuestionType;
  totalAttempts: number;
  correctAnswers: number;
  averageTime: number;
  successRate: number; // Percentage (0-100)
}

// ==================== BULK OPERATIONS RESPONSE DTO ====================

export interface BulkOperationResponseDto {
  successCount: number;
  failureCount: number;
  totalCount: number;
  errors?: Array<{
    questionId: string;
    error: string;
  }>;
  results: QuestionResponseDto[];
}

// ==================== LIST RESPONSE (with optional pagination) ====================

export interface QuestionsListResponse {
  questions: QuestionResponseDto[];
  total?: number;
  page?: number;
  limit?: number;
}

// ==================== ERROR RESPONSE ====================

export interface QuestionErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp?: string;
  path?: string;
}
