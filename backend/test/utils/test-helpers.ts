import * as path from 'path';
import * as fs from 'fs';

/**
 * Helper functions for testing Questions module
 */

// File loading utilities
export function getFixturePath(filename: string): string {
  return path.join(__dirname, '..', 'fixtures', filename);
}

export function fixtureExists(filename: string): boolean {
  return fs.existsSync(getFixturePath(filename));
}

export function loadFixture(filename: string): Buffer | string {
  const fixturePath = getFixturePath(filename);
  if (fs.existsSync(fixturePath)) {
    return fixturePath;
  }
  // Return minimal valid buffer if fixture doesn't exist
  return createMinimalFile(filename);
}

function createMinimalFile(filename: string): Buffer {
  if (
    filename.includes('image') ||
    filename.endsWith('.png') ||
    filename.endsWith('.jpg')
  ) {
    // Minimal 1x1 PNG
    return Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64',
    );
  }
  if (filename.includes('audio') || filename.endsWith('.mp3')) {
    // Minimal MP3 header
    return Buffer.from('ID3\x04\x00\x00\x00\x00\x00\x00', 'binary');
  }
  if (filename.includes('video') || filename.endsWith('.mp4')) {
    // Minimal MP4 header
    return Buffer.from('\x00\x00\x00\x20\x66\x74\x79\x70', 'binary');
  }
  return Buffer.from('test file');
}

// DTO Factory Functions
export const QuestionDtoFactory = {
  imageToMultipleChoices: (overrides: any = {}) => ({
    challengeId: 'test-challenge-id',
    stage: 'VOCABULARY',
    phase: 'phase_1_1',
    position: 1,
    type: 'image_to_multiple_choices',
    points: 10,
    timeLimit: 60,
    maxAttempts: 2,
    text: 'Match the image to the correct English word.',
    instructions: 'Select the correct option that represents the image.',
    options: 'Apple,Orange,Grapes,Banana',
    answer: 'Apple',
    ...overrides,
  }),

  wordbox: (overrides: any = {}) => ({
    challengeId: 'test-challenge-id',
    stage: 'VOCABULARY',
    phase: 'phase_1_2',
    position: 2,
    type: 'wordbox',
    points: 12,
    timeLimit: 90,
    maxAttempts: 3,
    text: 'Build the target word using the letter box.',
    instructions:
      'Use the letters from the box to form the correct English word.',
    content: JSON.stringify([
      ['A', 'B', 'C'],
      ['S', 'T', 'O'],
      ['A', 'C', 'D'],
    ]),
    configuration: JSON.stringify({ gridWidth: 3, gridHeight: 3 }),
    ...overrides,
  }),

  spelling: (overrides: any = {}) => ({
    challengeId: 'test-challenge-id',
    stage: 'VOCABULARY',
    phase: 'phase_1_3',
    position: 3,
    type: 'spelling',
    points: 15,
    timeLimit: 120,
    maxAttempts: 3,
    text: 'Spell the name of the object shown using your voice.',
    instructions: 'Dictate each letter clearly to spell the word in English.',
    answer: 'Butterfly',
    ...overrides,
  }),

  wordAssociations: (overrides: any = {}) => ({
    challengeId: 'test-challenge-id',
    stage: 'VOCABULARY',
    phase: 'phase_1_4',
    position: 4,
    type: 'word_associations',
    points: 20,
    timeLimit: 150,
    maxAttempts: 4,
    text: 'Connect the target word with the related concepts.',
    instructions:
      'Select the options that are associated with the reference word.',
    content: 'Journey',
    configuration: JSON.stringify({ totalAssociations: 20 }),
    ...overrides,
  }),

  unscramble: (overrides: any = {}) => ({
    challengeId: 'test-challenge-id',
    stage: 'GRAMMAR',
    phase: 'phase_2_1',
    position: 1,
    type: 'unscramble',
    points: 10,
    timeLimit: 60,
    maxAttempts: 3,
    text: 'Unscramble the sentence.',
    instructions: 'Reorder the words to form a correct English sentence.',
    content: ['book', 'read', 'I', 'every', 'night'],
    answer: ['I', 'read', 'every', 'night', 'book'],
    ...overrides,
  }),

  tenses: (overrides: any = {}) => ({
    challengeId: 'test-challenge-id',
    stage: 'GRAMMAR',
    phase: 'phase_2_2',
    position: 2,
    type: 'tenses',
    points: 12,
    timeLimit: 45,
    maxAttempts: 2,
    text: 'Choose the correct verb tense.',
    instructions:
      'Select the option that completes the sentence with the correct tense.',
    content: 'She does her homework before dinner every day.',
    options: [
      'present_simple',
      'future_continuous',
      'past_continuous',
      'past_perfect',
      'present_continuous',
    ],
    answer: 'present_simple',
    ...overrides,
  }),

  tagIt: (overrides: any = {}) => ({
    challengeId: 'test-challenge-id',
    stage: 'GRAMMAR',
    phase: 'phase_2_3',
    position: 3,
    type: 'tag_it',
    points: 8,
    timeLimit: 45,
    maxAttempts: 2,
    text: 'Complete the sentence with the missing word.',
    instructions: 'Type the correct word to complete the sentence.',
    content: ['He is responsible for the project,', '?'],
    answer: ["isn't he?", 'is not he?'],
    ...overrides,
  }),

  reportIt: (overrides: any = {}) => ({
    challengeId: 'test-challenge-id',
    stage: 'GRAMMAR',
    phase: 'phase_2_4',
    position: 4,
    type: 'report_it',
    points: 15,
    timeLimit: 120,
    maxAttempts: 3,
    text: 'Rewrite the sentence in reported speech.',
    instructions: 'Transform the sentence into reported speech.',
    content: '"I will call you tomorrow," she said.',
    ...overrides,
  }),

  readIt: (overrides: any = {}) => ({
    challengeId: 'test-challenge-id',
    stage: 'GRAMMAR',
    phase: 'phase_2_5',
    position: 5,
    type: 'read_it',
    points: 12,
    timeLimit: 90,
    maxAttempts: 2,
    text: 'Read the passage and answer the questions.',
    instructions: 'Read the text and select true or false for each statement.',
    content: JSON.stringify([
      {
        text: 'Emma travels to school by bus every weekday. On weekends, she enjoys hiking with her friends in the hills.',
      },
    ]),
    subQuestions: JSON.stringify([
      {
        content: 'Emma travels to school by bus every day.',
        options: [true, false],
        answer: false,
      },
      {
        content: 'She hikes alone on weekends.',
        options: [true, false],
        answer: false,
      },
    ]),
    ...overrides,
  }),

  wordMatch: (overrides: any = {}) => ({
    challengeId: 'test-challenge-id',
    stage: 'LISTENING',
    phase: 'phase_3_1',
    position: 1,
    type: 'word_match',
    points: 10,
    timeLimit: 60,
    maxAttempts: 2,
    text: 'Listen to the audio and match it to the correct word.',
    instructions:
      'Play the audio and select the word that best matches what you hear.',
    options: 'Ocean,Mountain,Forest,Desert',
    answer: 'Ocean',
    ...overrides,
  }),

  gossip: (overrides: any = {}) => ({
    challengeId: 'test-challenge-id',
    stage: 'LISTENING',
    phase: 'phase_3_2',
    position: 2,
    type: 'gossip',
    points: 14,
    timeLimit: 150,
    maxAttempts: 3,
    text: 'Transcribe the audio into English.',
    instructions: 'Listen carefully and write the English transcription.',
    answer: 'The meeting has been moved to Monday morning.',
    ...overrides,
  }),

  topicBasedAudio: (overrides: any = {}) => ({
    challengeId: 'test-challenge-id',
    stage: 'LISTENING',
    phase: 'phase_3_3',
    position: 3,
    type: 'topic_based_audio',
    points: 16,
    timeLimit: 180,
    maxAttempts: 3,
    text: 'Listen to the audio and answer the related questions.',
    instructions:
      'Select the correct answers for the questions related to the audio.',
    subQuestions: JSON.stringify([
      {
        text: 'What is the main topic discussed in the audio?',
        points: 8,
        options: [
          { id: 'A', text: 'Travel plans' },
          { id: 'B', text: 'Business meeting' },
          { id: 'C', text: 'Weather forecast' },
          { id: 'D', text: 'Sports event' },
        ],
        answer: 'B',
      },
      {
        text: 'When will the meeting take place?',
        points: 8,
        options: [
          { id: 'A', text: 'Monday morning' },
          { id: 'B', text: 'Tuesday afternoon' },
          { id: 'C', text: 'Wednesday evening' },
          { id: 'D', text: 'Thursday night' },
        ],
        answer: 'A',
      },
    ]),
    ...overrides,
  }),

  lyricsTraining: (overrides: any = {}) => ({
    challengeId: 'test-challenge-id',
    stage: 'LISTENING',
    phase: 'phase_3_4',
    position: 4,
    type: 'lyrics_training',
    points: 15,
    timeLimit: 120,
    maxAttempts: 3,
    text: 'Complete the lyrics after listening to the song clip.',
    instructions: 'Listen to the song and type the next correct word.',
    options: 'light,dark,bright,night',
    answer: 'dark',
    ...overrides,
  }),

  sentenceMaker: (overrides: any = {}) => ({
    challengeId: 'test-challenge-id',
    stage: 'WRITING',
    phase: 'phase_4_1',
    position: 1,
    type: 'sentence_maker',
    points: 18,
    timeLimit: 180,
    maxAttempts: 2,
    text: 'Create a sentence inspired by the images.',
    instructions:
      'Write an English sentence that connects the provided images.',
    ...overrides,
  }),

  fastTest: (overrides: any = {}) => ({
    challengeId: 'test-challenge-id',
    stage: 'WRITING',
    phase: 'phase_4_2',
    position: 2,
    type: 'fast_test',
    points: 12,
    timeLimit: 90,
    maxAttempts: 2,
    text: 'Complete the sentence by selecting the correct option.',
    instructions:
      'Answer whether the question should be presented in block or individually.',
    content: ['I enjoy', 'to the beach'],
    options: ['going', 'go', 'gone', 'going to'],
    answer: 'going',
    ...overrides,
  }),

  tales: (overrides: any = {}) => ({
    challengeId: 'test-challenge-id',
    stage: 'WRITING',
    phase: 'phase_4_3',
    position: 3,
    type: 'tales',
    points: 20,
    timeLimit: 240,
    maxAttempts: 2,
    text: 'Write a short story based on the image.',
    instructions: 'Craft an English story inspired by the provided image.',
    ...overrides,
  }),

  superbrain: (overrides: any = {}) => ({
    challengeId: 'test-challenge-id',
    stage: 'SPEAKING',
    phase: 'phase_5_1',
    position: 1,
    type: 'superbrain',
    points: 22,
    timeLimit: 300,
    maxAttempts: 1,
    text: 'Respond to the set of questions in a single audio response.',
    instructions:
      'Record an audio response addressing all the prompts in detail.',
    content: 'What do bees make?',
    ...overrides,
  }),

  tellMeAboutIt: (overrides: any = {}) => ({
    challengeId: 'test-challenge-id',
    stage: 'SPEAKING',
    phase: 'phase_5_2',
    position: 2,
    type: 'tell_me_about_it',
    points: 18,
    timeLimit: 240,
    maxAttempts: 2,
    text: 'Create a story based on the provided prompt.',
    instructions: 'Record an audio story inspired by the given sentence.',
    content: 'your first toy',
    ...overrides,
  }),

  debate: (overrides: any = {}) => ({
    challengeId: 'test-challenge-id',
    stage: 'SPEAKING',
    phase: 'phase_5_3',
    position: 3,
    type: 'debate',
    points: 20,
    timeLimit: 240,
    maxAttempts: 2,
    text: 'Defend or oppose the provided statement.',
    instructions:
      'Record an audio argument supporting or opposing the viewpoint.',
    content: 'Bubble gum',
    configuration: JSON.stringify({ stanceOptions: ['support', 'oppose'] }),
    ...overrides,
  }),
};
