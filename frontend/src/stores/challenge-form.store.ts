// stores/challenge-form.store.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// ==================== TYPES ====================
export type QuestionStage =
  | "VOCABULARY"
  | "GRAMMAR"
  | "LISTENING"
  | "WRITING"
  | "SPEAKING";

export type ValidationMethod = "AUTO" | "IA";

export interface MediaReference {
  type: "image" | "audio" | "video";
  id: string;
}

export interface Challenge {
  id?: string;
  title: string;
  slug: string;
  description?: string;
  category: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  difficulty: "easy" | "medium" | "hard";
  totalPoints: number;
  isPublished: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Question {
  id?: string;
  challengeId?: string;
  stage: QuestionStage;
  phase: string;
  position: number;
  type: string;
  points: number;
  timeLimit: number;
  maxAttempts: number;
  text: string;
  instructions: string;
  validationMethod: ValidationMethod;
  content?: unknown;
  options?: unknown[];
  answer?: string | string[] | boolean;
  configuration?: Record<string, unknown>;
  parentQuestionId?: string;
  subQuestions?: Question[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MediaPreview {
  id: string;
  type: "image" | "audio" | "video";
  url: string;
  file?: File;
  uploadStatus: "pending" | "uploading" | "uploaded" | "error";
  fileName?: string;
}

// ==================== CONSTANTS ====================

export const STAGES_CONFIG: Record<
  QuestionStage,
  { name: string; order: number }
> = {
  VOCABULARY: { name: "Vocabulary", order: 1 },
  GRAMMAR: { name: "Grammar", order: 2 },
  LISTENING: { name: "Listening", order: 3 },
  WRITING: { name: "Writing", order: 4 },
  SPEAKING: { name: "Speaking", order: 5 },
};

// ==================== STORE INTERFACE ====================

interface ChallengeFormState {
  // Core state
  challenge: Partial<Challenge>;
  stages: Map<QuestionStage, Map<string, Question[]>>;
  currentStage: QuestionStage | null;
  currentPhase: string | null;
  isDirty: boolean;
  validationErrors: Record<string, string[]>;
  mediaPreviewCache: Map<string, MediaPreview>;
}

interface ChallengeFormActions {
  // ==================== CHALLENGE ACTIONS ====================
  setChallengeData: (data: Partial<Challenge>) => void;
  updateChallengeField: <K extends keyof Challenge>(
    field: K,
    value: Challenge[K],
  ) => void;

  // ==================== NAVIGATION ====================
  setCurrentStage: (stage: QuestionStage) => void;
  setCurrentPhase: (phase: string) => void;

  // ==================== QUESTION CRUD ====================
  addQuestion: (
    stage: QuestionStage,
    phase: string,
    question: Question,
  ) => void;
  updateQuestion: (
    stage: QuestionStage,
    phase: string,
    questionIndex: number,
    updates: Partial<Question>,
  ) => void;
  removeQuestion: (
    stage: QuestionStage,
    phase: string,
    questionIndex: number,
  ) => void;
  moveQuestion: (
    stage: QuestionStage,
    phase: string,
    fromIndex: number,
    toIndex: number,
  ) => void;

  // ==================== PHASE MANAGEMENT ====================
  addPhase: (stage: QuestionStage, phase: string) => void;
  removePhase: (stage: QuestionStage, phase: string) => void;
  bulkAddQuestions: (
    stage: QuestionStage,
    phase: string,
    questions: Question[],
  ) => void;

  // ==================== SPECIALIZED QUESTION METHODS ====================
  // VOCABULARY
  addImageToMultipleChoices: (
    stage: QuestionStage,
    phase: string,
    data: Omit<Question, "type" | "stage" | "phase" | "position">,
  ) => void;
  addWordbox: (
    stage: QuestionStage,
    phase: string,
    data: Omit<Question, "type" | "stage" | "phase" | "position">,
  ) => void;
  addSpelling: (
    stage: QuestionStage,
    phase: string,
    data: Omit<Question, "type" | "stage" | "phase" | "position">,
  ) => void;
  addWordAssociations: (
    stage: QuestionStage,
    phase: string,
    data: Omit<Question, "type" | "stage" | "phase" | "position">,
  ) => void;

  // GRAMMAR
  addUnscramble: (
    stage: QuestionStage,
    phase: string,
    data: Omit<Question, "type" | "stage" | "phase" | "position">,
  ) => void;
  addTenses: (
    stage: QuestionStage,
    phase: string,
    data: Omit<Question, "type" | "stage" | "phase" | "position">,
  ) => void;
  addTagIt: (
    stage: QuestionStage,
    phase: string,
    data: Omit<Question, "type" | "stage" | "phase" | "position">,
  ) => void;
  addReportIt: (
    stage: QuestionStage,
    phase: string,
    data: Omit<Question, "type" | "stage" | "phase" | "position">,
  ) => void;
  addReadIt: (
    stage: QuestionStage,
    phase: string,
    data: Omit<Question, "type" | "stage" | "phase" | "position">,
  ) => void;

  // LISTENING
  addWordMatch: (
    stage: QuestionStage,
    phase: string,
    data: Omit<Question, "type" | "stage" | "phase" | "position">,
  ) => void;
  addGossip: (
    stage: QuestionStage,
    phase: string,
    data: Omit<Question, "type" | "stage" | "phase" | "position">,
  ) => void;
  addTopicBasedAudio: (
    stage: QuestionStage,
    phase: string,
    data: Omit<Question, "type" | "stage" | "phase" | "position">,
  ) => void;
  addLyricsTraining: (
    stage: QuestionStage,
    phase: string,
    data: Omit<Question, "type" | "stage" | "phase" | "position">,
  ) => void;

  // WRITING
  addSentenceMaker: (
    stage: QuestionStage,
    phase: string,
    data: Omit<Question, "type" | "stage" | "phase" | "position">,
  ) => void;
  addFastTest: (
    stage: QuestionStage,
    phase: string,
    data: Omit<Question, "type" | "stage" | "phase" | "position">,
  ) => void;
  addTales: (
    stage: QuestionStage,
    phase: string,
    data: Omit<Question, "type" | "stage" | "phase" | "position">,
  ) => void;

  // SPEAKING
  addSuperbrain: (
    stage: QuestionStage,
    phase: string,
    data: Omit<Question, "type" | "stage" | "phase" | "position">,
  ) => void;
  addTellMeAboutIt: (
    stage: QuestionStage,
    phase: string,
    data: Omit<Question, "type" | "stage" | "phase" | "position">,
  ) => void;
  addDebate: (
    stage: QuestionStage,
    phase: string,
    data: Omit<Question, "type" | "stage" | "phase" | "position">,
  ) => void;

  // ==================== MEDIA MANAGEMENT ====================
  addMediaPreview: (media: MediaPreview) => void;
  getMediaPreview: (id: string) => MediaPreview | undefined;
  updateMediaPreviewStatus: (
    id: string,
    status: MediaPreview["uploadStatus"],
  ) => void;
  updateMediaPreviewUrl: (id: string, url: string) => void;
  removeMediaPreview: (id: string) => void;
  clearAllMediaPreviews: () => void;

  // ==================== GETTERS ====================
  getStageQuestions: (stage: QuestionStage) => Map<string, Question[]>;
  getPhaseQuestions: (stage: QuestionStage, phase: string) => Question[];
  getAllQuestions: () => Question[];
  getQuestionCount: () => number;
  getTotalPoints: () => number;
  getPhaseCount: (stage: QuestionStage) => number;
  getAllPhases: (stage: QuestionStage) => string[];

  // ==================== VALIDATION ====================
  validateChallenge: () => boolean;
  validateStage: (stage: QuestionStage) => boolean;
  clearValidationErrors: () => void;

  // ==================== UTILITY ====================
  reset: () => void;
  loadFromChallenge: (challenge: Challenge, questions: Question[]) => void;
  markClean: () => void;
  markDirty: () => void;
}

type ChallengeFormStore = ChallengeFormState & ChallengeFormActions;

// ==================== INITIAL STATE ====================

const initialState: ChallengeFormState = {
  challenge: {
    title: "",
    slug: "",
    category: "mixed",
    level: "A1",
    difficulty: "easy",
    totalPoints: 0,
    isPublished: false,
    isActive: true,
  },
  stages: new Map<QuestionStage, Map<string, Question[]>>(),
  currentStage: null,
  currentPhase: null,
  isDirty: false,
  validationErrors: {},
  mediaPreviewCache: new Map<string, MediaPreview>(),
};

// ==================== STORE ====================

export const useChallengeFormStore = create<ChallengeFormStore>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      // ==================== CHALLENGE ACTIONS ====================

      setChallengeData: (data: Partial<Challenge>) => {
        set((state) => {
          state.challenge = { ...state.challenge, ...data };
          state.isDirty = true;
        });
      },

      updateChallengeField: (field, value) => {
        set((state) => {
          state.challenge = {
            ...state.challenge,
            [field]: value,
          };
          state.isDirty = true;
        });
      },

      // ==================== NAVIGATION ====================

      setCurrentStage: (stage: QuestionStage) => {
        set((state) => {
          state.currentStage = stage;
          if (!state.stages.has(stage)) {
            state.stages.set(stage, new Map<string, Question[]>());
          }
        });
      },

      setCurrentPhase: (phase: string) => {
        set((state) => {
          state.currentPhase = phase;
        });
      },

      // ==================== QUESTION CRUD ====================

      addQuestion: (
        stage: QuestionStage,
        phase: string,
        question: Question,
      ) => {
        set((state) => {
          if (!state.stages.has(stage)) {
            state.stages.set(stage, new Map<string, Question[]>());
          }

          const stageMap = state.stages.get(stage)!;

          if (!stageMap.has(phase)) {
            stageMap.set(phase, []);
          }

          const questions = stageMap.get(phase)!;
          const maxPosition = questions.reduce(
            (max: number, q: Question) => Math.max(max, q.position),
            0,
          );

          questions.push({
            ...question,
            stage,
            phase,
            position: maxPosition + 1,
          });

          state.isDirty = true;
        });
      },

      updateQuestion: (stage, phase, questionIndex, updates) => {
        set((state) => {
          const questions = state.stages.get(stage)?.get(phase);
          if (questions && questions[questionIndex]) {
            questions[questionIndex] = {
              ...questions[questionIndex],
              ...updates,
            };
            state.isDirty = true;
          }
        });
      },

      removeQuestion: (stage, phase, questionIndex) => {
        set((state) => {
          const questions = state.stages.get(stage)?.get(phase);
          if (questions) {
            questions.splice(questionIndex, 1);
            questions.forEach((q: Question, idx: number) => {
              q.position = idx + 1;
            });
            state.isDirty = true;
          }
        });
      },

      moveQuestion: (stage, phase, fromIndex, toIndex) => {
        set((state) => {
          const questions = state.stages.get(stage)?.get(phase);
          if (
            questions &&
            fromIndex >= 0 &&
            fromIndex < questions.length &&
            toIndex >= 0 &&
            toIndex < questions.length
          ) {
            const [removed] = questions.splice(fromIndex, 1);
            questions.splice(toIndex, 0, removed);
            questions.forEach((q: Question, idx: number) => {
              q.position = idx + 1;
            });
            state.isDirty = true;
          }
        });
      },

      // ==================== PHASE MANAGEMENT ====================

      addPhase: (stage: QuestionStage, phase: string) => {
        set((state) => {
          if (!state.stages.has(stage)) {
            state.stages.set(stage, new Map<string, Question[]>());
          }
          const stageMap = state.stages.get(stage)!;
          if (!stageMap.has(phase)) {
            stageMap.set(phase, []);
            state.isDirty = true;
          }
        });
      },

      removePhase: (stage: QuestionStage, phase: string) => {
        set((state) => {
          const stageMap = state.stages.get(stage);
          if (stageMap?.has(phase)) {
            stageMap.delete(phase);
            state.isDirty = true;
          }
        });
      },

      bulkAddQuestions: (stage, phase, questions) => {
        set((state) => {
          if (!state.stages.has(stage)) {
            state.stages.set(stage, new Map<string, Question[]>());
          }

          const stageMap = state.stages.get(stage)!;
          if (!stageMap.has(phase)) {
            stageMap.set(phase, []);
          }

          const existingQuestions = stageMap.get(phase)!;
          const maxPosition = existingQuestions.reduce(
            (max: number, q: Question) => Math.max(max, q.position),
            0,
          );

          questions.forEach((q: Question, idx: number) => {
            existingQuestions.push({
              ...q,
              stage,
              phase,
              position: maxPosition + idx + 1,
            });
          });

          state.isDirty = true;
        });
      },

      // ==================== SPECIALIZED QUESTION METHODS ====================

      // VOCABULARY
      addImageToMultipleChoices: (stage, phase, data) => {
        get().addQuestion(stage, phase, {
          ...data,
          type: "image_to_multiple_choices",
        } as Question);
      },

      addWordbox: (stage, phase, data) => {
        get().addQuestion(stage, phase, {
          ...data,
          type: "wordbox",
        } as Question);
      },

      addSpelling: (stage, phase, data) => {
        get().addQuestion(stage, phase, {
          ...data,
          type: "spelling",
        } as Question);
      },

      addWordAssociations: (stage, phase, data) => {
        get().addQuestion(stage, phase, {
          ...data,
          type: "word_associations",
        } as Question);
      },

      // GRAMMAR
      addUnscramble: (stage, phase, data) => {
        get().addQuestion(stage, phase, {
          ...data,
          type: "unscramble",
        } as Question);
      },

      addTenses: (stage, phase, data) => {
        get().addQuestion(stage, phase, {
          ...data,
          type: "tenses",
        } as Question);
      },

      addTagIt: (stage, phase, data) => {
        get().addQuestion(stage, phase, {
          ...data,
          type: "tag_it",
        } as Question);
      },

      addReportIt: (stage, phase, data) => {
        get().addQuestion(stage, phase, {
          ...data,
          type: "report_it",
        } as Question);
      },

      addReadIt: (stage, phase, data) => {
        get().addQuestion(stage, phase, {
          ...data,
          type: "read_it",
        } as Question);
      },

      // LISTENING
      addWordMatch: (stage, phase, data) => {
        get().addQuestion(stage, phase, {
          ...data,
          type: "word_match",
        } as Question);
      },

      addGossip: (stage, phase, data) => {
        get().addQuestion(stage, phase, {
          ...data,
          type: "gossip",
        } as Question);
      },

      addTopicBasedAudio: (stage, phase, data) => {
        get().addQuestion(stage, phase, {
          ...data,
          type: "topic_based_audio",
        } as Question);
      },

      addLyricsTraining: (stage, phase, data) => {
        get().addQuestion(stage, phase, {
          ...data,
          type: "lyrics_training",
        } as Question);
      },

      // WRITING
      addSentenceMaker: (stage, phase, data) => {
        get().addQuestion(stage, phase, {
          ...data,
          type: "sentence_maker",
        } as Question);
      },

      addFastTest: (stage, phase, data) => {
        get().addQuestion(stage, phase, {
          ...data,
          type: "fast_test",
        } as Question);
      },

      addTales: (stage, phase, data) => {
        get().addQuestion(stage, phase, { ...data, type: "tales" } as Question);
      },

      // SPEAKING
      addSuperbrain: (stage, phase, data) => {
        get().addQuestion(stage, phase, {
          ...data,
          type: "superbrain",
        } as Question);
      },

      addTellMeAboutIt: (stage, phase, data) => {
        get().addQuestion(stage, phase, {
          ...data,
          type: "tell_me_about_it",
        } as Question);
      },

      addDebate: (stage, phase, data) => {
        get().addQuestion(stage, phase, {
          ...data,
          type: "debate",
        } as Question);
      },

      // ==================== MEDIA MANAGEMENT ====================

      addMediaPreview: (media: MediaPreview) => {
        set((state) => {
          state.mediaPreviewCache.set(media.id, media);
        });
      },

      getMediaPreview: (id: string) => {
        return get().mediaPreviewCache.get(id);
      },

      updateMediaPreviewStatus: (id, status) => {
        set((state) => {
          const media = state.mediaPreviewCache.get(id);
          if (media) {
            media.uploadStatus = status;
          }
        });
      },

      updateMediaPreviewUrl: (id, url) => {
        set((state) => {
          const media = state.mediaPreviewCache.get(id);
          if (media) {
            media.url = url;
          }
        });
      },

      removeMediaPreview: (id: string) => {
        set((state) => {
          state.mediaPreviewCache.delete(id);
        });
      },

      clearAllMediaPreviews: () => {
        set((state) => {
          state.mediaPreviewCache.clear();
        });
      },

      // ==================== GETTERS ====================

      getStageQuestions: (stage: QuestionStage) => {
        return get().stages.get(stage) || new Map<string, Question[]>();
      },

      getPhaseQuestions: (stage: QuestionStage, phase: string) => {
        return get().stages.get(stage)?.get(phase) || [];
      },

      getAllQuestions: () => {
        const allQuestions: Question[] = [];
        const { stages } = get();

        stages.forEach((phaseMap) => {
          phaseMap.forEach((questions) => {
            allQuestions.push(...questions);
          });
        });

        return allQuestions.sort((a, b) => {
          if (a.stage !== b.stage) {
            return STAGES_CONFIG[a.stage].order - STAGES_CONFIG[b.stage].order;
          }
          if (a.phase !== b.phase) {
            return a.phase.localeCompare(b.phase);
          }
          return a.position - b.position;
        });
      },

      getQuestionCount: () => {
        return get().getAllQuestions().length;
      },

      getTotalPoints: () => {
        return get()
          .getAllQuestions()
          .reduce((sum, q) => sum + q.points, 0);
      },

      getPhaseCount: (stage: QuestionStage) => {
        return get().stages.get(stage)?.size || 0;
      },

      getAllPhases: (stage: QuestionStage) => {
        const stageMap = get().stages.get(stage);
        return stageMap ? Array.from(stageMap.keys()) : [];
      },

      // ==================== VALIDATION ====================

      validateChallenge: () => {
        const { challenge } = get();
        const errors: Record<string, string[]> = {};

        if (!challenge.title?.trim()) {
          errors.title = ["Title is required"];
        }

        if (!challenge.slug?.trim()) {
          errors.slug = ["Slug is required"];
        }

        if (!challenge.level) {
          errors.level = ["Level is required"];
        }

        if (!challenge.difficulty) {
          errors.difficulty = ["Difficulty is required"];
        }

        if (get().getQuestionCount() === 0) {
          errors.questions = ["At least one question is required"];
        }

        set((state) => {
          state.validationErrors = errors;
        });

        return Object.keys(errors).length === 0;
      },

      validateStage: (stage: QuestionStage) => {
        const stageQuestions = get().getStageQuestions(stage);
        return stageQuestions.size > 0;
      },

      clearValidationErrors: () => {
        set((state) => {
          state.validationErrors = {};
        });
      },

      // ==================== UTILITY ====================

      reset: () => {
        set((state) => {
          state.challenge = initialState.challenge;
          state.stages = new Map<QuestionStage, Map<string, Question[]>>();
          state.currentStage = null;
          state.currentPhase = null;
          state.isDirty = false;
          state.validationErrors = {};
          state.mediaPreviewCache = new Map<string, MediaPreview>();
        });
      },

      loadFromChallenge: (challenge: Challenge, questions: Question[]) => {
        set((state) => {
          state.challenge = challenge;
          state.stages = new Map();

          questions.forEach((q) => {
            if (!state.stages.has(q.stage)) {
              state.stages.set(q.stage, new Map<string, Question[]>());
            }

            const stageMap = state.stages.get(q.stage)!;
            if (!stageMap.has(q.phase)) {
              stageMap.set(q.phase, []);
            }

            stageMap.get(q.phase)!.push(q);
          });

          state.stages.forEach((phaseMap: Map<string, Question[]>) => {
            phaseMap.forEach((questions: Question[]) => {
              questions.sort(
                (a: Question, b: Question) => a.position - b.position,
              );
            });
          });

          state.isDirty = false;
        });
      },

      markClean: () => {
        set((state) => {
          state.isDirty = false;
        });
      },

      markDirty: () => {
        set((state) => {
          state.isDirty = true;
        });
      },
    })),
    { name: "ChallengeFormStore" },
  ),
);

// ==================== HELPER HOOKS ====================

// Hook para obtener el estado de un stage específico
export const useStageState = (stage: QuestionStage) => {
  return useChallengeFormStore((state) => ({
    questions: state.getStageQuestions(stage),
    phases: state.getAllPhases(stage),
    phaseCount: state.getPhaseCount(stage),
    isCurrentStage: state.currentStage === stage,
  }));
};

// Hook para obtener el estado de una fase específica
export const usePhaseState = (stage: QuestionStage, phase: string) => {
  return useChallengeFormStore((state) => ({
    questions: state.getPhaseQuestions(stage, phase),
    isCurrentPhase: state.currentPhase === phase,
  }));
};

// Hook para el estado general del challenge
export const useChallengeState = () => {
  return useChallengeFormStore((state) => ({
    challenge: state.challenge,
    totalQuestions: state.getQuestionCount(),
    totalPoints: state.getTotalPoints(),
    isDirty: state.isDirty,
    validationErrors: state.validationErrors,
  }));
};
