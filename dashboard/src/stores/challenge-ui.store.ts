import { create } from "zustand";
import { devtools } from "zustand/middleware";

/**
 * UI-only store for challenge form
 * All data comes from React Query - this store only manages UI state
 */

export type Stage = "VOCABULARY" | "GRAMMAR" | "LISTENING" | "WRITING" | "SPEAKING";

interface ChallengeUIState {
  // Navigation
  currentChallengeId: string | null;
  currentStage: Stage | null;
  currentQuestionType: string | null;

  // UI State
  isCreatingQuestion: boolean;
  editingQuestionId: string | null;

  // Modal/Dialog State
  showQuestionTypeGrid: boolean;
  showDeleteConfirmation: boolean;
  questionToDelete: string | null;
}

interface ChallengeUIActions {
  // Challenge ID
  setCurrentChallengeId: (id: string | null) => void;

  // Navigation
  setCurrentStage: (stage: Stage | null) => void;
  setCurrentQuestionType: (type: string | null) => void;

  // Question Creation/Editing
  startCreatingQuestion: (type: string) => void;
  stopCreatingQuestion: () => void;
  startEditingQuestion: (questionId: string) => void;
  stopEditingQuestion: () => void;

  // Modals
  openQuestionTypeGrid: () => void;
  closeQuestionTypeGrid: () => void;
  openDeleteConfirmation: (questionId: string) => void;
  closeDeleteConfirmation: () => void;

  // Reset
  reset: () => void;
}

type ChallengeUIStore = ChallengeUIState & ChallengeUIActions;

const initialState: ChallengeUIState = {
  currentChallengeId: null,
  currentStage: null,
  currentQuestionType: null,
  isCreatingQuestion: false,
  editingQuestionId: null,
  showQuestionTypeGrid: false,
  showDeleteConfirmation: false,
  questionToDelete: null,
};

export const useChallengeUIStore = create<ChallengeUIStore>()(
  devtools(
    (set) => ({
      ...initialState,

      // Challenge ID
      setCurrentChallengeId: (id) => set({ currentChallengeId: id }),

      // Navigation
      setCurrentStage: (stage) => set({ currentStage: stage }),
      setCurrentQuestionType: (type) => set({ currentQuestionType: type }),

      // Question Creation/Editing
      startCreatingQuestion: (type) =>
        set({
          isCreatingQuestion: true,
          currentQuestionType: type,
          editingQuestionId: null,
        }),
      stopCreatingQuestion: () =>
        set({
          isCreatingQuestion: false,
          currentQuestionType: null,
        }),
      startEditingQuestion: (questionId) =>
        set({
          editingQuestionId: questionId,
          isCreatingQuestion: false,
        }),
      stopEditingQuestion: () =>
        set({
          editingQuestionId: null,
        }),

      // Modals
      openQuestionTypeGrid: () => set({ showQuestionTypeGrid: true }),
      closeQuestionTypeGrid: () => set({ showQuestionTypeGrid: false }),
      openDeleteConfirmation: (questionId) =>
        set({
          showDeleteConfirmation: true,
          questionToDelete: questionId,
        }),
      closeDeleteConfirmation: () =>
        set({
          showDeleteConfirmation: false,
          questionToDelete: null,
        }),

      // Reset
      reset: () => set(initialState),
    }),
    { name: "ChallengeUIStore" }
  )
);

// Selector hooks for common patterns
export const useCurrentStage = () =>
  useChallengeUIStore((state) => state.currentStage);

export const useCurrentQuestionType = () =>
  useChallengeUIStore((state) => state.currentQuestionType);

export const useIsEditingQuestion = () =>
  useChallengeUIStore((state) => !!state.editingQuestionId);
