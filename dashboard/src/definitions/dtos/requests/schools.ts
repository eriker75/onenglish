export interface CreateSchoolDto {
  name: string;
  type: string;
  state: string;
  city: string;
  email: string;
  phone: string;
  address?: string;
  postalCode?: string;
  website?: string;
  description?: string;
  country?: string; // default: Venezuela
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateSchoolDto extends Partial<CreateSchoolDto> {}

export interface GetAllSchoolsQueryParamsDto {
  limit?: number;
  offset?: number;
  schoolId?: number;
  code?: string;
  city?: string;
  state?: string;
  type?: string; // public, private, other
  isActive?: boolean;
  sortBy?: "name" | "schoolId" | "createdAt";
  sortOrder?: "asc" | "desc";
}
