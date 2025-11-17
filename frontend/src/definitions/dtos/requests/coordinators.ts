export interface CreateCoordinatorDto {
  fullName: string;
  email: string;
  password: string;
  role: "teacher" | "coordinator";
  school: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateCoordinatorDto extends Partial<CreateCoordinatorDto> {}

export interface GetAllCoordinatorsQueryParamsDto {
  limit?: number;
  offset?: number;
  school?: string;
  grade?: string;
  schoolType?: "bilingual" | "regular";
  sortBy?: "name" | "age" | "enrollmentDate";
  sortOrder?: "asc" | "desc";
}
