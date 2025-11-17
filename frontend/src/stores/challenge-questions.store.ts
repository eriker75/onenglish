/**
 * Unified Challenge Questions Store
 * Combines data caching, UI state, and form management
 *
 * Architecture:
 * - React Query = Source of truth (server data)
 * - Zustand = Client cache + UI state + Filters
 * - localStorage = Persistence between sessions
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  Question,
  QuestionType,
  QuestionStage,
} from '@/definitions/types/Question';

// ==================== TYPES ====================

interface ChallengeQuestionsState {
  // ============ DATA CACHE ============
  // Key format: "challengeId:stage:phase"
  questionsCache: Map<string, Question[]>;
  lastSync: Map<string, number>; // Timestamp of last sync

  // ============ UI STATE ============
  currentChallengeId: string | null;
  currentStage: QuestionStage | null;
  currentPhase: string | null;

  // Filters (client-side)
  searchFilter: string;
  typeFilter: QuestionType | null;
  sortBy: 'position' | 'createdAt' | 'points';

  // Form state
  isCreatingQuestion: boolean;
  editingQuestionId: string | null;
  activeQuestionFormType: QuestionType | null;

  // Draft of question being created/edited
  questionDraft: Partial<Question> | null;
  draftErrors: Record<string, string>;

  // Media uploads in progress
  uploadingMedia: Map<string, { progress: number; file: File }>;

  // ============ GETTERS ============
  getQuestions: (
    challengeId: string,
    stage: QuestionStage,
    phase: string
  ) => Question[];
  getFilteredQuestions: (
    challengeId: string,
    stage: QuestionStage,
    phase: string
  ) => Question[];
  isCacheValid: (
    challengeId: string,
    stage: QuestionStage,
    phase: string,
    maxAge?: number
  ) => boolean;

  // ============ CACHE ACTIONS ============
  hydrateFromServer: (
    challengeId: string,
    stage: QuestionStage,
    phase: string,
    questions: Question[]
  ) => void;
  addQuestionToCache: (question: Question) => void;
  updateQuestionInCache: (questionId: string, updates: Partial<Question>) => void;
  removeQuestionFromCache: (questionId: string) => void;
  invalidateCache: (
    challengeId: string,
    stage?: QuestionStage,
    phase?: string
  ) => void;

  // ============ UI ACTIONS ============
  setCurrentChallengeId: (id: string | null) => void;
  setCurrentStage: (stage: QuestionStage | null) => void;
  setCurrentPhase: (phase: string | null) => void;
  setSearchFilter: (search: string) => void;
  setTypeFilter: (type: QuestionType | null) => void;
  setSortBy: (sort: 'position' | 'createdAt' | 'points') => void;

  // ============ FORM ACTIONS ============
  setIsCreatingQuestion: (creating: boolean) => void;
  setEditingQuestionId: (id: string | null) => void;
  setActiveQuestionFormType: (type: QuestionType | null) => void;
  setQuestionDraft: (draft: Partial<Question> | null) => void;
  updateDraftField: (field: keyof Question, value: unknown) => void;
  setDraftError: (field: string, error: string) => void;
  clearDraftErrors: () => void;
  clearDraft: () => void;

  // ============ MEDIA ACTIONS ============
  addUploadingMedia: (key: string, file: File) => void;
  updateMediaProgress: (key: string, progress: number) => void;
  removeUploadingMedia: (key: string) => void;

  // ============ PERSISTENCE ============
  syncToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  reset: () => void;
}

// ==================== HELPERS ====================

const getCacheKey = (
  challengeId: string,
  stage: QuestionStage,
  phase: string
) => `${challengeId}:${stage}:${phase}`;

// ==================== STORE ====================

export const useChallengeQuestionsStore = create<ChallengeQuestionsState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // ============ INITIAL STATE ============
        questionsCache: new Map(),
        lastSync: new Map(),
        currentChallengeId: null,
        currentStage: null,
        currentPhase: null,
        searchFilter: '',
        typeFilter: null,
        sortBy: 'position',
        isCreatingQuestion: false,
        editingQuestionId: null,
        activeQuestionFormType: null,
        questionDraft: null,
        draftErrors: {},
        uploadingMedia: new Map(),

        // ============ GETTERS ============

        getQuestions: (challengeId, stage, phase) => {
          const key = getCacheKey(challengeId, stage, phase);
          return get().questionsCache.get(key) || [];
        },

        getFilteredQuestions: (challengeId, stage, phase) => {
          const questions = get().getQuestions(challengeId, stage, phase);
          const { searchFilter, typeFilter, sortBy } = get();

          let filtered = [...questions];

          // Search filter
          if (searchFilter) {
            filtered = filtered.filter((q) =>
              q.text.toLowerCase().includes(searchFilter.toLowerCase())
            );
          }

          // Type filter
          if (typeFilter) {
            filtered = filtered.filter((q) => q.type === typeFilter);
          }

          // Sort
          filtered.sort((a, b) => {
            if (sortBy === 'position') return a.position - b.position;
            if (sortBy === 'createdAt') {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            }
            if (sortBy === 'points') return b.points - a.points;
            return 0;
          });

          return filtered;
        },

        isCacheValid: (challengeId, stage, phase, maxAge = 5 * 60 * 1000) => {
          const key = getCacheKey(challengeId, stage, phase);
          const lastSync = get().lastSync.get(key);

          if (!lastSync) return false;

          const age = Date.now() - lastSync;
          return age < maxAge;
        },

        // ============ CACHE ACTIONS ============

        hydrateFromServer: (challengeId, stage, phase, questions) =>
          set((state) => {
            const key = getCacheKey(challengeId, stage, phase);
            state.questionsCache.set(key, questions);
            state.lastSync.set(key, Date.now());
          }),

        addQuestionToCache: (question) =>
          set((state) => {
            const key = getCacheKey(
              question.challengeId,
              question.stage,
              question.phase
            );
            const existing = state.questionsCache.get(key) || [];
            state.questionsCache.set(key, [...existing, question]);
          }),

        updateQuestionInCache: (questionId, updates) =>
          set((state) => {
            for (const [key, questions] of state.questionsCache.entries()) {
              const index = questions.findIndex((q) => q.id === questionId);
              if (index !== -1) {
                questions[index] = { ...questions[index], ...updates };
                state.questionsCache.set(key, [...questions]);
                break;
              }
            }
          }),

        removeQuestionFromCache: (questionId) =>
          set((state) => {
            for (const [key, questions] of state.questionsCache.entries()) {
              const filtered = questions.filter((q) => q.id !== questionId);
              if (filtered.length !== questions.length) {
                state.questionsCache.set(key, filtered);
                break;
              }
            }
          }),

        invalidateCache: (challengeId, stage, phase) =>
          set((state) => {
            if (!stage && !phase) {
              // Invalidate entire challenge
              const keysToRemove: string[] = [];
              for (const key of state.questionsCache.keys()) {
                if (key.startsWith(challengeId)) {
                  keysToRemove.push(key);
                }
              }
              keysToRemove.forEach((key) => {
                state.questionsCache.delete(key);
                state.lastSync.delete(key);
              });
            } else if (stage && !phase) {
              // Invalidate entire stage
              const keyPrefix = `${challengeId}:${stage}:`;
              const keysToRemove: string[] = [];
              for (const key of state.questionsCache.keys()) {
                if (key.startsWith(keyPrefix)) {
                  keysToRemove.push(key);
                }
              }
              keysToRemove.forEach((key) => {
                state.questionsCache.delete(key);
                state.lastSync.delete(key);
              });
            } else if (stage && phase) {
              // Invalidate specific phase
              const key = getCacheKey(challengeId, stage, phase);
              state.questionsCache.delete(key);
              state.lastSync.delete(key);
            }
          }),

        // ============ UI ACTIONS ============

        setCurrentChallengeId: (id) => set({ currentChallengeId: id }),
        setCurrentStage: (stage) => set({ currentStage: stage }),
        setCurrentPhase: (phase) => set({ currentPhase: phase }),
        setSearchFilter: (search) => set({ searchFilter: search }),
        setTypeFilter: (type) => set({ typeFilter: type }),
        setSortBy: (sort) => set({ sortBy: sort }),

        // ============ FORM ACTIONS ============

        setIsCreatingQuestion: (creating) =>
          set({ isCreatingQuestion: creating }),
        setEditingQuestionId: (id) => set({ editingQuestionId: id }),
        setActiveQuestionFormType: (type) =>
          set({ activeQuestionFormType: type }),
        setQuestionDraft: (draft) =>
          set({ questionDraft: draft, draftErrors: {} }),
        updateDraftField: (field, value) =>
          set((state) => {
            if (state.questionDraft) {
              (state.questionDraft as any)[field] = value;
            }
          }),
        setDraftError: (field, error) =>
          set((state) => {
            state.draftErrors[field] = error;
          }),
        clearDraftErrors: () => set({ draftErrors: {} }),
        clearDraft: () =>
          set({
            questionDraft: null,
            draftErrors: {},
            isCreatingQuestion: false,
            editingQuestionId: null,
            activeQuestionFormType: null,
          }),

        // ============ MEDIA ACTIONS ============

        addUploadingMedia: (key, file) =>
          set((state) => {
            state.uploadingMedia.set(key, { progress: 0, file });
          }),
        updateMediaProgress: (key, progress) =>
          set((state) => {
            const existing = state.uploadingMedia.get(key);
            if (existing) {
              state.uploadingMedia.set(key, { ...existing, progress });
            }
          }),
        removeUploadingMedia: (key) =>
          set((state) => {
            state.uploadingMedia.delete(key);
          }),

        // ============ PERSISTENCE ============

        syncToLocalStorage: () => {
          const state = get();
          try {
            localStorage.setItem(
              'challenge-questions-cache',
              JSON.stringify({
                questionsCache: Array.from(state.questionsCache.entries()),
                lastSync: Array.from(state.lastSync.entries()),
              })
            );
          } catch (error) {
            console.error('Failed to sync to localStorage:', error);
          }
        },

        loadFromLocalStorage: () => {
          try {
            const cached = localStorage.getItem('challenge-questions-cache');
            if (cached) {
              const parsed = JSON.parse(cached);
              set({
                questionsCache: new Map(parsed.questionsCache || []),
                lastSync: new Map(parsed.lastSync || []),
              });
            }
          } catch (error) {
            console.error('Failed to load from localStorage:', error);
          }
        },

        reset: () =>
          set({
            questionsCache: new Map(),
            lastSync: new Map(),
            currentChallengeId: null,
            currentStage: null,
            currentPhase: null,
            searchFilter: '',
            typeFilter: null,
            sortBy: 'position',
            isCreatingQuestion: false,
            editingQuestionId: null,
            activeQuestionFormType: null,
            questionDraft: null,
            draftErrors: {},
            uploadingMedia: new Map(),
          }),
      })),
      {
        name: 'challenge-questions-storage',
        partialize: (state) => ({
          questionsCache: Array.from(state.questionsCache.entries()),
          lastSync: Array.from(state.lastSync.entries()),
          currentChallengeId: state.currentChallengeId,
          currentStage: state.currentStage,
          currentPhase: state.currentPhase,
        }),
      }
    ),
    { name: 'ChallengeQuestionsStore' }
  )
);

// ==================== SELECTORS ====================

// Convenience selectors for common operations
export const useCurrentPhaseQuestions = () => {
  const store = useChallengeQuestionsStore();
  const { currentChallengeId, currentStage, currentPhase } = store;

  if (!currentChallengeId || !currentStage || !currentPhase) {
    return [];
  }

  return store.getFilteredQuestions(
    currentChallengeId,
    currentStage,
    currentPhase
  );
};

export const useQuestionFormState = () => {
  return useChallengeQuestionsStore((state) => ({
    isCreating: state.isCreatingQuestion,
    editingId: state.editingQuestionId,
    activeType: state.activeQuestionFormType,
    draft: state.questionDraft,
    errors: state.draftErrors,
  }));
};

export const useUploadProgress = (key: string) => {
  return useChallengeQuestionsStore(
    (state) => state.uploadingMedia.get(key)?.progress ?? 0
  );
};
