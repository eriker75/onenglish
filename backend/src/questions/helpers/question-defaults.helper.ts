import { ValidationMethod } from '@prisma/client';

/**
 * Helper para obtener los valores por defecto de las preguntas
 * según su tipo
 */

/**
 * Obtiene el método de validación por defecto según el tipo de pregunta
 */
export function getDefaultValidationMethod(
  questionType: string,
): ValidationMethod {
  const defaultValidationMethods: Record<string, ValidationMethod> = {
    // Vocabulary
    image_to_multiple_choices: ValidationMethod.AUTO,
    wordbox: ValidationMethod.IA,
    spelling: ValidationMethod.IA,
    word_associations: ValidationMethod.IA,
    // Grammar
    unscramble: ValidationMethod.AUTO,
    tenses: ValidationMethod.AUTO,
    tag_it: ValidationMethod.AUTO,
    report_it: ValidationMethod.IA,
    read_it: ValidationMethod.AUTO,
    // Listening
    word_match: ValidationMethod.AUTO,
    gossip: ValidationMethod.IA,
    topic_based_audio: ValidationMethod.AUTO,
    lyrics_training: ValidationMethod.AUTO,
    // Writing
    sentence_maker: ValidationMethod.IA,
    fast_test: ValidationMethod.AUTO,
    tales: ValidationMethod.IA,
    // Speaking
    superbrain: ValidationMethod.IA,
    tell_me_about_it: ValidationMethod.IA,
    debate: ValidationMethod.IA,
  };

  return defaultValidationMethods[questionType] || ValidationMethod.AUTO;
}

/**
 * Obtiene el texto por defecto según el tipo de pregunta
 */
export function getDefaultText(questionType: string): string {
  const defaultTexts: Record<string, string> = {
    // Vocabulary
    image_to_multiple_choices: 'What is shown in the image?',
    wordbox:
      'Form as many valid English words as you can using the letters in the grid.',
    spelling: 'Spell the word shown in the image letter by letter.',
    word_associations: 'Write words related to the given topic.',
    // Grammar
    unscramble: 'Put the words in the correct order to form a sentence.',
    tenses: 'Identify the verb tense used in the sentence.',
    tag_it: 'Complete the question tag.',
    report_it: 'Convert the direct speech into reported speech.',
    read_it: 'Read the text and answer the questions below.',
    // Listening
    word_match: 'Match each word with its corresponding audio pronunciation.',
    gossip: 'Listen to the audio and repeat what you heard.',
    topic_based_audio: 'Listen to the audio and answer the questions below.',
    lyrics_training: 'Listen to the song and fill in the missing words.',
    // Writing
    sentence_maker: 'Create a sentence describing the images shown.',
    fast_test: 'Complete the sentence with the correct word.',
    tales: 'Write a creative story based on the images provided.',
    // Speaking
    superbrain: 'Answer the question with a complete spoken response.',
    tell_me_about_it: 'Tell a story about what you see in the images.',
    debate: 'Present your argument for or against the given statement.',
  };

  return defaultTexts[questionType] || 'Complete the question.';
}

/**
 * Obtiene las instrucciones por defecto según el tipo de pregunta
 */
export function getDefaultInstructions(questionType: string): string {
  const defaultInstructions: Record<string, string> = {
    // Vocabulary
    image_to_multiple_choices:
      'Select the correct option that matches the image.',
    wordbox:
      'Use the letters in the grid to form valid English words. You can move horizontally or vertically.',
    spelling: 'Say each letter clearly, one by one (e.g., C-A-T).',
    word_associations:
      'Think of words that are related or associated with the given topic.',
    // Grammar
    unscramble:
      'Arrange the words to create a grammatically correct sentence.',
    tenses:
      'Choose the tense that best describes the verb usage in the sentence.',
    tag_it: 'Type the correct question tag to complete the sentence.',
    report_it:
      'Rewrite the sentence converting direct speech to reported speech.',
    read_it:
      'Read carefully and determine if each statement is true or false.',
    // Listening
    word_match:
      'Listen to each audio clip and match it with the correct word.',
    gossip: 'Listen carefully and repeat exactly what you heard.',
    topic_based_audio:
      'Listen to the audio and answer each question based on what you heard.',
    lyrics_training: 'Listen to the song and type the missing words.',
    // Writing
    sentence_maker:
      'Write a complete sentence that describes what you see in the images.',
    fast_test: 'Fill in the blank with the appropriate word.',
    tales: 'Use your creativity to write a story inspired by the images.',
    // Speaking
    superbrain:
      'Speak clearly and provide a complete answer to the question.',
    tell_me_about_it:
      'Look at the images and tell a story about what you see.',
    debate: 'Present a clear argument with reasons supporting your position.',
  };

  return (
    defaultInstructions[questionType] || 'Follow the instructions carefully.'
  );
}
