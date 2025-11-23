/**
 * Hook to update a question with optimistic updates
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateQuestion } from '@/src/requests/questions';
import { QUERY_KEYS } from '@/src/definitions/constants/QUERY_KEYS';
import { UpdateQuestionDto } from '@/src/definitions/dtos/requests/questions';
import { Question } from '@/src/definitions/types/Question';
import { useChallengeQuestionsStore } from '@/src/stores/challenge-questions.store';
import { toast } from 'sonner';

interface UpdateQuestionParams {
  id: string;
  data: UpdateQuestionDto | FormData;
}

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  const store = useChallengeQuestionsStore();
  const { currentChallengeId, currentStage, currentPhase } = store;

  return useMutation({
    mutationFn: async ({ id, data }: UpdateQuestionParams) => {
      return await updateQuestion(id, data);
    },

    // ⭐ OPTIMISTIC UPDATE
    onMutate: async ({ id, data }) => {
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

      // Optimistic update in Zustand
      // Extract data from FormData if needed
      let updates: Partial<Question> = {};
      if (data instanceof FormData) {
        // For FormData, we can't easily extract all fields
        // Just mark as updating
        updates = { updatedAt: new Date().toISOString() };
      } else {
        updates = { ...data, updatedAt: new Date().toISOString() };
      }

      store.updateQuestionInCache(id, updates);

      return { previousQuestions };
    },

    // ⭐ SUCCESS: Sync with server response
    onSuccess: (updatedQuestion) => {
      // Update with complete server response
      store.updateQuestionInCache(updatedQuestion.id, updatedQuestion);

      // Invalidate to ensure fresh data
      if (currentChallengeId && currentStage && currentPhase) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.byPhase(
            currentChallengeId,
            currentStage,
            currentPhase
          ),
        });
      }

      toast.success('Question updated successfully');
    },

    // ⭐ ERROR: Rollback
    onError: (error, { id }, context) => {
      // Restore previous state
      if (context?.previousQuestions && currentChallengeId && currentStage && currentPhase) {
        const queryKey = QUERY_KEYS.byPhase(
          currentChallengeId,
          currentStage,
          currentPhase
        );
        queryClient.setQueryData(queryKey, context.previousQuestions);

        // Re-hydrate Zustand from previous data
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
        'Failed to update question';

      toast.error(`Error updating question: ${errorMessage}`);
      console.error('Update question error:', error);
    },

    // ⭐ SETTLED: Cleanup
    onSettled: (data, error) => {
      store.syncToLocalStorage();

      if (error) {
        console.error('Update question settled with error:', error);
      }
    },
  });
};
