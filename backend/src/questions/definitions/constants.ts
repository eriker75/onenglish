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
