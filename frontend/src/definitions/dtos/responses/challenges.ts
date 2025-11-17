import { PaginatedResponse } from './common';

/**
 * Challenge entity response
 */
export interface ChallengeResponse {
  id: string;
  name: string;
  grade: "5th_grade" | "6th_grade" | "1st_year" | "2nd_year" | "3rd_year" | "4th_year" | "5th_year";
  type: "regular" | "bilingual";
  totalQuestions?: number; // Computed field
  totalTime?: number; // Computed field in minutes
  isDemo: boolean;
  year?: number | null;
  exactDate?: string | null; // ISO 8601 format
  stage?: "Regional" | "State" | "National" | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Paginated challenges response
 */
export type PaginatedChallengesResponse = PaginatedResponse<ChallengeResponse>;
