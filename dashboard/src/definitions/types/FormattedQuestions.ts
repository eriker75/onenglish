/**
 * Formatted Question Types
 * These types match the backend formatted responses from QuestionFormatterService
 * Used for type-safe consumption of API responses
 */

import { QuestionStage, ValidationMethod } from './Question';

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
  createdAt: Date;
  updatedAt: Date;
}

// ==================== VOCABULARY FORMATTED QUESTIONS ====================

export interface FormattedImageToMultipleChoicesQuestion
  extends Omit<BaseQuestionFields, 'configurations'> {
  image: MediaFile | null;
  options: string[];
  answer: string;
}

export interface FormattedSpellingQuestion
  extends Omit<BaseQuestionFields, 'configurations'> {
  image: MediaFile | null;
  answer: string;
}

export interface FormattedWordMatchQuestion extends BaseQuestionFields {
  images: MediaFile[];
  options: string[];
  answer: string;
  configurations?: Record<string, string>;
}

export interface FormattedWordboxQuestion
  extends Omit<BaseQuestionFields, 'configurations'> {
  grid: string[][];
  gridWidth?: string;
  gridHeight?: string;
  maxWords?: string;
  [key: string]: any;
}

export interface FormattedWordAssociationsQuestion extends BaseQuestionFields {
  centralWord: string;
  image: MediaFile | null;
  totalAssociations: number;
  configurations?: Record<string, string>;
}

// ==================== GRAMMAR FORMATTED QUESTIONS ====================

export interface FormattedUnscrambleQuestion extends BaseQuestionFields {
  scrambledWords: string[];
  correctSentence: string;
  configurations?: Record<string, string>;
}

export interface FormattedFillInTheBlankQuestion extends BaseQuestionFields {
  sentence: string;
  options: string[] | null;
  answer: string | string[];
  configurations?: Record<string, string>;
}

export interface FormattedVerbConjugationQuestion extends BaseQuestionFields {
  verb: string;
  context: string;
  tense: string;
  subject: string;
  answer: string;
  configurations?: Record<string, string>;
}

// ==================== LISTENING FORMATTED QUESTIONS ====================

export interface FormattedGossipQuestion
  extends Omit<BaseQuestionFields, 'configurations'> {
  audio: MediaFile | null;
  answer: string;
}

export interface FormattedTopicBasedAudioQuestion extends BaseQuestionFields {
  audio: MediaFile | null;
  subQuestions: FormattedQuestion[];
  configurations?: Record<string, string>;
}

export interface FormattedTopicBasedAudioSubquestion extends BaseQuestionFields {
  content: string;
  options: string[];
  answer: string;
  parentQuestionId?: string;
}

export interface FormattedLyricsTrainingQuestion extends BaseQuestionFields {
  media: MediaFile | null;
  options: string[];
  answer: string;
}

// ==================== WRITING FORMATTED QUESTIONS ====================

export interface FormattedSentenceMakerQuestion extends BaseQuestionFields {
  images: MediaFile[];
}

export interface FormattedTalesQuestion extends BaseQuestionFields {
  images: MediaFile[];
}

export interface FormattedTagItQuestion extends BaseQuestionFields {
  content: string[];
  answer: string[];
  image: MediaFile | null;
}

// ==================== SPEAKING FORMATTED QUESTIONS ====================

export interface FormattedReadItQuestion extends BaseQuestionFields {
  textToRead: string;
  referenceAudio: MediaFile | null;
  configurations?: Record<string, string>;
}

export interface FormattedTellMeAboutItQuestion extends BaseQuestionFields {
  image: MediaFile | null;
  video: MediaFile | null;
  prompt: string;
  minDuration: number;
  configurations?: Record<string, string>;
}

export interface FormattedReportItQuestion extends BaseQuestionFields {
  content: string;
  image: MediaFile | null;
}

export interface FormattedDebateQuestion extends BaseQuestionFields {
  topic: string;
  minDuration: number;
  stance: string;
}

// ==================== SPECIAL FORMATTED QUESTIONS ====================

export interface FormattedFastTestQuestion extends BaseQuestionFields {
  content: string[];
  options: string[];
  answer: string;
}

export interface FormattedSuperbrainQuestion extends BaseQuestionFields {
  content: string;
  image: MediaFile | null;
}

export interface FormattedTensesQuestion extends BaseQuestionFields {
  subQuestions: FormattedQuestion[];
  totalQuestions: number;
  configurations?: Record<string, string>;
}

// ==================== DEFAULT FORMATTED QUESTION ====================

export interface FormattedDefaultQuestion extends BaseQuestionFields {
  content?: any;
  options?: any;
  answer?: any;
  media: MediaFile[];
  subQuestions: FormattedQuestion[];
  configurations?: Record<string, string>;
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

// ==================== TYPE GUARDS ====================

export function isImageToMultipleChoicesQuestion(
  question: FormattedQuestion
): question is FormattedImageToMultipleChoicesQuestion {
  return question.type === 'image_to_multiple_choices';
}

export function isSpellingQuestion(
  question: FormattedQuestion
): question is FormattedSpellingQuestion {
  return question.type === 'spelling';
}

export function isWordMatchQuestion(
  question: FormattedQuestion
): question is FormattedWordMatchQuestion {
  return question.type === 'word_match';
}

// Add more type guards as needed...
