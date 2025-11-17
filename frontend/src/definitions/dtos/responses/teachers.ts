import { PaginatedResponse } from './common';

/**
 * Teacher entity response
 */
export interface TeacherResponse {
  id: number;
  fullName: string;
  email: string;
  role: "teacher" | "admin" | "student";
  school: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Paginated teachers response
 */
export type PaginatedTeachersResponse = PaginatedResponse<TeacherResponse>;
