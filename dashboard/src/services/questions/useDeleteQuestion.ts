/**
 * Hook to delete a question
 * DEPRECATED: Use useDeleteQuestion from @/src/hooks/useChallenge instead
 * This file is kept for backwards compatibility but should not be used
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteQuestion } from '@/src/requests/questions';
import { toast } from 'sonner';

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionId: string) => {
      return await deleteQuestion(questionId);
    },

    onSuccess: () => {
      toast.success('Question deleted successfully');
      // Invalidate all challenge queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['challenge'] });
    },

    onError: (error) => {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error as Error)?.message ||
        'Failed to delete question';

      toast.error(`Error deleting question: ${errorMessage}`);
      console.error('Delete question error:', error);
    },
  });
};
