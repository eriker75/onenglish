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
  stages: Map<QuestionStage, Question[]>;
  currentStage: QuestionStage | null;
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

  // ==================== QUESTION CRUD ====================
  addQuestion: (stage: QuestionStage, question: Question) => void;
  updateQuestion: (
    stage: QuestionStage,
    questionIndex: number,
    updates: Partial<Question>,
  ) => void;
  removeQuestion: (stage: QuestionStage, questionIndex: number) => void;
  moveQuestion: (
    stage: QuestionStage,
    fromIndex: number,
    toIndex: number,
  ) => void;
  bulkAddQuestions: (stage: QuestionStage, questions: Question[]) => void;

  // ==================== SPECIALIZED QUESTION METHODS ====================
  // VOCABULARY
  addImageToMultipleChoices: (
    stage: QuestionStage,
    data: Omit<Question, "type" | "stage" | "position">,
  ) => void;
  addWordbox: (
    stage: QuestionStage,
    data: Omit<Question, "type" | "stage" | "position">,
  ) => void;
  addSpelling: (
    stage: QuestionStage,
    data: Omit<Question, "type" | "stage" | "position">,
  ) => void;
  addWordAssociations: (
    stage: QuestionStage,
    data: Omit<Question, "type" | "stage" | "position">,
  ) => void;

  // GRAMMAR
  addUnscramble: (
    stage: QuestionStage,
    data: Omit<Question, "type" | "stage" | "position">,
  ) => void;
  addTenses: (
    stage: QuestionStage,
    data: Omit<Question, "type" | "stage" | "position">,
  ) => void;
  addTagIt: (
    stage: QuestionStage,
    data: Omit<Question, "type" | "stage" | "position">,
  ) => void;
  addReportIt: (
    stage: QuestionStage,
    data: Omit<Question, "type" | "stage" | "position">,
  ) => void;
  addReadIt: (
    stage: QuestionStage,
    data: Omit<Question, "type" | "stage" | "position">,
  ) => void;

  // LISTENING
  addWordMatch: (
    stage: QuestionStage,
    data: Omit<Question, "type" | "stage" | "position">,
  ) => void;
  addGossip: (
    stage: QuestionStage,
    data: Omit<Question, "type" | "stage" | "position">,
  ) => void;
  addTopicBasedAudio: (
    stage: QuestionStage,
    data: Omit<Question, "type" | "stage" | "position">,
  ) => void;
  addLyricsTraining: (
    stage: QuestionStage,
    data: Omit<Question, "type" | "stage" | "position">,
  ) => void;

  // WRITING
  addSentenceMaker: (
    stage: QuestionStage,
    data: Omit<Question, "type" | "stage" | "position">,
  ) => void;
  addFastTest: (
    stage: QuestionStage,
    data: Omit<Question, "type" | "stage" | "position">,
  ) => void;
  addTales: (
    stage: QuestionStage,
    data: Omit<Question, "type" | "stage" | "position">,
  ) => void;

  // SPEAKING
  addSuperbrain: (
    stage: QuestionStage,
    data: Omit<Question, "type" | "stage" | "position">,
  ) => void;
  addTellMeAboutIt: (
    stage: QuestionStage,
    data: Omit<Question, "type" | "stage" | "position">,
  ) => void;
  addDebate: (
    stage: QuestionStage,
    data: Omit<Question, "type" | "stage" | "position">,
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
  getStageQuestions: (stage: QuestionStage) => Question[];
  getQuestionsByType: (stage: QuestionStage, type: string) => Question[];
  getAllQuestions: () => Question[];
  getQuestionCount: () => number;
  getTotalPoints: () => number;

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
  stages: new Map<QuestionStage, Question[]>(),
  currentStage: null,
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
            state.stages.set(stage, []);
          }
        });
      },

      // ==================== QUESTION CRUD ====================

      addQuestion: (stage: QuestionStage, question: Question) => {
        set((state) => {
          if (!state.stages.has(stage)) {
            state.stages.set(stage, []);
          }

          const questions = state.stages.get(stage)!;
          const maxPosition = questions.reduce(
            (max: number, q: Question) => Math.max(max, q.position),
            0,
          );

          questions.push({
            ...question,
            stage,
            position: maxPosition + 1,
          });

          state.isDirty = true;
        });
      },

      updateQuestion: (stage, questionIndex, updates) => {
        set((state) => {
          const questions = state.stages.get(stage);
          if (questions && questions[questionIndex]) {
            questions[questionIndex] = {
              ...questions[questionIndex],
              ...updates,
            };
            state.isDirty = true;
          }
        });
      },

      removeQuestion: (stage, questionIndex) => {
        set((state) => {
          const questions = state.stages.get(stage);
          if (questions) {
            questions.splice(questionIndex, 1);
            questions.forEach((q: Question, idx: number) => {
              q.position = idx + 1;
            });
            state.isDirty = true;
          }
        });
      },

      moveQuestion: (stage, fromIndex, toIndex) => {
        set((state) => {
          const questions = state.stages.get(stage);
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

      bulkAddQuestions: (stage, questions) => {
        set((state) => {
          if (!state.stages.has(stage)) {
            state.stages.set(stage, []);
          }

          const existingQuestions = state.stages.get(stage)!;
          const maxPosition = existingQuestions.reduce(
            (max: number, q: Question) => Math.max(max, q.position),
            0,
          );

          questions.forEach((q: Question, idx: number) => {
            existingQuestions.push({
              ...q,
              stage,
              position: maxPosition + idx + 1,
            });
          });

          state.isDirty = true;
        });
      },

      // ==================== SPECIALIZED QUESTION METHODS ====================

      // VOCABULARY
      addImageToMultipleChoices: (stage, data) => {
        get().addQuestion(stage, {
          ...data,
          type: "image_to_multiple_choices",
        } as Question);
      },

      addWordbox: (stage, data) => {
        get().addQuestion(stage, {
          ...data,
          type: "wordbox",
        } as Question);
      },

      addSpelling: (stage, data) => {
        get().addQuestion(stage, {
          ...data,
          type: "spelling",
        } as Question);
      },

      addWordAssociations: (stage, data) => {
        get().addQuestion(stage, {
          ...data,
          type: "word_associations",
        } as Question);
      },

      // GRAMMAR
      addUnscramble: (stage, data) => {
        get().addQuestion(stage, {
          ...data,
          type: "unscramble",
        } as Question);
      },

      addTenses: (stage, data) => {
        get().addQuestion(stage, {
          ...data,
          type: "tenses",
        } as Question);
      },

      addTagIt: (stage, data) => {
        get().addQuestion(stage, {
          ...data,
          type: "tag_it",
        } as Question);
      },

      addReportIt: (stage, data) => {
        get().addQuestion(stage, {
          ...data,
          type: "report_it",
        } as Question);
      },

      addReadIt: (stage, data) => {
        get().addQuestion(stage, {
          ...data,
          type: "read_it",
        } as Question);
      },

      // LISTENING
      addWordMatch: (stage, data) => {
        get().addQuestion(stage, {
          ...data,
          type: "word_match",
        } as Question);
      },

      addGossip: (stage, data) => {
        get().addQuestion(stage, {
          ...data,
          type: "gossip",
        } as Question);
      },

      addTopicBasedAudio: (stage, data) => {
        get().addQuestion(stage, {
          ...data,
          type: "topic_based_audio",
        } as Question);
      },

      addLyricsTraining: (stage, data) => {
        get().addQuestion(stage, {
          ...data,
          type: "lyrics_training",
        } as Question);
      },

      // WRITING
      addSentenceMaker: (stage, data) => {
        get().addQuestion(stage, {
          ...data,
          type: "sentence_maker",
        } as Question);
      },

      addFastTest: (stage, data) => {
        get().addQuestion(stage, {
          ...data,
          type: "fast_test",
        } as Question);
      },

      addTales: (stage, data) => {
        get().addQuestion(stage, { ...data, type: "tales" } as Question);
      },

      // SPEAKING
      addSuperbrain: (stage, data) => {
        get().addQuestion(stage, {
          ...data,
          type: "superbrain",
        } as Question);
      },

      addTellMeAboutIt: (stage, data) => {
        get().addQuestion(stage, {
          ...data,
          type: "tell_me_about_it",
        } as Question);
      },

      addDebate: (stage, data) => {
        get().addQuestion(stage, {
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
        return get().stages.get(stage) || [];
      },

      getQuestionsByType: (stage: QuestionStage, type: string) => {
        const questions = get().stages.get(stage) || [];
        return questions.filter((q) => q.type === type);
      },

      getAllQuestions: () => {
        const allQuestions: Question[] = [];
        const { stages } = get();

        stages.forEach((questions) => {
          allQuestions.push(...questions);
        });

        return allQuestions.sort((a, b) => {
          if (a.stage !== b.stage) {
            return STAGES_CONFIG[a.stage].order - STAGES_CONFIG[b.stage].order;
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
        return stageQuestions.length > 0;
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
          state.stages = new Map<QuestionStage, Question[]>();
          state.currentStage = null;
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
              state.stages.set(q.stage, []);
            }

            state.stages.get(q.stage)!.push(q);
          });

          state.stages.forEach((questions: Question[]) => {
            questions.sort((a: Question, b: Question) => a.position - b.position);
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
    questionCount: state.getStageQuestions(stage).length,
    isCurrentStage: state.currentStage === stage,
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
