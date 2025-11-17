export interface CreateChallengeDto {
  grade: "5th_grade" | "6th_grade" | "1st_year" | "2nd_year" | "3rd_year" | "4th_year" | "5th_year";
  type: "regular" | "bilingual";
  isDemo?: boolean;
  exactDate?: string; // ISO 8601 format (YYYY-MM-DD)
  stage?: "Regional" | "State" | "National";
  isActive?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateChallengeDto extends Partial<CreateChallengeDto> {}

export interface GetAllChallengesQueryParamsDto {
  page?: number;
  limit?: number;
  grade?: "5th_grade" | "6th_grade" | "1st_year" | "2nd_year" | "3rd_year" | "4th_year" | "5th_year";
  type?: "regular" | "bilingual";
  stage?: "Regional" | "State" | "National";
  isDemo?: boolean;
  isActive?: boolean;
  year?: number;
  exactDate?: string;
  search?: string;
  name?: string;
  sortBy?: "name" | "createdAt" | "grade" | "type" | "year";
  sortOrder?: "asc" | "desc";
}
