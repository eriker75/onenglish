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
      console.log("🔵 [CREATE] Starting mutation:", { endpoint });
      console.log("🔵 [CREATE] Data type:", data instanceof FormData ? "FormData" : typeof data);

      if (data instanceof FormData) {
        console.log("🔵 [CREATE] FormData entries:");
        for (const [key, value] of data.entries()) {
          console.log(`  - ${key}:`, value instanceof File ? `File(${value.name})` : value);
        }
      } else {
        console.log("🔵 [CREATE] Data:", data);
      }

      try {
        const response = await api.post(endpoint, data, {
          headers: data instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : undefined,
        });
        console.log("✅ [CREATE] Success:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("❌ [CREATE] Error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      console.log("🎉 [CREATE] onSuccess callback triggered");
      console.log("🔄 [CREATE] Invalidating challenge queries for:", variables.challengeId);
      // Invalidate challenge queries to refetch updated question list
      queryClient.invalidateQueries({
        queryKey: challengeKeys.detail(variables.challengeId),
      });
    },
    onError: (error: any) => {
      console.error("💥 [CREATE] onError callback triggered:", error);
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
      console.log("🟡 [UPDATE] Starting mutation:", { endpoint, questionId });
      console.log("🟡 [UPDATE] Data type:", data instanceof FormData ? "FormData" : typeof data);

      if (data instanceof FormData) {
        console.log("🟡 [UPDATE] FormData entries:");
        for (const [key, value] of data.entries()) {
          console.log(`  - ${key}:`, value instanceof File ? `File(${value.name})` : value);
        }
      } else {
        console.log("🟡 [UPDATE] Data:", data);
      }

      try {
        const response = await api.patch(`${endpoint}/${questionId}`, data, {
          headers: data instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : undefined,
        });
        console.log("✅ [UPDATE] Success:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("❌ [UPDATE] Error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      console.log("🎉 [UPDATE] onSuccess callback triggered");
      console.log("🔄 [UPDATE] Invalidating queries for:", {
        questionId: variables.questionId,
        challengeId: variables.challengeId,
      });
      // Invalidate both the specific question and the challenge list
      queryClient.invalidateQueries({
        queryKey: questionKeys.detail(variables.questionId),
      });
      queryClient.invalidateQueries({
        queryKey: challengeKeys.detail(variables.challengeId),
      });
    },
    onError: (error: any) => {
      console.error("💥 [UPDATE] onError callback triggered:", error);
    },
  });
}
