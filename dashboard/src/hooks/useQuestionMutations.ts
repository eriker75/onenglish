import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/src/config/axiosInstance";
import { challengeKeys, questionKeys } from "./useChallenge";

interface CreateQuestionParams {
  endpoint: string;
  data: any;
  challengeId: string;
}

interface UpdateQuestionParams {
  endpoint: string;
  questionId: string;
  data: any;
  challengeId: string;
}

/**
 * Generic hook for creating questions of any type
 */
export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ endpoint, data }: CreateQuestionParams) => {
      const response = await api.post(endpoint, data, {
        headers: data instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : undefined,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate challenge queries to refetch updated question list
      queryClient.invalidateQueries({
        queryKey: challengeKeys.detail(variables.challengeId),
      });
    },
  });
}

/**
 * Generic hook for updating questions of any type
 */
export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ endpoint, questionId, data }: UpdateQuestionParams) => {
      const response = await api.patch(`${endpoint}/${questionId}`, data, {
        headers: data instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : undefined,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate both the specific question and the challenge list
      queryClient.invalidateQueries({
        queryKey: questionKeys.detail(variables.questionId),
      });
      queryClient.invalidateQueries({
        queryKey: challengeKeys.detail(variables.challengeId),
      });
    },
  });
}
