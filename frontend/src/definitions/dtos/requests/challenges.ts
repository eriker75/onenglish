export interface CreateChallengeDto {
  title: string;
  description: string;
  type: "quiz" | "essay" | "multiple_choice" | "true_false" | "fill_blank";
  difficulty: "easy" | "medium" | "hard";
  points: number;
  timeLimit?: number; // in minutes
  status: "draft" | "published" | "archived";
  categoryId?: string;
  tags?: string[];
  questions?: unknown[]; // Array of question objects, structure can be defined as needed
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateChallengeDto extends Partial<CreateChallengeDto> {}

export interface GetAllChallengesQueryParamsDto {
  limit?: number;
  offset?: number;
  type?: "quiz" | "essay" | "multiple_choice" | "true_false" | "fill_blank";
  difficulty?: "easy" | "medium" | "hard";
  status?: "draft" | "published" | "archived";
  categoryId?: string;
  sortBy?: "title" | "createdAt" | "points" | "difficulty";
  sortOrder?: "asc" | "desc";
  search?: string;
}
