/**
 * Hook to create a question
 * DEPRECATED: Use useCreateQuestion from @/src/hooks/useQuestionMutations instead
 * This file is kept for backwards compatibility but should not be used
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createQuestion } from '@/src/requests/questions';
import { QuestionType } from '@/src/definitions/types/Question';
import { toast } from 'sonner';

export const useCreateQuestion = (type: QuestionType) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData | Record<string, unknown>) => {
      return await createQuestion(type, data);
    },

    onSuccess: () => {
      toast.success('Question created successfully');
      // Invalidate all challenge queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['challenge'] });
    },

    onError: (error) => {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error as Error)?.message ||
        'Failed to create question';

      toast.error(`Error creating question: ${errorMessage}`);
      console.error('Create question error:', error);
    },
  });
};
