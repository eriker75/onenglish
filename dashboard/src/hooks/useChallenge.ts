import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/config/axiosInstance";

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
  content?: unknown;
  points?: number;
  timeLimit?: number;
  maxAttempts?: number;
  position?: number;
  validationMethod?: string;
  createdAt?: string;
  updatedAt?: string;

  // Media fields - Backend now returns strings directly (paths)
  image?: string;      // e.g., "/uploads/image/xxx.png"
  audio?: string;      // e.g., "/uploads/audio/xxx.mp3"
  video?: string;      // e.g., "/uploads/video/xxx.mp4"
  mediaUrl?: string;   // Legacy field for compatibility

  // Type-specific fields
  subQuestions?: Partial<Question>[];
  scrambledWords?: string[];
  correctSentence?: string[];

  // Allow additional backend fields
  [key: string]: unknown;
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
  questionsByStage: (id: string, stage: string) => ["challenge", id, "questions", "stage", stage] as const,
  questionsByType: (id: string, stage: string, type: string) => ["challenge", id, "questions", "stage", stage, "type", type] as const,
};

export const questionKeys = {
  all: ["questions"] as const,
  detail: (id: string) => ["question", id] as const,
};

/**
 * Hook to fetch challenge data with all questions
 * This hook also prefetches and caches all individual questions
 */
export function useChallenge(challengeId: string | undefined) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: challengeKeys.detail(challengeId || ""),
    queryFn: async () => {
      if (!challengeId) throw new Error("Challenge ID is required");

      // Fetch challenge basic data
      const challengeResponse = await api.get<Challenge>(`/challenges/${challengeId}`);
      const challengeData = challengeResponse.data;

      // Fetch all questions grouped by stage and type from backend
      const questionsResponse = await api.get<QuestionsByStage>(
        `/questions/challenge/${challengeId}`
      );
      const groupedQuestions = questionsResponse.data;

      // Flatten and cache individual questions
      const allQuestions: Question[] = [];

      Object.entries(groupedQuestions).forEach(([stage, types]) => {
        Object.entries(types).forEach(([type, questions]) => {
          questions.forEach((question: Question) => {
            // Add to flat array
            allQuestions.push(question);

            // Cache individual question
            queryClient.setQueryData(
              questionKeys.detail(question.id),
              question
            );
          });

          // Cache questions by type
          queryClient.setQueryData(
            challengeKeys.questionsByType(challengeId, stage, type),
            questions
          );
        });

        // Cache questions by stage (flatten types)
        const stageQuestions = Object.values(types).flat();
        queryClient.setQueryData(
          challengeKeys.questionsByStage(challengeId, stage),
          stageQuestions
        );
      });

      // Cache all questions in a flat structure
      queryClient.setQueryData(
        challengeKeys.questions(challengeId),
        allQuestions
      );

      // Return challenge with all questions
      return {
        ...challengeData,
        questions: allQuestions,
      };
    },
    enabled: !!challengeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a specific question by ID
 * Will use cached data if available from useChallenge prefetch
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
 * Hook to get questions by stage (from cache or fetch)
 * @param challengeId - Challenge ID
 * @param stage - Stage name (VOCABULARY, GRAMMAR, LISTENING, WRITING, SPEAKING)
 */
export function useQuestionsByStage(
  challengeId: string | undefined,
  stage: string | undefined
) {
  return useQuery({
    queryKey: challengeKeys.questionsByStage(challengeId || "", stage || ""),
    queryFn: async () => {
      if (!challengeId || !stage) throw new Error("Challenge ID and stage are required");
      const response = await api.get<{ [type: string]: Question[] }>(
        `/questions/challenge/${challengeId}?stage=${stage}`
      );

      // Flatten the response to return just the questions array
      return Object.values(response.data).flat();
    },
    enabled: !!challengeId && !!stage,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get questions by type (from cache or fetch)
 * @param challengeId - Challenge ID
 * @param stage - Stage name
 * @param type - Question type (e.g., 'unscramble', 'debate', etc.)
 */
export function useQuestionsByType(
  challengeId: string | undefined,
  stage: string | undefined,
  type: string | undefined
) {
  return useQuery({
    queryKey: challengeKeys.questionsByType(challengeId || "", stage || "", type || ""),
    queryFn: async () => {
      if (!challengeId || !stage || !type) {
        throw new Error("Challenge ID, stage, and type are required");
      }
      const response = await api.get<Question[]>(
        `/questions/challenge/${challengeId}?stage=${stage}&type=${type}`
      );
      return response.data;
    },
    enabled: !!challengeId && !!stage && !!type,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get all questions for a challenge in a flat array
 * Uses cached data from useChallenge if available
 */
export function useChallengeQuestions(challengeId: string | undefined) {
  return useQuery({
    queryKey: challengeKeys.questions(challengeId || ""),
    queryFn: async () => {
      if (!challengeId) throw new Error("Challenge ID is required");
      const response = await api.get<QuestionsByStage>(
        `/questions/challenge/${challengeId}`
      );

      // Flatten grouped questions into a single array
      const allQuestions: Question[] = [];
      Object.values(response.data).forEach((types) => {
        Object.values(types).forEach((questions) => {
          allQuestions.push(...questions);
        });
      });

      return allQuestions;
    },
    enabled: !!challengeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
      challengeId,
    }: {
      questionId: string;
      challengeId?: string;
      questionType?: string; // Optional, kept for backwards compatibility but not used
    }) => {
      const response = await api.delete(`/questions/${questionId}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Remove the specific question from cache
      queryClient.removeQueries({ queryKey: questionKeys.detail(variables.questionId) });
      
      // If challengeId is provided, update that specific challenge's cache
      if (variables.challengeId) {
        queryClient.setQueryData<Challenge>(
          challengeKeys.detail(variables.challengeId),
          (oldData) => {
            if (!oldData) return oldData;
            
            // Remove the question from the challenge's questions array
            const updatedQuestions = oldData.questions?.filter(
              (q) => q.id !== variables.questionId
            ) || [];
            
            return {
              ...oldData,
              questions: updatedQuestions,
            };
          }
        );
        
        // Also invalidate related queries for this challenge
        queryClient.invalidateQueries({ 
          queryKey: challengeKeys.detail(variables.challengeId) 
        });
      } else {
        // If no challengeId, update all challenge caches
        queryClient.setQueriesData<Challenge>(
          { queryKey: challengeKeys.all },
          (oldData) => {
            if (!oldData) return oldData;
            
            // Remove the question from the challenge's questions array
            const updatedQuestions = oldData.questions?.filter(
              (q) => q.id !== variables.questionId
            ) || [];
            
            return {
              ...oldData,
              questions: updatedQuestions,
            };
          }
        );
        
        // Invalidate all challenge queries to ensure consistency
        queryClient.invalidateQueries({ queryKey: challengeKeys.all });
      }
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
