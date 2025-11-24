import { Question } from "../types";

// Base properties that extend Question
export interface BaseQuestionData {
  instructions?: string;
  points?: number;
  timeLimit?: number;
  maxAttempts?: number;
  position?: number;
  validationMethod?: string;

  // Media URLs - Backend returns simple strings
  image?: string;      // Path like "/uploads/image/xxx.png"
  audio?: string;      // Path like "/uploads/audio/xxx.mp3"
  video?: string;      // Path like "/uploads/video/xxx.mp4"
  mediaUrl?: string;   // Legacy compatibility
}

// WordBox specific types
export interface WordBoxQuestion extends Question, BaseQuestionData {
  maxWords?: number;
  gridWidth?: number;
  gridHeight?: number;
  content?: string[][];
}

export interface WordBoxPayload {
  challengeId: string;
  gridWidth: number;
  gridHeight: number;
  maxWords: number;
  content: string[][];
  points: number;
  timeLimit?: number;
  maxAttempts: number;
  text?: string;
  instructions?: string;
}

// Spelling specific types
export interface SpellingQuestion extends Question, BaseQuestionData {
  words?: string[];
  answer?: string; // correct word
}

export interface SpellingPayload {
  challengeId: string;
  words: string[];
  points: number;
  timeLimit?: number;
  maxAttempts: number;
  text?: string;
  instructions?: string;
}

// Word Associations specific types
export interface WordAssociationsQuestion extends Question, BaseQuestionData {
  words?: string[];
  correctWord?: string;
  content?: string;          // Add for compatibility
  maxAssociations?: number;  // Add for compatibility
  mediaUrl?: string;          // Add for compatibility
}

export interface WordAssociationsPayload {
  challengeId: string;
  words: string[];
  correctWord: string;
  points: number;
  timeLimit?: number;
  maxAttempts: number;
  text?: string;
  instructions?: string;
}

// Unscramble specific types
export interface UnscrambleQuestion extends Question, BaseQuestionData {
  scrambledSentence?: string;
  correctSentence?: string;
  content?: string[]; // scrambled words
  answer?: string | string[]; // correct sentence
}

export interface UnscramblePayload {
  challengeId: string;
  scrambledSentence: string;
  correctSentence: string;
  points: number;
  timeLimit?: number;
  maxAttempts: number;
  text?: string;
  instructions?: string;
}

// Tenses specific types
export interface TensesQuestion extends Question, BaseQuestionData {
  sentence?: string;
  correctTense?: string;
  content?: string; // sentence
  answer?: string; // correct answer
}

export interface TensesPayload {
  challengeId: string;
  text?: string;
  instructions?: string;
  content: string; // sentence
  options: string[];
  answer: string; // correct answer
  points: number;
  timeLimit: number;
  maxAttempts: number;
  stage: string;
}

// TagIt specific types
export interface TagItQuestion extends Question, BaseQuestionData {
  text?: string;
  tags?: Array<{ word: string; tag: string }>;
  content?: string[] | any;  // Add for compatibility with wrapper
  answer?: string[] | any;    // Add for compatibility with wrapper
}

export interface TagItPayload {
  challengeId: string;
  text: string;
  tags: Array<{ word: string; tag: string }>;
  points: number;
  timeLimit?: number;
  maxAttempts: number;
  instructions?: string;
}

// ReportIt specific types
export interface ReportItQuestion extends Question, BaseQuestionData {
  originalText?: string;
  reportedText?: string;
  content?: string;
  answer?: string;
}

export interface ReportItPayload {
  challengeId: string;
  originalText: string;
  reportedText: string;
  points: number;
  timeLimit?: number;
  maxAttempts: number;
  text?: string;
  instructions?: string;
}

// ReadIt specific types
export interface ReadItSubQuestion {
  id?: string;
  content?: string;
  text?: string;
  correct?: boolean;
}

export interface ReadItQuestion extends Question, BaseQuestionData {
  passage?: string;
  content?: Array<{ text: string }>;
  subQuestions?: ReadItSubQuestion[];
  questions?: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
}

export interface ReadItPayload {
  challengeId: string;
  passage: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
  points: number;
  timeLimit?: number;
  maxAttempts: number;
  text?: string;
  instructions?: string;
}

// WordMatch specific types
export interface WordMatchQuestion extends Question, BaseQuestionData {
  pairs?: Array<{ word: string; match: string }>;
  audioUrl?: string;  // Add for compatibility
  options?: string[];  // Add for compatibility
  answer?: string;     // Add for compatibility
}

export interface WordMatchPayload {
  challengeId: string;
  pairs: Array<{ word: string; match: string }>;
  points: number;
  timeLimit?: number;
  maxAttempts: number;
  text?: string;
  instructions?: string;
}

// Gossip specific types
export interface GossipQuestion extends Question, BaseQuestionData {
  dialogue?: Array<{ speaker: string; text: string }>;
  answer?: string; // correctTranscription
}

export interface GossipPayload {
  challengeId: string;
  dialogue: Array<{ speaker: string; text: string }>;
  points: number;
  timeLimit?: number;
  maxAttempts: number;
  text?: string;
  instructions?: string;
}

// TopicBasedAudio specific types
export interface SubQuestion {
  id?: string;
  text?: string;
  question?: string;
  options?: string[];
  correctAnswer?: string;
  answer?: string;
  points?: number;
}

export interface TopicBasedAudioQuestion extends Question, BaseQuestionData {
  audioUrl?: string;
  mediaUrl?: string;
  content?: string;
  questions?: SubQuestion[];
  subQuestions?: SubQuestion[];
}

export interface TopicBasedAudioPayload {
  challengeId: string;
  audioUrl: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
  points: number;
  timeLimit?: number;
  maxAttempts: number;
  text?: string;
  instructions?: string;
}

// LyricsTraining specific types
export interface LyricsTrainingQuestion extends Question, BaseQuestionData {
  audioUrl?: string;
  mediaUrl?: string;
  lyrics?: string;
  blanks?: string[];
  answer?: string;
  content?: string;
}

export interface LyricsTrainingPayload {
  challengeId: string;
  audioUrl: string;
  lyrics: string;
  blanks: string[];
  points: number;
  timeLimit?: number;
  maxAttempts: number;
  text?: string;
  instructions?: string;
}

// SentenceMaker specific types
export interface SentenceMakerQuestion extends Question, BaseQuestionData {
  words?: string[];
  correctSentence?: string;
}

export interface SentenceMakerPayload {
  challengeId: string;
  words: string[];
  correctSentence: string;
  points: number;
  timeLimit?: number;
  maxAttempts: number;
  text?: string;
  instructions?: string;
}

// FastTest specific types
export interface FastTestQuestion extends Question, BaseQuestionData {
  questions?: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
  content?: string[]; // Array of sentence parts with blanks
  answer?: string; // correct answer
}

export interface FastTestPayload {
  challengeId: string;
  text?: string;
  instructions?: string;
  content: string[]; // Array of sentence parts
  options: string[];
  answer: string;
  points: number;
  timeLimit: number;
  maxAttempts: number;
  stage: string;
}

// Tales specific types
export interface TalesQuestion extends Question, BaseQuestionData {
  story?: string;
  mediaUrl?: string;  // Add for compatibility
  questions?: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
}

export interface TalesPayload {
  challengeId: string;
  story: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
  points: number;
  timeLimit?: number;
  maxAttempts: number;
  text?: string;
  instructions?: string;
}

// SuperBrain specific types
export interface SuperBrainQuestion extends Question, BaseQuestionData {
  category?: string;
  difficulty?: string;
  content?: string;
}

export interface SuperBrainPayload {
  challengeId: string;
  category: string;
  difficulty: string;
  content: string;
  points: number;
  timeLimit?: number;
  maxAttempts: number;
  text?: string;
  instructions?: string;
}

// TellMeAboutIt specific types
export interface TellMeAboutItQuestion extends Question, BaseQuestionData {
  topic?: string;
  prompts?: string[];
  content?: string;   // Add for compatibility
  mediaUrl?: string;  // Add for compatibility
}

export interface TellMeAboutItPayload {
  challengeId: string;
  topic: string;
  prompts: string[];
  points: number;
  timeLimit?: number;
  maxAttempts: number;
  text?: string;
  instructions?: string;
}

// Debate specific types
export interface DebateQuestion extends Question, BaseQuestionData {
  topic?: string;
  arguments?: string[];
  content?: string; // debate topic/content
  stance?: string; // random/for/against/support/oppose
}

export interface DebatePayload {
  challengeId: string;
  content: string;
  stance: string;
  stage: string;
  text?: string;
  instructions?: string;
  points: number;
  timeLimit: number;
  maxAttempts: number;
}

// ImageToMultipleChoice specific types
export interface ImageToMultipleChoiceQuestion extends Question, BaseQuestionData {
  imageUrl?: string;
  options?: string[];
  correctAnswer?: string;
}

export interface ImageToMultipleChoicePayload {
  challengeId: string;
  imageUrl: string;
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;
  timeLimit?: number;
  maxAttempts: number;
  instructions?: string;
}

// Generic mutation types
export interface CreateMutationFn<T> {
  (data: T): Promise<{ data: unknown }>;
}

export interface UpdateMutationFn<T> {
  (params: { id: string; data: T }): Promise<{ data: unknown }>;
}
