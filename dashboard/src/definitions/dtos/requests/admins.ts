export interface CreateAdminDto {
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "super_admin";
  phone?: string;
  isActive?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateAdminDto extends Partial<CreateAdminDto> {}

export interface GetAllAdminsQueryParamsDto {
  limit?: number;
  offset?: number;
  role?: "admin" | "super_admin";
  isActive?: boolean;
  sortBy?: "name" | "email" | "createdAt";
  sortOrder?: "asc" | "desc";
}
