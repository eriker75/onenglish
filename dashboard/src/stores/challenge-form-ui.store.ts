import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { QuestionStage } from "../definitions/types/QuestionStage";

// Simplified structure: Challenge -> Stages -> Questions (organized by type)
interface ChallengeFormUIState {
  // UI State only
  currentChallengeId: string | null;
  currentStage: QuestionStage | null;
  currentStageIndex: number; // Index in the stages array
  currentQuestionType: string | null; // Current selected question type filter
  stages: QuestionStage[]; // Ordered list of stages
  isCreatingQuestion: boolean;
  activeQuestionFormType: string | null;

  // Actions
  setCurrentChallengeId: (id: string | null) => void;
  setCurrentStage: (stage: QuestionStage | null) => void;
  setCurrentStageIndex: (index: number) => void;
  setCurrentQuestionType: (type: string | null) => void;
  addStage: (stage: QuestionStage) => void;
  nextStage: () => void;
  prevStage: () => void;
  setIsCreatingQuestion: (isCreating: boolean) => void;
  setActiveQuestionFormType: (type: string | null) => void;
  reset: () => void;
}

export const useChallengeFormUIStore = create<ChallengeFormUIState>()(
  devtools((set, get) => ({
    currentChallengeId: null,
    currentStage: null,
    currentStageIndex: 0,
    currentQuestionType: null,
    stages: [],
    isCreatingQuestion: false,
    activeQuestionFormType: null,

    setCurrentChallengeId: (id) => set({ currentChallengeId: id }),

    setCurrentQuestionType: (type) => set({ currentQuestionType: type }),

    setCurrentStage: (stage) => {
      if (!stage) {
        set({ currentStage: null });
        return;
      }

      const state = get();

      // Avoid unnecessary updates if already set to this stage
      if (state.currentStage === stage) {
        return;
      }

      const stageIndex = state.stages.indexOf(stage);

      if (stageIndex === -1) {
        // Stage doesn't exist, add it
        get().addStage(stage);
        return;
      }

      set({
        currentStage: stage,
        currentStageIndex: stageIndex,
      });
    },

    setCurrentStageIndex: (index) => {
      const state = get();
      if (index >= 0 && index < state.stages.length) {
        const stage = state.stages[index];
        get().setCurrentStage(stage);
      }
    },

    addStage: (stage) => {
      set((state) => {
        const newState = { ...state };
        if (!newState.stages.includes(stage)) {
          newState.stages = [...newState.stages, stage];
          // If this is the first stage or current stage is null, set it as current
          if (newState.currentStage === null || newState.stages.length === 1) {
            newState.currentStage = stage;
            newState.currentStageIndex = newState.stages.indexOf(stage);
          }
        }
        return newState;
      });
    },

    nextStage: () => {
      const state = get();
      if (state.currentStageIndex < state.stages.length - 1) {
        get().setCurrentStageIndex(state.currentStageIndex + 1);
      }
    },

    prevStage: () => {
      const state = get();
      if (state.currentStageIndex > 0) {
        get().setCurrentStageIndex(state.currentStageIndex - 1);
      }
    },

    setIsCreatingQuestion: (isCreating) =>
      set({ isCreatingQuestion: isCreating }),
    setActiveQuestionFormType: (type) => set({ activeQuestionFormType: type }),

    reset: () =>
      set({
        currentChallengeId: null,
        currentStage: null,
        currentStageIndex: 0,
        currentQuestionType: null,
        stages: [],
        isCreatingQuestion: false,
        activeQuestionFormType: null,
      }),
  })),
);
