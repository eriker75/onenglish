/**
 * Hook to update a question
 * DEPRECATED: Use useUpdateQuestion from @/src/hooks/useQuestionMutations instead
 * This file is kept for backwards compatibility but should not be used
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateQuestion } from '@/src/requests/questions';
import { UpdateQuestionDto } from '@/src/definitions/dtos/requests/questions';
import { toast } from 'sonner';

interface UpdateQuestionParams {
  id: string;
  data: UpdateQuestionDto | FormData;
}

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateQuestionParams) => {
      return await updateQuestion(id, data);
    },

    onSuccess: () => {
      toast.success('Question updated successfully');
      // Invalidate all challenge queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['challenge'] });
    },

    onError: (error) => {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error as Error)?.message ||
        'Failed to update question';

      toast.error(`Error updating question: ${errorMessage}`);
      console.error('Update question error:', error);
    },
  });
};
