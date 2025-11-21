export interface CreateTeacherDto {
  fullName: string;
  email: string;
  password: string;
  role: "teacher" | "admin" | "student";
  school: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateTeacherDto extends Partial<CreateTeacherDto> {}

export interface GetAllTeachersQueryParamsDto {
  limit?: number;
  offset?: number;
  school?: string;
  grade?: string;
  schoolType?: "bilingual" | "regular";
  sortBy?: "name" | "age" | "enrollmentDate";
  sortOrder?: "asc" | "desc";
}
