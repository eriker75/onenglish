import { PaginatedResponse } from './common';

/**
 * Admin entity response
 */
export interface AdminResponse {
  id: number;
  fullName: string;
  email: string;
  role: "admin" | "super_admin";
  phone?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Paginated admins response
 */
export type PaginatedAdminsResponse = PaginatedResponse<AdminResponse>;
