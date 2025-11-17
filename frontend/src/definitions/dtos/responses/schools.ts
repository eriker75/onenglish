import { PaginatedResponse } from './common';

/**
 * School entity response
 */
export interface SchoolResponse {
  id: string; // UUID
  schoolId: number; // Sequential ID
  code: string; // School code (SCH0001, SCH0002, etc.)
  name: string;
  type: string; // School type (public, private, etc.)
  email: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  address?: string;
  postalCode?: string;
  website?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Paginated schools response
 */
export type PaginatedSchoolsResponse = PaginatedResponse<SchoolResponse>;
