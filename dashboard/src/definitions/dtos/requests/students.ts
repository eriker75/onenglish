export interface CreateStudentDto {
  fullName: string;
  birthDate: string;
  grade: string;
  school: string;
  schoolType: "bilingual" | "regular";
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateStudentDto extends Partial<CreateStudentDto> {}

export interface GetAllStudentsQueryParamsDto {
  limit?: number;
  offset?: number;
  school?: string;
  grade?: string;
  schoolType?: "bilingual" | "regular";
  sortBy?: "name" | "age" | "enrollmentDate";
  sortOrder?: "asc" | "desc";
}
