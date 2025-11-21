/**
 * ========================================
 * QUESTIONS REFERENCE DOCUMENTATION
 * ========================================
 *
 * This file serves as technical reference for the Questions module.
 * It documents all question types, their structures, validation methods,
 * and relationships with media files.
 *
 * Last updated: 2025-01-16
 *
 * ========================================
 * TABLE OF CONTENTS
 * ========================================
 * 1. Type Definitions
 * 2. Question Stages
 * 3. Validation Methods
 * 4. Media Integration
 * 5. Question Types by Stage
 *    - Vocabulary (4 types)
 *    - Grammar (5 types)
 *    - Listening (4 types)
 *    - Writing (3 types)
 *    - Speaking (3 types)
 * 6. Sub-questions & Hierarchical Structure
 * 7. Points Calculation
 * ========================================
 */

// ==================== 1. TYPE DEFINITIONS ====================

export type QuestionStage =
  | 'VOCABULARY'
  | 'GRAMMAR'
  | 'LISTENING'
  | 'WRITING'
  | 'SPEAKING';

export type ValidationMethod = 'AUTO' | 'IA';

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

// ==================== 2. QUESTION STAGES ====================

/**
 * Stages are the main categories of questions based on learning objectives.
 * There are 5 stages:
 * - VOCABULARY: Word recognition, spelling, associations
 * - GRAMMAR: Sentence structure, tenses, reported speech
 * - LISTENING: Audio comprehension, transcription
 * - WRITING: Sentence creation, stories
 * - SPEAKING: Oral production, debates
 *
 * Questions within stages are organized by their type field,
 * allowing for flexible filtering and grouping.
 */

// ==================== 3. VALIDATION METHODS ====================

/**
 * AUTO (Automatic Validation):
 * - Direct comparison with stored answer
 * - Used for multiple choice, true/false, exact text matching
 * - No AI processing required
 * - Instant validation
 *
 * Question types with AUTO validation:
 * - image_to_multiple_choices
 * - unscramble
 * - tenses
 * - tag_it
 * - read_it (sub-questions)
 * - word_match
 * - topic_based_audio (sub-questions)
 * - lyrics_training
 * - fast_test
 */

/**
 * IA (AI-based Validation):
 * - Uses AI services for semantic analysis
 * - Evaluates grammar, coherence, creativity, pronunciation
 * - Provides detailed feedback in English and Spanish
 * - Scoring on a scale (0-1) converted to points
 *
 * Question types with IA validation:
 * - wordbox (validates formed words are valid English)
 * - spelling (validates audio letter-by-letter spelling)
 * - word_associations (semantic relationship analysis)
 * - report_it (grammar and reported speech correctness)
 * - gossip (speech-to-text + pronunciation analysis)
 * - sentence_maker (grammar, vocabulary, coherence)
 * - tales (coherence, creativity, grammar, image usage)
 * - superbrain (pronunciation, grammar, relevance, coherence)
 * - tell_me_about_it (storytelling, pronunciation, grammar, creativity)
 * - debate (argument clarity, evidence, pronunciation, persuasiveness)
 */

// ==================== 4. MEDIA INTEGRATION ====================

/**
 * Media files are managed through the QuestionMedia pivot table:
 *
 * QuestionMedia {
 *   id: string
 *   questionId: string
 *   mediaFileId: string
 *   position: number (order of media files)
 *   context: string (e.g., "main", "option_1", "reference")
 *   createdAt: DateTime
 * }
 *
 * MediaFile {
 *   id: string
 *   type: string (image | audio | video)
 *   filename: string
 *   pathName: string
 *   url: string (public URL)
 *   size: number
 *   mimeType: string
 *   metadata: Json
 * }
 *
 * Supported formats:
 * - Images: jpeg, png, webp, gif
 * - Audio: mp3, wav, ogg, flac, m4a
 * - Video: mp4, webm
 *
 * Upload via form-data in creation endpoints
 */

// ==================== 5. QUESTION TYPES BY STAGE ====================

// --- VOCABULARY STAGE (4 types) ---

export const IMAGE_TO_MULTIPLE_CHOICES = {
  type: 'image_to_multiple_choices',
  stage: 'VOCABULARY',
  validationMethod: 'AUTO',
  description: 'Match an image to the correct word from multiple options',
  mediaRequired: true,
  mediaType: 'image',
  mediaCount: 1,
  hasOptions: true,
  hasFixedAnswer: true,
  example: {
    challengeId: 'uuid-challenge-1',
    stage: 'VOCABULARY',
    position: 1,
    type: 'image_to_multiple_choices',
    points: 10,
    timeLimit: 45,
    maxAttempts: 2,
    text: 'What is the name of this animal?',
    instructions: 'Select the correct option that matches the image.',
    validationMethod: 'AUTO',
    media: 'Upload via form-data (jpeg/png/webp, max 5MB)',
    options: ['cat', 'dog', 'bird', 'fish'],
    answer: 'cat',
  },
  responseFormat: {
    // API response returns single image, not array
    image: {
      id: 'uuid',
      url: '/uploads/image/filename.png',
      type: 'image',
      filename: 'original.png',
      mimeType: 'image/png',
      size: 12345,
      position: 0,
      context: 'main',
    },
    options: ['cat', 'dog', 'bird', 'fish'],
    answer: 'cat',
    // Note: configurations field is omitted when empty
  },
};

export const WORDBOX = {
  type: 'wordbox',
  stage: 'VOCABULARY',
  validationMethod: 'IA',
  description: 'Build words using a grid of letters (NxN matrix)',
  mediaRequired: false,
  hasContent: true,
  contentStructure: '2D array of letters',
  hasFixedAnswer: false,
  aiValidation: 'Validates formed words are valid English words',
  example: {
    challengeId: 'uuid-challenge-1',
    stage: 'VOCABULARY',
    position: 2,
    type: 'wordbox',
    points: 15,
    timeLimit: 90,
    maxAttempts: 3,
    text: 'Form as many valid English words as you can from the letter grid.',
    instructions: 'Connect adjacent letters to form words (minimum 3 letters).',
    validationMethod: 'IA',
    content: [
      ['C', 'A', 'T'],
      ['R', 'O', 'D'],
      ['E', 'A', 'T'],
    ],
    configurations: {
      gridWidth: '3',
      gridHeight: '3',
      minWordLength: '3',
    },
  },
};

export const SPELLING = {
  type: 'spelling',
  stage: 'VOCABULARY',
  validationMethod: 'IA',
  description: 'Spell a word letter-by-letter via audio recording',
  mediaRequired: true,
  mediaType: 'image',
  mediaCount: 1,
  answerType: 'audio upload from student',
  hasFixedAnswer: true,
  aiValidation: 'Validates audio spelling matches expected word',
  example: {
    challengeId: 'uuid-challenge-1',
    stage: 'VOCABULARY',
    position: 3,
    type: 'spelling',
    points: 10,
    timeLimit: 60,
    maxAttempts: 2,
    text: 'Spell the word shown in the image.',
    instructions: 'Say each letter clearly, one by one (e.g., C-A-T).',
    validationMethod: 'IA',
    media: 'Upload image via form-data',
    answer: 'cat', // Stored as text for validation
  },
};

export const WORD_ASSOCIATIONS = {
  type: 'word_associations',
  stage: 'VOCABULARY',
  validationMethod: 'IA',
  description: 'Provide words related to a central concept',
  mediaRequired: false,
  hasContent: true,
  contentStructure: 'string (central word)',
  answerType: 'array of strings',
  aiValidation: 'Evaluates semantic relationships and validity',
  example: {
    challengeId: 'uuid-challenge-1',
    stage: 'VOCABULARY',
    position: 4,
    type: 'word_associations',
    points: 15,
    timeLimit: 120,
    maxAttempts: 1,
    text: 'Write words that are related to the given concept.',
    instructions:
      'Provide at least 5 words semantically related to the central word.',
    validationMethod: 'IA',
    content: 'beach',
    configurations: {
      totalAssociations: '5',
      minAssociations: '3',
    },
  },
};

// --- GRAMMAR STAGE (5 types) ---

export const UNSCRAMBLE = {
  type: 'unscramble',
  stage: 'GRAMMAR',
  validationMethod: 'AUTO',
  description: 'Reorder scrambled words to form a correct sentence',
  mediaRequired: false,
  hasContent: true,
  contentStructure: 'array of scrambled words',
  hasFixedAnswer: true,
  example: {
    challengeId: 'uuid-challenge-1',
    stage: 'GRAMMAR',
    position: 1,
    type: 'unscramble',
    points: 10,
    timeLimit: 60,
    maxAttempts: 2,
    text: 'Arrange the words to make a correct sentence.',
    instructions: 'Drag and drop the words in the correct order.',
    validationMethod: 'AUTO',
    content: ['school', 'to', 'goes', 'She', 'every', 'day'],
    answer: 'She goes to school every day',
  },
};

export const TENSES = {
  type: 'tenses',
  stage: 'GRAMMAR',
  validationMethod: 'AUTO',
  description: 'Identify or select the correct verb tense',
  mediaRequired: false,
  hasOptions: true,
  hasFixedAnswer: true,
  example: {
    challengeId: 'uuid-challenge-1',
    stage: 'GRAMMAR',
    position: 2,
    type: 'tenses',
    points: 10,
    timeLimit: 45,
    maxAttempts: 2,
    text: 'Which tense is used in this sentence? "She has been studying for hours."',
    instructions: 'Select the correct verb tense.',
    validationMethod: 'AUTO',
    options: [
      ValidTenses.PRESENT_SIMPLE,
      ValidTenses.PRESENT_CONTINUOUS,
      ValidTenses.PRESENT_PERFECT,
    ],
    answer: ValidTenses.PRESENT_PERFECT,
  },
};

export const TAG_IT = {
  type: 'tag_it',
  stage: 'GRAMMAR',
  validationMethod: 'AUTO',
  description: 'Complete a sentence with the correct question tag',
  mediaRequired: false,
  hasOptions: true,
  hasMultipleCorrectAnswers: true,
  example: {
    challengeId: 'uuid-challenge-1',
    stage: 'GRAMMAR',
    position: 3,
    type: 'tag_it',
    points: 10,
    timeLimit: 45,
    maxAttempts: 2,
    text: 'She is coming to the party, _____?',
    instructions: 'Select all correct question tags.',
    validationMethod: 'AUTO',
    options: ["isn't she", "doesn't she", "won't she", "hasn't she"],
    answer: ["isn't she"], // Array of correct answers
  },
};

export const REPORT_IT = {
  type: 'report_it',
  stage: 'GRAMMAR',
  validationMethod: 'IA',
  description: 'Convert direct speech to reported speech',
  mediaRequired: false,
  hasContent: true,
  contentStructure: 'string (direct speech)',
  answerType: 'string (reported speech)',
  aiValidation: 'Evaluates grammar correctness and proper transformation',
  example: {
    challengeId: 'uuid-challenge-1',
    stage: 'GRAMMAR',
    position: 4,
    type: 'report_it',
    points: 15,
    timeLimit: 90,
    maxAttempts: 2,
    text: 'Convert the following to reported speech.',
    instructions: 'Rewrite the sentence in reported speech format.',
    validationMethod: 'IA',
    content: 'She said: "I am going to the store."',
    answer: 'She said that she was going to the store.', // Reference answer
  },
};

export const READ_IT = {
  type: 'read_it',
  stage: 'GRAMMAR',
  validationMethod: 'AUTO',
  description: 'Reading comprehension with true/false sub-questions',
  mediaRequired: false,
  hasContent: true,
  contentStructure: 'array of passages (text and/or images)',
  hasSubQuestions: true,
  subQuestionType: 'true_false',
  pointsCalculation: 'Auto-calculated as sum of sub-question points',
  example: {
    challengeId: 'uuid-challenge-1',
    stage: 'GRAMMAR',
    position: 5,
    type: 'read_it',
    points: 'AUTO-CALCULATED', // Sum of sub-question points
    timeLimit: 180,
    maxAttempts: 1,
    text: 'Read the passage and answer the questions.',
    instructions:
      'Read carefully and decide if each statement is true or false.',
    validationMethod: 'AUTO',
    content: [
      {
        text: 'Emma travels to school by bus every weekday. On weekends, she enjoys hiking with her friends in the hills.',
      },
    ],
    subQuestions: [
      {
        content: 'Emma travels to school by bus every day.',
        options: [true, false],
        answer: false, // Weekdays only, not every day
        points: 5,
      },
      {
        content: 'She hikes alone on weekends.',
        options: [true, false],
        answer: false, // With friends
        points: 5,
      },
    ],
    // Total points: 10 (5 + 5)
  },
};

// --- LISTENING STAGE (4 types) ---

export const WORD_MATCH = {
  type: 'word_match',
  stage: 'LISTENING',
  validationMethod: 'AUTO',
  description: 'Match audio to the correct word from options',
  mediaRequired: true,
  mediaType: 'audio',
  mediaCount: 'multiple',
  hasOptions: true,
  hasFixedAnswer: true,
  example: {
    challengeId: 'uuid-challenge-1',
    stage: 'LISTENING',
    position: 1,
    type: 'word_match',
    points: 10,
    timeLimit: 60,
    maxAttempts: 2,
    text: 'Listen to the audio and select the correct word.',
    instructions: 'Click play and choose the word you hear.',
    validationMethod: 'AUTO',
    media: 'Upload multiple audio files via form-data',
    options: ['cat', 'cut', 'cot', 'cart'],
    answer: 'cat',
  },
};

export const GOSSIP = {
  type: 'gossip',
  stage: 'LISTENING',
  validationMethod: 'IA',
  description: 'Transcribe audio into English text',
  mediaRequired: true,
  mediaType: 'audio',
  mediaCount: 1,
  answerType: 'audio upload from student',
  aiValidation: 'Speech-to-text + pronunciation and accuracy analysis',
  example: {
    challengeId: 'uuid-challenge-1',
    stage: 'LISTENING',
    position: 2,
    type: 'gossip',
    points: 15,
    timeLimit: 120,
    maxAttempts: 2,
    text: 'Listen to the audio and repeat what you hear.',
    instructions:
      'Listen carefully and record yourself saying the same sentence.',
    validationMethod: 'IA',
    media: 'Upload reference audio via form-data',
    answer: 'The quick brown fox jumps over the lazy dog.', // Expected transcription
  },
};

export const TOPIC_BASED_AUDIO = {
  type: 'topic_based_audio',
  stage: 'LISTENING',
  validationMethod: 'AUTO',
  description: 'Listen to audio and answer multiple-choice sub-questions',
  mediaRequired: true,
  mediaType: 'audio',
  mediaCount: 1,
  hasSubQuestions: true,
  subQuestionType: 'multiple_choice',
  pointsCalculation: 'Auto-calculated as sum of sub-question points',
  example: {
    challengeId: 'uuid-challenge-1',
    stage: 'LISTENING',
    position: 3,
    type: 'topic_based_audio',
    points: 'AUTO-CALCULATED', // Sum of sub-question points
    timeLimit: 180,
    maxAttempts: 1,
    text: 'Listen to the audio story and answer the questions.',
    instructions: 'Listen carefully to the audio before answering.',
    validationMethod: 'AUTO',
    media: 'Upload audio file via form-data',
    subQuestions: [
      {
        text: 'What is the main character doing?',
        options: [
          { id: 'a', text: 'Studying' },
          { id: 'b', text: 'Cooking' },
          { id: 'c', text: 'Traveling' },
        ],
        answer: 'c',
        points: 5,
      },
      {
        text: 'Where is the story taking place?',
        options: [
          { id: 'a', text: 'At home' },
          { id: 'b', text: 'At school' },
          { id: 'c', text: 'In a foreign country' },
        ],
        answer: 'c',
        points: 5,
      },
    ],
    // Total points: 10 (5 + 5)
  },
};

export const LYRICS_TRAINING = {
  type: 'lyrics_training',
  stage: 'LISTENING',
  validationMethod: 'AUTO',
  description: 'Complete song lyrics after listening to a clip',
  mediaRequired: true,
  mediaType: 'audio or video',
  mediaCount: 1,
  hasFixedAnswer: true,
  example: {
    challengeId: 'uuid-challenge-1',
    stage: 'LISTENING',
    position: 4,
    type: 'lyrics_training',
    points: 10,
    timeLimit: 90,
    maxAttempts: 2,
    text: 'Complete the missing lyrics.',
    instructions: 'Listen to the song and fill in the blank.',
    validationMethod: 'AUTO',
    media: 'Upload audio/video via form-data',
    content: 'I want to _____ your hand.',
    answer: 'hold',
  },
};

// --- WRITING STAGE (3 types) ---

export const SENTENCE_MAKER = {
  type: 'sentence_maker',
  stage: 'WRITING',
  validationMethod: 'IA',
  description: 'Create a sentence based on provided images',
  mediaRequired: true,
  mediaType: 'images',
  mediaCount: 'multiple',
  answerType: 'string',
  aiValidation: 'Grammar, vocabulary, and coherence with images',
  example: {
    challengeId: 'uuid-challenge-1',
    stage: 'WRITING',
    position: 1,
    type: 'sentence_maker',
    points: 15,
    timeLimit: 120,
    maxAttempts: 2,
    text: 'Write a sentence describing the images.',
    instructions:
      'Create a grammatically correct sentence using the images as inspiration.',
    validationMethod: 'IA',
    media: 'Upload multiple images via form-data',
  },
};

export const FAST_TEST = {
  type: 'fast_test',
  stage: 'WRITING',
  validationMethod: 'AUTO',
  description: 'Complete a sentence by selecting the correct option',
  mediaRequired: false,
  hasContent: true,
  contentStructure: 'array of sentence parts',
  hasOptions: true,
  hasFixedAnswer: true,
  note: 'Create multiple independent questions (no sub-questions)',
  example: {
    challengeId: 'uuid-challenge-1',
    stage: 'WRITING',
    position: 1,
    type: 'fast_test',
    points: 5,
    timeLimit: 30,
    maxAttempts: 1,
    text: 'Complete the sentence.',
    instructions: 'Select the correct option to complete the sentence.',
    validationMethod: 'AUTO',
    content: ['I enjoy', 'to the beach'],
    options: ['going', 'go', 'gone', 'going to'],
    answer: 'going',
  },
};

export const TALES = {
  type: 'tales',
  stage: 'WRITING',
  validationMethod: 'IA',
  description: 'Write a creative story based on provided images',
  mediaRequired: true,
  mediaType: 'images',
  mediaCount: 'multiple (1-5)',
  answerType: 'string (story text)',
  aiValidation:
    'Coherence (30%), creativity (30%), grammar (25%), image usage (15%)',
  example: {
    challengeId: 'uuid-challenge-1',
    stage: 'WRITING',
    position: 2,
    type: 'tales',
    points: 20,
    timeLimit: 300,
    maxAttempts: 1,
    text: 'Write a short story using the provided images.',
    instructions:
      'Create a creative and coherent story inspired by the images (minimum 50 words).',
    validationMethod: 'IA',
    media: 'Upload 1-5 images via form-data',
    configurations: {
      minWords: '50',
      maxWords: '200',
    },
  },
};

// --- SPEAKING STAGE (3 types) ---

export const SUPERBRAIN = {
  type: 'superbrain',
  stage: 'SPEAKING',
  validationMethod: 'IA',
  description: 'Respond to a prompt with an audio recording',
  mediaRequired: false,
  answerType: 'audio upload from student',
  aiValidation:
    'Pronunciation (30%), grammar (30%), relevance (25%), coherence (15%)',
  example: {
    challengeId: 'uuid-challenge-1',
    stage: 'SPEAKING',
    position: 1,
    type: 'superbrain',
    points: 20,
    timeLimit: 180,
    maxAttempts: 2,
    text: 'Describe your daily routine.',
    instructions:
      'Record an audio describing what you do every day (minimum 30 seconds).',
    validationMethod: 'IA',
  },
};

export const TELL_ME_ABOUT_IT = {
  type: 'tell_me_about_it',
  stage: 'SPEAKING',
  validationMethod: 'IA',
  description: 'Create an audio story based on a prompt or image',
  mediaRequired: false,
  answerType: 'audio upload from student',
  aiValidation:
    'Storytelling (25%), pronunciation (25%), grammar (25%), creativity (25%)',
  example: {
    challengeId: 'uuid-challenge-1',
    stage: 'SPEAKING',
    position: 2,
    type: 'tell_me_about_it',
    points: 25,
    timeLimit: 240,
    maxAttempts: 1,
    text: 'Tell a story about an unforgettable trip.',
    instructions:
      'Record yourself telling a creative story (minimum 1 minute).',
    validationMethod: 'IA',
  },
};

export const DEBATE = {
  type: 'debate',
  stage: 'SPEAKING',
  validationMethod: 'IA',
  description: 'Defend or oppose a statement with an audio argument',
  mediaRequired: false,
  hasContent: true,
  contentStructure: 'topic statement',
  answerType: 'audio upload from student',
  aiValidation:
    'Argument clarity (30%), evidence (25%), pronunciation (25%), persuasiveness (20%)',
  example: {
    challengeId: 'uuid-challenge-1',
    stage: 'SPEAKING',
    position: 3,
    type: 'debate',
    points: 30,
    timeLimit: 300,
    maxAttempts: 1,
    text: 'Should students wear uniforms to school?',
    instructions:
      'Choose a position (for or against) and record your argument (minimum 1 minute).',
    validationMethod: 'IA',
    content: 'Should students wear uniforms to school?',
    configurations: {
      stanceOptions: 'for,against',
    },
  },
};

// ==================== 6. SUB-QUESTIONS & HIERARCHICAL STRUCTURE ====================

/**
 * Some question types support sub-questions (hierarchical structure):
 *
 * - read_it: Parent question with passage, multiple true/false sub-questions
 * - topic_based_audio: Parent question with audio, multiple multiple-choice sub-questions
 *
 * Database Structure:
 * - Parent question has parentQuestionId = null
 * - Sub-questions have parentQuestionId = parent.id
 * - Relationship: Question.subQuestions[] ← Question.parentQuestion
 *
 * Sub-questions inherit:
 * - challengeId
 * - stage
 *
 * Sub-questions have their own:
 * - position (within parent)
 * - points
 * - text
 * - options
 * - answer
 */

// ==================== 7. POINTS CALCULATION ====================

/**
 * For questions WITH sub-questions:
 * - Parent points = SUM of all sub-question points
 * - Calculated automatically on creation
 * - Recalculated automatically when sub-question is updated
 * - Recalculated automatically when sub-question is deleted
 *
 * For questions WITHOUT sub-questions:
 * - Points are set explicitly in the DTO
 * - No automatic calculation
 *
 * Point distribution on answer:
 * - AUTO validation: Full points if correct, 0 if incorrect
 * - IA validation: Proportional points based on AI score (0-1 scale)
 *   Example: score = 0.85, points = 10 → pointsEarned = 8.5 (rounded to 9)
 */

// ==================== FULL QUESTION INTERFACE ====================

export interface QuestionTemplate {
  // Core fields
  challengeId: string;
  stage: QuestionStage;
  position: number; // Order within stage and type
  type: string; // One of the 19 question types
  points: number; // Auto-calculated for parent questions with sub-questions
  timeLimit: number; // Seconds
  maxAttempts: number;
  text: string;
  instructions: string;
  validationMethod: ValidationMethod; // AUTO or IA

  // Optional fields
  content?: unknown; // Flexible field (string, array, object) - structure varies by type
  options?: unknown[]; // For multiple choice questions
  answer?: string | string[] | boolean; // Expected response(s)
  parentQuestionId?: string; // For sub-questions
  subQuestions?: Partial<QuestionTemplate>[]; // For parent questions

  // Media (uploaded via form-data, linked via QuestionMedia pivot)
  // Media files are not included directly in the template
  // They are uploaded separately and linked via QuestionMedia table

  // Configurations (stored in QuestionConfiguration table)
  configurations?: Record<string, string>; // Additional metadata (key-value pairs)
}

// ==================== ENDPOINT STRUCTURE ====================

/**
 * The Questions module has 4 controllers:
 *
 * 1. QuestionsCreationController (/questions/create)
 *    - 19 POST endpoints (one per question type)
 *    - Examples:
 *      POST /questions/create/image_to_multiple_choices
 *      POST /questions/create/wordbox
 *      POST /questions/create/spelling
 *      ... (all 19 types)
 *
 * 2. QuestionsQueryController (/questions)
 *    - GET /questions (list with filters: challengeId, stage, type)
 *    - GET /questions/:id (single question with full details)
 *    - GET /questions/schools/:schoolId/stats (aggregated statistics)
 *
 * 3. QuestionsAnswerController (/questions)
 *    - POST /questions/answer/:id (text/JSON answer)
 *    - POST /questions/answer/:id/audio (audio answer for speaking questions)
 *    - Both endpoints require @Auth(ValidRole.STUDENT)
 *    - Auto-validates and saves to StudentAnswer table
 *
 * 4. QuestionsUpdateController (/questions)
 *    - PATCH /questions/:id (general update)
 *    - PATCH /questions/:id/text (update text only)
 *    - PATCH /questions/:id/instructions (update instructions only)
 *    - PATCH /questions/:id/time-limit (update time limit)
 *    - PATCH /questions/:id/points (update points, recalculates parent if needed)
 *    - PATCH /questions/bulk (bulk update multiple questions)
 *    - DELETE /questions/:id (delete question, cascades to sub-questions)
 *    - All endpoints require @Auth(ValidRole.ADMIN, TEACHER, COORDINATOR)
 */

// ==================== VALIDATION SERVICE ====================

/**
 * QuestionValidationService handles all answer validation:
 *
 * Main method:
 * - validateAnswer(questionId, userAnswer, audioFile?)
 * - Returns: { isCorrect, pointsEarned, feedbackEnglish?, feedbackSpanish?, details? }
 *
 * Integrations:
 * - AiFilesService: For audio processing, image analysis
 * - AiService: For text-based AI validation
 *
 * Special methods:
 * - validateSpellingFromAudio(): Reuses existing ai-files method
 * - processSingleFile(): For custom audio analysis
 * - processAudio(): For speech-to-text transcription
 */

// ==================== DATABASE SCHEMA SUMMARY ====================

/**
 * Main tables:
 *
 * Question (core table)
 * - id, challengeId, stage, position, type
 * - points, timeLimit, maxAttempts
 * - text, instructions, validationMethod
 * - content (JSON), options (JSON), answer (JSON)
 * - parentQuestionId (self-referential)
 *
 * QuestionMedia (pivot table)
 * - Connects Question ↔ MediaFile
 * - position, context fields for ordering and categorization
 *
 * QuestionConfiguration (metadata table)
 * - Stores key-value configurations per question
 *
 * StudentAnswer (responses table)
 * - Student responses with validation results
 * - isCorrect, pointsEarned, attemptNumber, timeSpent
 * - feedbackEnglish, feedbackSpanish (from AI)
 * - audioUrl (for speaking questions)
 *
 * QuestionSchoolStats (aggregations)
 * - Pre-calculated statistics per school/question
 */

// ==================== SUMMARY ====================

export const QUESTION_TYPE_SUMMARY = {
  total: 19,
  byStage: {
    VOCABULARY: 4, // image_to_multiple_choices, wordbox, spelling, word_associations
    GRAMMAR: 5, // unscramble, tenses, tag_it, report_it, read_it
    LISTENING: 4, // word_match, gossip, topic_based_audio, lyrics_training
    WRITING: 3, // sentence_maker, fast_test, tales
    SPEAKING: 3, // superbrain, tell_me_about_it, debate
  },
  byValidation: {
    AUTO: 9, // image_to_multiple_choices, unscramble, tenses, tag_it, read_it, word_match, topic_based_audio, lyrics_training, fast_test
    IA: 10, // wordbox, spelling, word_associations, report_it, gossip, sentence_maker, tales, superbrain, tell_me_about_it, debate
  },
  withMedia: {
    required: 9, // All that need image/audio upload
    optional: 0,
    none: 10,
  },
  withSubQuestions: 2, // read_it, topic_based_audio
};
