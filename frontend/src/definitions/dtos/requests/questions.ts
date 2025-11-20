/**
 * Question Request DTOs
 * These DTOs match the backend NestJS DTOs for creating and updating questions
 */

import {
  QuestionStage,
  ValidTenses,
  QuestionType,
} from '@/src/definitions/types/Question';

// ==================== BASE DTOs ====================

export interface BaseCreateQuestionDto {
  challengeId: string;
  stage: QuestionStage;
  phase: string;
  points: number;
  timeLimit?: number; // Default: 60
  maxAttempts?: number; // Default: 1
  text?: string; // Optional: backend assigns default based on question type
  instructions?: string; // Optional: backend assigns default based on question type
}

// ==================== VOCABULARY CREATE DTOs ====================

export interface CreateImageToMultipleChoicesDto extends BaseCreateQuestionDto {
  media: File; // Single image file (jpeg/png/webp, max 5MB)
  options: string[]; // Minimum 2 options
  answer: string; // Must be one of the options
}

export interface CreateWordboxDto extends BaseCreateQuestionDto {
  gridWidth: number; // Required: 1-10, width of the grid (number of columns)
  gridHeight: number; // Required: 1-10, height of the grid (number of rows)
  maxWords: number; // Required: 1-50, default 5, max words to form
  content: string[][]; // 2D grid of letters, must match gridWidth x gridHeight
}

export interface CreateSpellingDto extends BaseCreateQuestionDto {
  media: File; // Image file (jpeg/png/webp, max 5MB)
  answer: string; // Expected word to spell
}

export interface CreateWordAssociationsDto extends BaseCreateQuestionDto {
  content: string; // Central word
  configuration: Record<string, unknown>; // Required: e.g., { totalAssociations: 20 }
  media?: File; // Optional reference image
}

// ==================== GRAMMAR CREATE DTOs ====================

export interface CreateUnscrambleDto extends BaseCreateQuestionDto {
  content: string[]; // Array of scrambled words (minimum 2)
  answer: string[]; // Correct order as array (minimum 2)
}

export interface CreateTensesDto extends BaseCreateQuestionDto {
  options: ValidTenses[]; // Array of valid tense options
  answer: ValidTenses; // Correct tense
}

export interface CreateTagItDto extends BaseCreateQuestionDto {
  content: string[]; // Sentence parts with missing tag (minimum 2)
  answer: string[]; // Array of acceptable answers (minimum 1)
  media?: File; // Optional reference image (PNG with transparency recommended)
}

export interface CreateReportItDto extends BaseCreateQuestionDto {
  content: string; // Direct speech sentence to convert to reported speech
  media?: File; // Optional reference image (PNG with transparency recommended)
}

export interface PassageDto {
  image?: string; // Optional image ID or URL
  text?: string; // Passage text content
}

export interface SubQuestionDto {
  content: string; // Sub-question statement
  options: [boolean, boolean]; // True/False options
  answer: boolean; // Correct answer
  points: number; // Points for this sub-question
}

export interface CreateReadItDto extends BaseCreateQuestionDto {
  content: PassageDto[]; // Reading passages (can include images and/or text)
  subQuestions: SubQuestionDto[]; // True/False sub-questions
  parentQuestionId?: string; // Optional parent question reference
  // Note: Parent points auto-calculated as sum of sub-question points
}

// ==================== LISTENING CREATE DTOs ====================

export interface CreateWordMatchDto extends BaseCreateQuestionDto {
  media: File | File[]; // Audio file(s) (mp3/wav/ogg/flac/m4a)
  options: string[]; // Word options
  answer: string; // Correct word
}

export interface CreateGossipDto extends BaseCreateQuestionDto {
  media: File; // Reference audio file
  answer: string; // Expected transcription
}

export interface TopicBasedAudioSubQuestionDto {
  text: string; // Sub-question text
  options: string[]; // Multiple choice options (minimum 2)
  answer: string; // Correct answer (must be one of the options)
  points: number; // Points for this sub-question
}

export interface CreateTopicBasedAudioDto extends BaseCreateQuestionDto {
  media: File; // Audio file (mp3/wav/ogg, max 10MB)
  subQuestions: TopicBasedAudioSubQuestionDto[]; // Will be serialized to JSON string for backend
  parentQuestionId?: string; // Optional parent question reference
  // Note: Parent points auto-calculated as sum of sub-question points
}

export interface CreateLyricsTrainingDto extends BaseCreateQuestionDto {
  media: File; // Audio or video file
  content: string; // Lyrics with blank (e.g., "I want to _____ your hand.")
  answer: string; // Missing word/phrase
}

// ==================== WRITING CREATE DTOs ====================

export interface CreateSentenceMakerDto extends BaseCreateQuestionDto {
  media: File | File[]; // Multiple images (inspiration for sentence)
  // Answer is student-provided text, validated by IA
}

export interface CreateFastTestDto extends BaseCreateQuestionDto {
  content: string[]; // Sentence parts (e.g., ["I enjoy", "to the beach"])
  options: string[]; // Options to complete sentence
  answer: string; // Correct option
}

export interface CreateTalesDto extends BaseCreateQuestionDto {
  media: File | File[]; // 1-5 images
  configuration?: {
    minWords?: number;
    maxWords?: number;
  };
  // Answer is student-provided story, validated by IA
}

// ==================== SPEAKING CREATE DTOs ====================

export interface CreateSuperbrainDto extends BaseCreateQuestionDto {
  content: string; // Question prompt for audio response
  media?: File; // Optional image prompt (max 5MB)
  // Student uploads audio answer
  // Validated by IA for pronunciation, grammar, relevance, coherence
}

export interface CreateTellMeAboutItDto extends BaseCreateQuestionDto {
  content: string; // Story prompt topic (e.g., "your first toy")
  media?: File; // Optional reference image for the story
  // Student uploads audio answer
  // Validated by IA for storytelling, pronunciation, grammar, creativity
}

export interface CreateDebateDto extends BaseCreateQuestionDto {
  content: string; // Topic statement (e.g., "Should students wear uniforms?")
  configuration?: {
    stanceOptions?: string; // e.g., "for,against"
  };
  // Student uploads audio argument
  // Validated by IA for clarity, evidence, pronunciation, persuasiveness
}

// ==================== UPDATE DTOs ====================

export interface UpdateQuestionDto {
  text?: string;
  instructions?: string;
  timeLimit?: number;
  points?: number;
  phase?: string;
  content?: unknown;
  options?: unknown;
  answer?: unknown;
  configurations?: Record<string, string>;
  media?: File; // Optional media update for questions that support it
}

// Specific update DTOs for questions with complex structures
export interface UpdateImageToMultipleChoicesDto {
  text?: string;
  instructions?: string;
  timeLimit?: number;
  points?: number;
  options?: string[];
  answer?: string;
  media?: File; // Replace image (single file)
}

export interface UpdateReadItDto {
  text?: string;
  instructions?: string;
  timeLimit?: number;
  content?: PassageDto[];
  subQuestions?: SubQuestionDto[];
}

export interface UpdateTopicBasedAudioDto {
  text?: string;
  instructions?: string;
  timeLimit?: number;
  media?: File;
  subQuestions?: TopicBasedAudioSubQuestionDto[];
}

// ==================== TYPE MAPPING ====================

export type CreateQuestionDto =
  // Vocabulary
  | CreateImageToMultipleChoicesDto
  | CreateWordboxDto
  | CreateSpellingDto
  | CreateWordAssociationsDto
  // Grammar
  | CreateUnscrambleDto
  | CreateTensesDto
  | CreateTagItDto
  | CreateReportItDto
  | CreateReadItDto
  // Listening
  | CreateWordMatchDto
  | CreateGossipDto
  | CreateTopicBasedAudioDto
  | CreateLyricsTrainingDto
  // Writing
  | CreateSentenceMakerDto
  | CreateFastTestDto
  | CreateTalesDto
  // Speaking
  | CreateSuperbrainDto
  | CreateTellMeAboutItDto
  | CreateDebateDto;

// ==================== HELPER TYPES ====================

export interface BulkUpdateQuestionsDto {
  updates: Array<{
    id: string;
    data: UpdateQuestionDto;
  }>;
}

// ==================== FILTER DTOs ====================

export interface GetQuestionsFilters {
  challengeId?: string;
  stage?: QuestionStage;
  phase?: string;
  type?: QuestionType;
}
