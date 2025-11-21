/**
 * Question Types and Interfaces
 * Based on backend questions.ts documentation
 */

// ==================== ENUMS ====================

export enum QuestionStage {
  VOCABULARY = 'VOCABULARY',
  GRAMMAR = 'GRAMMAR',
  LISTENING = 'LISTENING',
  WRITING = 'WRITING',
  SPEAKING = 'SPEAKING',
}

export enum ValidationMethod {
  AUTO = 'AUTO',
  IA = 'IA',
}

export enum ValidTenses {
  PRESENT_SIMPLE = 'present_simple',
  PAST_SIMPLE = 'past_simple',
  FUTURE_SIMPLE = 'future_simple',
  PRESENT_CONTINUOUS = 'present_continuous',
  PAST_CONTINUOUS = 'past_continuous',
  FUTURE_CONTINUOUS = 'future_continuous',
  PRESENT_PERFECT = 'present_perfect',
  PAST_PERFECT = 'past_perfect',
  FUTURE_PERFECT = 'future_perfect',
}

// ==================== QUESTION TYPES ====================

export type QuestionType =
  // Vocabulary (4 types)
  | 'image_to_multiple_choices'
  | 'wordbox'
  | 'spelling'
  | 'word_associations'
  // Grammar (5 types)
  | 'unscramble'
  | 'tenses'
  | 'tag_it'
  | 'report_it'
  | 'read_it'
  // Listening (4 types)
  | 'word_match'
  | 'gossip'
  | 'topic_based_audio'
  | 'lyrics_training'
  // Writing (3 types)
  | 'sentence_maker'
  | 'fast_test'
  | 'tales'
  // Speaking (3 types)
  | 'superbrain'
  | 'tell_me_about_it'
  | 'debate';

// ==================== MEDIA ====================

export interface MediaFile {
  id: string;
  type: 'image' | 'audio' | 'video';
  url: string;
  filename: string;
  position: number;
  context: string;
}

// ==================== MAIN QUESTION INTERFACE ====================

export interface Question {
  // Core fields
  id: string;
  challengeId: string;
  stage: QuestionStage;
  position: number;
  type: QuestionType;
  points: number;
  timeLimit: number;
  maxAttempts: number;
  text: string;
  instructions: string;
  validationMethod: ValidationMethod;

  // Optional fields (structure varies by question type)
  content?: unknown;
  options?: unknown;
  answer?: unknown;

  // Hierarchical structure
  parentQuestionId?: string;
  subQuestions?: Question[];

  // Media files
  media?: MediaFile[];

  // Additional configurations
  configurations?: Record<string, string>;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ==================== QUESTION TYPE METADATA ====================

export const QUESTION_TYPES_BY_STAGE: Record<QuestionStage, QuestionType[]> = {
  [QuestionStage.VOCABULARY]: [
    'image_to_multiple_choices',
    'wordbox',
    'spelling',
    'word_associations',
  ],
  [QuestionStage.GRAMMAR]: [
    'unscramble',
    'tenses',
    'tag_it',
    'report_it',
    'read_it',
  ],
  [QuestionStage.LISTENING]: [
    'word_match',
    'gossip',
    'topic_based_audio',
    'lyrics_training',
  ],
  [QuestionStage.WRITING]: ['sentence_maker', 'fast_test', 'tales'],
  [QuestionStage.SPEAKING]: ['superbrain', 'tell_me_about_it', 'debate'],
};

export const QUESTION_TYPES_WITH_SUBQUESTIONS: QuestionType[] = [
  'read_it',
  'topic_based_audio',
];

export const QUESTION_TYPES_WITH_MEDIA: QuestionType[] = [
  'image_to_multiple_choices',
  'spelling',
  'word_match',
  'gossip',
  'topic_based_audio',
  'lyrics_training',
  'sentence_maker',
  'tales',
];

export const QUESTION_TYPES_WITH_AUTO_VALIDATION: QuestionType[] = [
  'image_to_multiple_choices',
  'unscramble',
  'tenses',
  'tag_it',
  'read_it',
  'word_match',
  'topic_based_audio',
  'lyrics_training',
  'fast_test',
];

export const QUESTION_TYPES_WITH_IA_VALIDATION: QuestionType[] = [
  'wordbox',
  'spelling',
  'word_associations',
  'report_it',
  'gossip',
  'sentence_maker',
  'tales',
  'superbrain',
  'tell_me_about_it',
  'debate',
];

// ==================== QUESTION TYPE LABELS ====================

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  // Vocabulary
  image_to_multiple_choices: 'Image to Multiple Choices',
  wordbox: 'Word Box',
  spelling: 'Spelling',
  word_associations: 'Word Associations',
  // Grammar
  unscramble: 'Unscramble',
  tenses: 'Tenses',
  tag_it: 'Tag It',
  report_it: 'Report It',
  read_it: 'Read It',
  // Listening
  word_match: 'Word Match',
  gossip: 'Gossip',
  topic_based_audio: 'Topic Based Audio',
  lyrics_training: 'Lyrics Training',
  // Writing
  sentence_maker: 'Sentence Maker',
  fast_test: 'Fast Test',
  tales: 'Tales',
  // Speaking
  superbrain: 'Superbrain',
  tell_me_about_it: 'Tell Me About It',
  debate: 'Debate',
};

// ==================== ENDPOINT MAPPING ====================

export const QUESTION_TYPE_ENDPOINTS: Record<QuestionType, string> = {
  // Vocabulary
  image_to_multiple_choices: '/questions/create/image_to_multiple_choices',
  wordbox: '/questions/create/wordbox',
  spelling: '/questions/create/spelling',
  word_associations: '/questions/create/word_associations',
  // Grammar
  unscramble: '/questions/create/unscramble',
  tenses: '/questions/create/tenses',
  tag_it: '/questions/create/tag_it',
  report_it: '/questions/create/report_it',
  read_it: '/questions/create/read_it',
  // Listening
  word_match: '/questions/create/word_match',
  gossip: '/questions/create/gossip',
  topic_based_audio: '/questions/create/topic_based_audio',
  lyrics_training: '/questions/create/lyrics_training',
  // Writing
  sentence_maker: '/questions/create/sentence_maker',
  fast_test: '/questions/create/fast_test',
  tales: '/questions/create/tales',
  // Speaking
  superbrain: '/questions/create/superbrain',
  tell_me_about_it: '/questions/create/tell_me_about_it',
  debate: '/questions/create/debate',
};
