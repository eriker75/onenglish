import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/config/axiosInstance";
import { AxiosError } from "axios";

// Types
export interface Question {
  id: string;
  question?: string;
  text?: string;
  type: string;
  questionTypeName?: string;
  options?: string[];
  correctAnswer?: string;
  answer?: string | string[];
  stage?: string;
  instructions?: string;
  content?: any;
  points?: number;
  timeLimit?: number;
  maxAttempts?: number;
  mediaUrl?: string;
  subQuestions?: any[];
  // Add other fields as needed per question type
}

export interface Challenge {
  id: string;
  title: string;
  grade: string;
  type: "regular" | "bilingual";
  isDemo?: boolean;
  questions: Question[];
}

export interface QuestionsByStage {
  [stage: string]: {
    [type: string]: Question[];
  };
}

// Query Keys
export const challengeKeys = {
  all: ["challenges"] as const,
  detail: (id: string) => ["challenge", id] as const,
  questions: (id: string) => ["challenge", id, "questions"] as const,
};

export const questionKeys = {
  all: ["questions"] as const,
  detail: (id: string) => ["question", id] as const,
};

/**
 * Hook to fetch challenge data with all questions
 */
export function useChallenge(challengeId: string | undefined) {
  return useQuery({
    queryKey: challengeKeys.detail(challengeId || ""),
    queryFn: async () => {
      if (!challengeId) throw new Error("Challenge ID is required");
      const response = await api.get<Challenge>(`/challenges/${challengeId}`);
      return response.data;
    },
    enabled: !!challengeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a specific question by ID
 */
export function useQuestion(questionId: string | undefined) {
  return useQuery({
    queryKey: questionKeys.detail(questionId || ""),
    queryFn: async () => {
      if (!questionId) throw new Error("Question ID is required");
      const response = await api.get<Question>(`/questions/${questionId}`);
      return response.data;
    },
    enabled: !!questionId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to delete a question
 */
export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      questionId,
      questionType,
    }: {
      questionId: string;
      questionType: string;
    }) => {
      const response = await api.delete(`/questions/${questionType}/${questionId}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the challenge query to refetch all questions
      queryClient.invalidateQueries({ queryKey: challengeKeys.all });
      // Remove the specific question from cache
      queryClient.removeQueries({ queryKey: questionKeys.detail(variables.questionId) });
    },
  });
}

/**
 * Utility function to group questions by stage and type
 */
export function groupQuestionsByStage(questions: Question[]): QuestionsByStage {
  const grouped: QuestionsByStage = {
    Vocabulary: {},
    Grammar: {},
    Listening: {},
    Writing: {},
    Speaking: {},
  };

  questions.forEach((q) => {
    // Helper to format stage name
    const formatStage = (stage: string) => {
      if (!stage) return "Vocabulary"; // Default fallback
      return stage.charAt(0).toUpperCase() + stage.slice(1).toLowerCase();
    };

    const stage = formatStage(q.stage || "Vocabulary");
    const type = q.type;

    if (grouped[stage]) {
      if (!grouped[stage][type]) {
        grouped[stage][type] = [];
      }
      grouped[stage][type].push(q);
    }
  });

  return grouped;
}
