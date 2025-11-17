import { PaginatedResponse } from './common';

/**
 * Student entity response
 */
export interface StudentResponse {
  id: number;
  fullName: string;
  birthDate: string;
  grade: string;
  school: string;
  schoolType: "bilingual" | "regular";
  age?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Paginated students response
 */
export type PaginatedStudentsResponse = PaginatedResponse<StudentResponse>;
