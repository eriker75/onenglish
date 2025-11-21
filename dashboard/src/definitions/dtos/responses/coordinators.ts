import { PaginatedResponse } from './common';

/**
 * Coordinator entity response
 */
export interface CoordinatorResponse {
  id: number;
  fullName: string;
  email: string;
  role: "teacher" | "coordinator";
  school: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Paginated coordinators response
 */
export type PaginatedCoordinatorsResponse = PaginatedResponse<CoordinatorResponse>;
