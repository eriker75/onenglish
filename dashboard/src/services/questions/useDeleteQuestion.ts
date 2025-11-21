/**
 * Hook to delete a question with optimistic updates
 * Note: Deletion requires user confirmation (modal handled in component)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteQuestion } from '@/src/repositories/questions';
import { QUERY_KEYS } from '@/src/definitions/constants/QUERY_KEYS';
import { useChallengeQuestionsStore } from '@/src/stores/challenge-questions.store';
import { toast } from 'sonner';

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  const store = useChallengeQuestionsStore();
  const { currentChallengeId, currentStage, currentPhase } = store;

  return useMutation({
    mutationFn: async (questionId: string) => {
      return await deleteQuestion(questionId);
    },

    // ⭐ OPTIMISTIC DELETE
    onMutate: async (questionId) => {
      // Cancel outgoing queries
      if (currentChallengeId && currentStage && currentPhase) {
        const queryKey = QUERY_KEYS.byPhase(
          currentChallengeId,
          currentStage,
          currentPhase
        );
        await queryClient.cancelQueries({ queryKey });
      }

      // Snapshot previous value
      const previousQuestions = currentChallengeId && currentStage && currentPhase
        ? queryClient.getQueryData(
            QUERY_KEYS.byPhase(currentChallengeId, currentStage, currentPhase)
          )
        : undefined;

      // Optimistically remove from Zustand cache
      store.removeQuestionFromCache(questionId);

      // Also optimistically update React Query cache
      if (currentChallengeId && currentStage && currentPhase) {
        const queryKey = QUERY_KEYS.byPhase(
          currentChallengeId,
          currentStage,
          currentPhase
        );

        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old) return old;
          return old.filter((q: any) => q.id !== questionId);
        });
      }

      return { previousQuestions, questionId };
    },

    // ⭐ SUCCESS
    onSuccess: () => {
      // Invalidate to ensure consistency
      if (currentChallengeId && currentStage && currentPhase) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.byPhase(
            currentChallengeId,
            currentStage,
            currentPhase
          ),
        });
      }

      toast.success('Question deleted successfully');
    },

    // ⭐ ERROR: Rollback
    onError: (error, questionId, context) => {
      // Restore previous state
      if (context?.previousQuestions && currentChallengeId && currentStage && currentPhase) {
        const queryKey = QUERY_KEYS.byPhase(
          currentChallengeId,
          currentStage,
          currentPhase
        );

        // Restore React Query cache
        queryClient.setQueryData(queryKey, context.previousQuestions);

        // Restore Zustand cache
        store.hydrateFromServer(
          currentChallengeId,
          currentStage,
          currentPhase,
          context.previousQuestions as any
        );
      }

      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error as Error)?.message ||
        'Failed to delete question';

      toast.error(`Error deleting question: ${errorMessage}`);
      console.error('Delete question error:', error);
    },

    // ⭐ SETTLED: Cleanup
    onSettled: (data, error) => {
      store.syncToLocalStorage();

      if (error) {
        console.error('Delete question settled with error:', error);
      }
    },
  });
};
