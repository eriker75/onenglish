export const VALID_QUESTIONS_TYPES = [
  'multiple_choice',
  'fill_blank',
  'audio_question',
  'speaking_practice',
  'matching',
  'ordering',
  'true_false',
  'short_answer',
  'essay',
  'listening_comprehension',
] as const;

export const QUESTION_DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const;

export const SKILL_CATEGORIES = [
  'listening',
  'speaking',
  'grammar',
  'vocabulary',
  'reading',
  'writing',
] as const;

export const EVALUATION_METHODS = ['auto', 'manual'] as const;

export enum VERB_TENSES {
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
