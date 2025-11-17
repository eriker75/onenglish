/**
 * Hook to fetch questions filtered by phase
 * Implements intelligent caching with Zustand + React Query
 */

import { useQuery } from '@tanstack/react-query';
import { getQuestions } from '@/src/repositories/questions';
import { QUERY_KEYS } from '@/src/definitions/constants/QUERY_KEYS';
import { QuestionStage } from '@/src/definitions/types/Question';
import { useChallengeQuestionsStore } from '@/src/stores/challenge-questions.store';

export const useQuestionsByPhase = (
  challengeId: string,
  stage: QuestionStage | null,
  phase: string | null
) => {
  const store = useChallengeQuestionsStore();

  return useQuery({
    queryKey: QUERY_KEYS.byPhase(challengeId, stage!, phase!),

    queryFn: async () => {
      const data = await getQuestions({
        challengeId,
        stage: stage!,
        phase: phase!,
      });
      return data;
    },

    enabled: !!challengeId && !!stage && !!phase,

    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)

    // ⭐ Initialize with Zustand cache if valid
    initialData: () => {
      if (!stage || !phase) return undefined;

      const cached = store.getQuestions(challengeId, stage, phase);

      // Only use if cache is valid (< 5 min old)
      if (cached.length > 0 && store.isCacheValid(challengeId, stage, phase)) {
        return cached;
      }

      return undefined;
    },

    // ⭐ Apply client-side filters
    select: (data) => {
      if (!stage || !phase) return [];

      const { searchFilter, typeFilter, sortBy } = store;

      let filtered = [...data];

      if (searchFilter) {
        filtered = filtered.filter((q) =>
          q.text.toLowerCase().includes(searchFilter.toLowerCase())
        );
      }

      if (typeFilter) {
        filtered = filtered.filter((q) => q.type === typeFilter);
      }

      // Sort
      const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'position') return a.position - b.position;
        if (sortBy === 'createdAt') {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        if (sortBy === 'points') return b.points - a.points;
        return 0;
      });

      return sorted;
    },

    // ⭐ Hydrate Zustand on success
    onSuccess: (data) => {
      if (stage && phase) {
        store.hydrateFromServer(challengeId, stage, phase, data);
      }
    },

    // ⭐ Cleanup and logging
    onSettled: (data, error) => {
      if (error) {
        console.error('Failed to fetch questions:', error);
      }

      // Sync to localStorage
      store.syncToLocalStorage();
    },
  });
};
