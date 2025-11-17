/**
 * Hook to create a question with optimistic updates
 * Supports all 19 question types
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createQuestion } from '@/src/repositories/questions';
import { QUERY_KEYS } from '@/src/definitions/constants/QUERY_KEYS';
import { QuestionType, Question } from '@/src/definitions/types/Question';
import { useChallengeQuestionsStore } from '@/src/stores/challenge-questions.store';
import { toast } from 'sonner';

export const useCreateQuestion = (type: QuestionType) => {
  const queryClient = useQueryClient();
  const store = useChallengeQuestionsStore();
  const { currentStage, currentPhase, currentChallengeId } = store;

  return useMutation({
    mutationFn: async (data: FormData | Record<string, unknown>) => {
      return await createQuestion(type, data);
    },

    // ⭐ OPTIMISTIC UPDATE
    onMutate: async (newQuestionData) => {
      // Cancel outgoing queries to prevent overwriting optimistic update
      if (currentChallengeId && currentStage && currentPhase) {
        const queryKey = QUERY_KEYS.byPhase(
          currentChallengeId,
          currentStage,
          currentPhase
        );
        await queryClient.cancelQueries({ queryKey });
      }

      // Snapshot previous value for rollback
      const previousQuestions = currentChallengeId && currentStage && currentPhase
        ? queryClient.getQueryData(
            QUERY_KEYS.byPhase(currentChallengeId, currentStage, currentPhase)
          )
        : undefined;

      // Create optimistic question with temp ID
      const tempQuestion: Question = {
        id: `temp-${Date.now()}`,
        challengeId: currentChallengeId || '',
        stage: currentStage!,
        phase: currentPhase!,
        position: 0, // Backend will assign actual position
        type,
        points: 0, // Will be set from data
        timeLimit: 60,
        maxAttempts: 1,
        text: 'Creating question...',
        instructions: '',
        validationMethod: 'AUTO' as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to Zustand cache immediately
      store.addQuestionToCache(tempQuestion);

      // Return context for error rollback
      return { previousQuestions, tempQuestion };
    },

    // ⭐ SUCCESS: Replace temp ID with real ID
    onSuccess: (serverQuestion, variables, context) => {
      // Remove temp question from cache
      if (context?.tempQuestion) {
        store.removeQuestionFromCache(context.tempQuestion.id);
      }

      // Add real question from server
      store.addQuestionToCache(serverQuestion);

      // Invalidate to re-fetch fresh data
      if (currentChallengeId && currentStage && currentPhase) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.byPhase(
            currentChallengeId,
            currentStage,
            currentPhase
          ),
        });
      }

      toast.success('Question created successfully');
    },

    // ⭐ ERROR: Rollback optimistic update
    onError: (error, variables, context) => {
      // Remove temp question
      if (context?.tempQuestion) {
        store.removeQuestionFromCache(context.tempQuestion.id);
      }

      // Restore previous state in React Query cache
      if (context?.previousQuestions && currentChallengeId && currentStage && currentPhase) {
        const queryKey = QUERY_KEYS.byPhase(
          currentChallengeId,
          currentStage,
          currentPhase
        );
        queryClient.setQueryData(queryKey, context.previousQuestions);
      }

      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error as Error)?.message ||
        'Failed to create question';

      toast.error(`Error creating question: ${errorMessage}`);
      console.error('Create question error:', error);
    },

    // ⭐ SETTLED: Always run cleanup
    onSettled: (data, error, variables, context) => {
      // Sync to localStorage
      store.syncToLocalStorage();

      // Log for debugging
      if (error) {
        console.error('Create question settled with error:', error);
      }
    },
  });
};
