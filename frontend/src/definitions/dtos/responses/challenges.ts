import { PaginatedResponse } from './common';

/**
 * Challenge entity response
 */
export interface ChallengeResponse {
  id: number;
  title: string;
  description: string;
  type: "quiz" | "essay" | "multiple_choice" | "true_false" | "fill_blank";
  difficulty: "easy" | "medium" | "hard";
  points: number;
  timeLimit?: number;
  status: "draft" | "published" | "archived";
  categoryId?: string;
  tags?: string[];
  questions?: any[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Paginated challenges response
 */
export type PaginatedChallengesResponse = PaginatedResponse<ChallengeResponse>;
