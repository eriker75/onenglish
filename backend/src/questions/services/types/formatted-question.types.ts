import {
  QuestionStage,
  ValidationMethod,
  Question,
  QuestionMedia,
  QuestionConfiguration,
  MediaFile as PrismaMediaFile,
} from '@prisma/client';

// ==================== BASE TYPES ====================

export interface MediaFile {
  id: string;
  url: string;
  type: string;
  filename: string;
  mimeType: string;
  size: number;
  position: number;
  context: string | null;
}

export interface QuestionConfigurations {
  [key: string]: string;
}

export interface BaseQuestionFields {
  id: string;
  type: string;
  stage: QuestionStage;
  position: number;
  points: number;
  timeLimit: number;
  maxAttempts: number;
  text: string;
  instructions: string;
  validationMethod: ValidationMethod;
  configurations?: QuestionConfigurations;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== RAW QUESTION (from Prisma) ====================

export type QuestionWithRelations = Question & {
  questionMedia?: (QuestionMedia & {
    mediaFile: PrismaMediaFile;
  })[];
  configurations?: QuestionConfiguration[];
  subQuestions?: QuestionWithRelations[];
  challenge?: any;
  parentQuestion?: any;
};

// ==================== ENRICHED QUESTION (processed media & configs) ====================

export interface EnrichedQuestion extends BaseQuestionFields {
  content?: any;
  options?: any;
  answer?: any;
  media: MediaFile[];
  subQuestions?: EnrichedQuestion[];
  challenge?: any;
  parentQuestion?: any;
}

// ==================== VOCABULARY FORMATTED QUESTIONS ====================

export interface FormattedImageToMultipleChoicesQuestion
  extends Omit<BaseQuestionFields, 'configurations'> {
  image: string | null;
  options: string[];
  answer: string;
}

export interface FormattedSpellingQuestion
  extends Omit<BaseQuestionFields, 'configurations'> {
  image: string | null;
  answer: string;
}

export interface FormattedWordMatchQuestion extends BaseQuestionFields {
  audio: string | null;
  options: string[];
  answer: string;
}

export interface FormattedWordboxQuestion
  extends Omit<BaseQuestionFields, 'configurations'> {
  grid: string[][];
  // Configuraciones aplanadas al nivel raíz
  gridWidth?: string;
  gridHeight?: string;
  maxWords?: string;
  [key: string]: any; // Permitir otras configuraciones dinámicas
}

export interface FormattedWordAssociationsQuestion extends BaseQuestionFields {
  centralWord: string;
  image: string | null; // Optional reference image URL
  maxAssociations: number; // Maximum number of associations for scoring
}

// ==================== GRAMMAR FORMATTED QUESTIONS ====================

export interface FormattedUnscrambleQuestion extends BaseQuestionFields {
  scrambledWords: string[];
  correctSentence: string;
  image: string | null;
}

export interface FormattedFillInTheBlankQuestion extends BaseQuestionFields {
  sentence: string;
  options: string[] | null;
  answer: string | string[];
}

export interface FormattedVerbConjugationQuestion extends BaseQuestionFields {
  verb: string;
  context: string;
  tense: string;
  subject: string;
  answer: string;
}

// ==================== LISTENING FORMATTED QUESTIONS ====================

export interface FormattedGossipQuestion
  extends Omit<BaseQuestionFields, 'configurations'> {
  audio: string | null;
  answer: string;
}

export interface FormattedTopicBasedAudioQuestion extends BaseQuestionFields {
  audio: string | null;
  subQuestions: FormattedQuestion[];
}

export interface FormattedTopicBasedAudioSubquestion
  extends BaseQuestionFields {
  content: string;
  options: string[];
  answer: string;
  parentQuestionId?: string;
}

export interface FormattedLyricsTrainingQuestion extends BaseQuestionFields {
  video: string | null;
  options: string[];
  answer: string;
}

// ==================== WRITING FORMATTED QUESTIONS ====================

export interface FormattedSentenceMakerQuestion extends BaseQuestionFields {
  images: string[];
}

export interface FormattedTalesQuestion extends BaseQuestionFields {
  image: string | null;
}

export interface FormattedTagItQuestion extends BaseQuestionFields {
  content: string[]; // Sentence parts (e.g., ["He is responsible for the project,", "?"])
  answer: string[]; // Multiple acceptable answers (e.g., ["isn't he", "is not he"])
  image: string | null; // Optional reference image URL
}

// ==================== SPEAKING FORMATTED QUESTIONS ====================

export interface FormattedReadItQuestion extends BaseQuestionFields {
  content: string; // Reading passage text
  image: string | null; // Optional reference image URL
  subQuestions: FormattedQuestion[];
}

export interface FormattedReadItSubquestion extends BaseQuestionFields {
  content: string; // Question statement
  options: boolean[]; // True/False options [true, false]
  answer: boolean; // Correct answer
  parentQuestionId?: string;
}

export interface FormattedTellMeAboutItQuestion extends BaseQuestionFields {
  image: string | null;
  video: string | null;
  prompt: string;
  minDuration: number;
}

export interface FormattedReportItQuestion extends BaseQuestionFields {
  content: string; // Direct speech sentence to convert
  image: string | null; // Optional reference image URL
}

export interface FormattedDebateQuestion extends BaseQuestionFields {
  topic: string;
  minDuration: number;
  stance: string;
  image: string | null;
}

// ==================== SPECIAL FORMATTED QUESTIONS ====================

export interface FormattedFastTestQuestion extends BaseQuestionFields {
  content: string[];
  options: string[];
  answer: string;
}

export interface FormattedSuperbrainQuestion extends BaseQuestionFields {
  content: string;
  image: string | null;
}

export interface FormattedTensesQuestion extends BaseQuestionFields {
  content: string; // Sentence to identify tense from
  options: string[]; // Tense options
  answer: string; // Correct tense
  image: string | null; // Optional reference image URL
}

// ==================== DEFAULT FORMATTED QUESTION ====================

export interface FormattedDefaultQuestion extends BaseQuestionFields {
  content?: any;
  options?: any;
  answer?: any;
  image?: string | null;
  audio?: string | null;
  video?: string | null;
  images?: string[];
  audios?: string[];
  subQuestions: FormattedQuestion[];
}

// ==================== UNION TYPE ====================

export type FormattedQuestion =
  // Vocabulary
  | FormattedImageToMultipleChoicesQuestion
  | FormattedSpellingQuestion
  | FormattedWordMatchQuestion
  | FormattedWordboxQuestion
  | FormattedWordAssociationsQuestion
  // Grammar
  | FormattedUnscrambleQuestion
  | FormattedFillInTheBlankQuestion
  | FormattedVerbConjugationQuestion
  // Listening
  | FormattedGossipQuestion
  | FormattedTopicBasedAudioQuestion
  | FormattedTopicBasedAudioSubquestion
  | FormattedLyricsTrainingQuestion
  // Writing
  | FormattedSentenceMakerQuestion
  | FormattedTalesQuestion
  | FormattedTagItQuestion
  // Speaking
  | FormattedReadItQuestion
  | FormattedTellMeAboutItQuestion
  | FormattedReportItQuestion
  | FormattedDebateQuestion
  // Special
  | FormattedFastTestQuestion
  | FormattedSuperbrainQuestion
  | FormattedTensesQuestion
  // Default
  | FormattedDefaultQuestion;
