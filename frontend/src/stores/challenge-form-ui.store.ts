import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { QuestionStage } from "../definitions/types/QuestionStage";

// Structure: Challenge -> Stages -> Phases -> Questions
interface StagePhases {
  [stageId: string]: string[]; // stageId -> array of phase names
}

interface ChallengeFormUIState {
  // UI State only
  currentChallengeId: string | null;
  currentStage: QuestionStage | null;
  currentPhase: string | null;
  currentStageIndex: number; // Index in the stages array
  currentPhaseIndex: number; // Index in the phases array of current stage
  stages: QuestionStage[]; // Ordered list of stages
  stagePhases: StagePhases; // Map of stage -> phases array
  isCreatingQuestion: boolean;
  activeQuestionFormType: string | null;

  // Actions
  setCurrentChallengeId: (id: string | null) => void;
  setCurrentStage: (stage: QuestionStage | null) => void;
  setCurrentPhase: (phase: string | null) => void;
  setCurrentStageIndex: (index: number) => void;
  setCurrentPhaseIndex: (index: number) => void;
  addStage: (stage: QuestionStage) => void;
  addPhase: (stage: QuestionStage, phaseName?: string) => void;
  nextStage: () => void;
  prevStage: () => void;
  nextPhase: () => void;
  prevPhase: () => void;
  getCurrentStagePhases: () => string[];
  getPhaseName: (stage: QuestionStage, index: number) => string;
  setIsCreatingQuestion: (isCreating: boolean) => void;
  setActiveQuestionFormType: (type: string | null) => void;
  reset: () => void;
}

const DEFAULT_PHASE_NAME = "phase_1";

export const useChallengeFormUIStore = create<ChallengeFormUIState>()(
  devtools((set, get) => ({
    currentChallengeId: null,
    currentStage: null,
    currentPhase: null,
    currentStageIndex: 0,
    currentPhaseIndex: 0,
    stages: [],
    stagePhases: {},
    isCreatingQuestion: false,
    activeQuestionFormType: null,

    setCurrentChallengeId: (id) => set({ currentChallengeId: id }),
    
    setCurrentStage: (stage) => {
      if (!stage) {
        set({ currentStage: null, currentPhase: null });
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
      
      const phases = state.stagePhases[stage] || [];
      const defaultPhase = phases.length > 0 ? phases[0] : DEFAULT_PHASE_NAME;
      
      set({
        currentStage: stage,
        currentStageIndex: stageIndex,
        currentPhase: defaultPhase,
        currentPhaseIndex: 0,
      });
    },
    
    setCurrentPhase: (phase) => {
      const state = get();
      if (!state.currentStage || !phase) return;
      
      const phases = state.stagePhases[state.currentStage] || [];
      const phaseIndex = phases.indexOf(phase);
      
      set({
        currentPhase: phase,
        currentPhaseIndex: phaseIndex >= 0 ? phaseIndex : 0,
      });
    },
    
    setCurrentStageIndex: (index) => {
      const state = get();
      if (index >= 0 && index < state.stages.length) {
        const stage = state.stages[index];
        get().setCurrentStage(stage);
      }
    },
    
    setCurrentPhaseIndex: (index) => {
      const state = get();
      if (!state.currentStage) return;
      
      const phases = state.stagePhases[state.currentStage] || [];
      if (index >= 0 && index < phases.length) {
        const phase = phases[index];
        set({
          currentPhase: phase,
          currentPhaseIndex: index,
        });
      }
    },
    
    addStage: (stage) => {
      set((state) => {
        const newState = { ...state };
        if (!newState.stages.includes(stage)) {
          newState.stages = [...newState.stages, stage];
          // Initialize with default phase if not exists
          if (!newState.stagePhases[stage]) {
            newState.stagePhases = { ...newState.stagePhases, [stage]: [DEFAULT_PHASE_NAME] };
          }
          // If this is the first stage or current stage is null, set it as current
          if (newState.currentStage === null || newState.stages.length === 1) {
            newState.currentStage = stage;
            newState.currentStageIndex = newState.stages.indexOf(stage);
            newState.currentPhase = DEFAULT_PHASE_NAME;
            newState.currentPhaseIndex = 0;
          }
        }
        return newState;
      });
    },
    
    addPhase: (stage, phaseName) => {
      set((state) => {
        const newState = { ...state };
        if (!newState.stagePhases[stage]) {
          newState.stagePhases = { ...newState.stagePhases, [stage]: [] };
        }
        
        const phases = [...(newState.stagePhases[stage] || [])];
        const newPhaseName = phaseName || `phase_${phases.length + 1}`;
        
        if (!phases.includes(newPhaseName)) {
          phases.push(newPhaseName);
          newState.stagePhases = { ...newState.stagePhases, [stage]: phases };
          // If we're on this stage and have no phase, set the new one
          if (newState.currentStage === stage && !newState.currentPhase) {
            newState.currentPhase = newPhaseName;
            newState.currentPhaseIndex = phases.length - 1;
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
    
    nextPhase: () => {
      const state = get();
      if (!state.currentStage) return;
      
      const phases = state.stagePhases[state.currentStage] || [];
      if (state.currentPhaseIndex < phases.length - 1) {
        get().setCurrentPhaseIndex(state.currentPhaseIndex + 1);
      }
    },
    
    prevPhase: () => {
      const state = get();
      if (state.currentPhaseIndex > 0) {
        get().setCurrentPhaseIndex(state.currentPhaseIndex - 1);
      }
    },
    
    getCurrentStagePhases: () => {
      const state = get();
      if (!state.currentStage) return [];
      return state.stagePhases[state.currentStage] || [];
    },
    
    getPhaseName: (stage, index) => {
      const state = get();
      const phases = state.stagePhases[stage] || [];
      return phases[index] || DEFAULT_PHASE_NAME;
    },
    
    setIsCreatingQuestion: (isCreating) =>
      set({ isCreatingQuestion: isCreating }),
    setActiveQuestionFormType: (type) => set({ activeQuestionFormType: type }),
    
    reset: () =>
      set({
        currentChallengeId: null,
        currentStage: null,
        currentPhase: null,
        currentStageIndex: 0,
        currentPhaseIndex: 0,
        stages: [],
        stagePhases: {},
        isCreatingQuestion: false,
        activeQuestionFormType: null,
      }),
  })),
);
