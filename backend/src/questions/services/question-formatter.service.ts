import { Injectable } from '@nestjs/common';
import {
  EnrichedQuestion,
  FormattedQuestion,
  FormattedImageToMultipleChoicesQuestion,
  FormattedSpellingQuestion,
  FormattedWordMatchQuestion,
  FormattedWordboxQuestion,
  FormattedWordAssociationsQuestion,
  FormattedUnscrambleQuestion,
  FormattedFillInTheBlankQuestion,
  FormattedVerbConjugationQuestion,
  FormattedGossipQuestion,
  FormattedTopicBasedAudioQuestion,
  FormattedTopicBasedAudioSubquestion,
  FormattedLyricsTrainingQuestion,
  FormattedSentenceMakerQuestion,
  FormattedTalesQuestion,
  FormattedTagItQuestion,
  FormattedReadItQuestion,
  FormattedTellMeAboutItQuestion,
  FormattedReportItQuestion,
  FormattedDebateQuestion,
  FormattedFastTestQuestion,
  FormattedSuperbrainQuestion,
  FormattedTensesQuestion,
  FormattedDefaultQuestion,
} from './types';

/**
 * Service to format questions based on their type
 * Each question type has specific formatting needs for optimal frontend consumption
 */
@Injectable()
export class QuestionFormatterService {
  /**
   * Main formatter - routes to specific formatter based on question type
   */
  formatQuestion(question: EnrichedQuestion): FormattedQuestion | null {
    if (!question) return null;

    const formatterMap = {
      // VOCABULARY
      image_to_multiple_choices: this.formatImageToMultipleChoices.bind(this),
      spelling: this.formatSpelling.bind(this),
      word_match: this.formatWordMatch.bind(this),
      wordbox: this.formatWordbox.bind(this),
      word_associations: this.formatWordAssociations.bind(this),

      // GRAMMAR
      unscramble: this.formatUnscramble.bind(this),
      fill_in_the_blank: this.formatFillInTheBlank.bind(this),
      verb_conjugation: this.formatVerbConjugation.bind(this),

      // LISTENING
      gossip: this.formatGossip.bind(this),
      topic_based_audio: this.formatTopicBasedAudio.bind(this),
      topic_based_audio_subquestion:
        this.formatTopicBasedAudioSubquestion.bind(this),
      lyrics_training: this.formatLyricsTraining.bind(this),

      // WRITING
      sentence_maker: this.formatSentenceMaker.bind(this),
      tales: this.formatTales.bind(this),
      tag_it: this.formatTagIt.bind(this),

      // SPEAKING
      read_it: this.formatReadIt.bind(this),
      tell_me_about_it: this.formatTellMeAboutIt.bind(this),
      report_it: this.formatReportIt.bind(this),
      debate: this.formatDebate.bind(this),

      // SPECIAL
      fast_test: this.formatFastTest.bind(this),
      superbrain: this.formatSuperbrain.bind(this),
      tenses: this.formatTenses.bind(this),
    };

    const formatter = formatterMap[question.type];

    if (formatter) {
      return formatter(question);
    }

    // Default formatting if no specific formatter exists
    return this.formatDefault(question);
  }

  /**
   * Format multiple questions
   */
  formatQuestions(questions: EnrichedQuestion[]): FormattedQuestion[] {
    return questions
      .map((q) => this.formatQuestion(q))
      .filter(Boolean) as FormattedQuestion[];
  }

  // ==================== VOCABULARY FORMATTERS ====================

  private formatImageToMultipleChoices(
    question: EnrichedQuestion,
  ): FormattedImageToMultipleChoicesQuestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Media handling
      images: question.media?.filter((m) => m.type === 'image') || [],
      // Options and answer
      options: question.options || [],
      answer: question.answer,
      // Metadata
      configurations: question.configurations || {},
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  private formatSpelling(
    question: EnrichedQuestion,
  ): FormattedSpellingQuestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Media handling - solo imagen
      image: question.media?.[0] || null,
      // Answer
      answer: question.answer,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  private formatWordMatch(
    question: EnrichedQuestion,
  ): FormattedWordMatchQuestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Media handling - multiple images
      images: question.media?.filter((m) => m.type === 'image') || [],
      // Options and answer
      options: question.options || [],
      answer: question.answer,
      // Metadata
      configurations: question.configurations || {},
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  private formatWordbox(question: EnrichedQuestion): FormattedWordboxQuestion {
    // Aplanar configuraciones al nivel raíz
    const configurations = question.configurations || {};

    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // 2D array of letters
      grid: question.content || [],
      // Aplanar configuraciones (gridWidth, gridHeight, maxWords)
      ...configurations,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  private formatWordAssociations(
    question: EnrichedQuestion,
  ): FormattedWordAssociationsQuestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Central word
      centralWord: question.content,
      // Configuration
      totalAssociations: parseInt(
        question.configurations?.totalAssociations || '5',
      ),
      configurations: question.configurations || {},
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  // ==================== GRAMMAR FORMATTERS ====================

  private formatUnscramble(
    question: EnrichedQuestion,
  ): FormattedUnscrambleQuestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Scrambled words
      scrambledWords: question.content || [],
      // Correct sentence
      correctSentence: question.answer,
      // Metadata
      configurations: question.configurations || {},
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  private formatFillInTheBlank(
    question: EnrichedQuestion,
  ): FormattedFillInTheBlankQuestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Sentence with blanks
      sentence: question.content,
      // Options if multiple choice, null if free text
      options: question.options || null,
      // Correct answer(s)
      answer: question.answer,
      // Metadata
      configurations: question.configurations || {},
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  private formatVerbConjugation(
    question: EnrichedQuestion,
  ): FormattedVerbConjugationQuestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Verb and context
      verb: question.content?.verb,
      context: question.content?.context,
      tense: question.content?.tense,
      subject: question.content?.subject,
      // Correct answer
      answer: question.answer,
      // Metadata
      configurations: question.configurations || {},
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  // ==================== LISTENING FORMATTERS ====================

  private formatGossip(question: EnrichedQuestion): FormattedGossipQuestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Media handling
      audio: question.media?.find((m) => m.type === 'audio') || null,
      // Sub-questions
      subQuestions:
        question.subQuestions
          ?.map((sq) => this.formatQuestion(sq))
          .filter((q): q is FormattedQuestion => q !== null) || [],
      // Metadata
      configurations: question.configurations || {},
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  private formatTopicBasedAudio(
    question: EnrichedQuestion,
  ): FormattedTopicBasedAudioQuestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Media handling
      audio: question.media?.find((m) => m.type === 'audio') || null,
      // Sub-questions
      subQuestions:
        question.subQuestions
          ?.map((sq) => this.formatQuestion(sq))
          .filter((q): q is FormattedQuestion => q !== null) || [],
      // Metadata
      configurations: question.configurations || {},
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  private formatTopicBasedAudioSubquestion(
    question: EnrichedQuestion,
  ): FormattedTopicBasedAudioSubquestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Content is the question text
      content: question.content || '',
      // Answer options
      options: question.options || [],
      // Correct answer
      answer: question.answer,
      // Parent question ID
      parentQuestionId: question.parentQuestion?.id,
      // Metadata
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  private formatLyricsTraining(
    question: EnrichedQuestion,
  ): FormattedLyricsTrainingQuestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Media handling (audio or video, return whichever exists)
      media:
        question.media?.find((m) => m.type === 'audio' || m.type === 'video') ||
        null,
      // Word options and answer
      options: question.options || [],
      answer: question.answer,
      // Metadata
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  // ==================== WRITING FORMATTERS ====================

  private formatSentenceMaker(
    question: EnrichedQuestion,
  ): FormattedSentenceMakerQuestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Media handling
      images: question.media?.filter((m) => m.type === 'image') || [],
      // Metadata
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  private formatTales(question: EnrichedQuestion): FormattedTalesQuestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Media handling
      images: question.media?.filter((m) => m.type === 'image') || [],
      // Metadata
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  private formatTagIt(question: EnrichedQuestion): FormattedTagItQuestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Sentence parts (e.g., ["He is responsible for the project,", "?"])
      content: question.content,
      // Correct answer(s) - multiple acceptable answers (e.g., ["isn't he", "is not he"])
      answer: question.answer,
      // Optional reference image (PNG with transparency recommended)
      image: question.media?.find((m) => m.type === 'image') || null,
      // Metadata
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  // ==================== SPEAKING FORMATTERS ====================

  private formatReadIt(question: EnrichedQuestion): FormattedReadItQuestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Text to read
      textToRead: question.content,
      // Reference audio (if available)
      referenceAudio: question.media?.find((m) => m.type === 'audio') || null,
      // Metadata
      configurations: question.configurations || {},
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  private formatTellMeAboutIt(
    question: EnrichedQuestion,
  ): FormattedTellMeAboutItQuestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Media handling
      image: question.media?.find((m) => m.type === 'image') || null,
      video: question.media?.find((m) => m.type === 'video') || null,
      // Prompt
      prompt: question.content,
      // Speaking duration
      minDuration: parseInt(question.configurations?.minDuration || '30'),
      // Metadata
      configurations: question.configurations || {},
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  private formatReportIt(
    question: EnrichedQuestion,
  ): FormattedReportItQuestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Topic or context
      topic: question.content,
      // Media resources
      media: question.media || [],
      // Speaking duration
      minDuration: parseInt(question.configurations?.minDuration || '60'),
      // Metadata
      configurations: question.configurations || {},
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  private formatDebate(question: EnrichedQuestion): FormattedDebateQuestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Debate topic
      topic: question.content,
      // Speaking duration
      minDuration: parseInt(question.configurations?.minDuration || '90'),
      // Stance - from answer field
      stance: question.answer,
      // Metadata
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  // ==================== SPECIAL FORMATTERS ====================

  private formatFastTest(
    question: EnrichedQuestion,
  ): FormattedFastTestQuestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Sentence parts with gap
      content: question.content || [],
      // Answer options
      options: question.options || [],
      // Correct answer
      answer: question.answer,
      // Metadata
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  private formatSuperbrain(
    question: EnrichedQuestion,
  ): FormattedSuperbrainQuestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Question prompt
      content: question.content,
      // Optional decorative image
      image: question.media?.find((m) => m.type === 'image') || null,
      // Metadata
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  private formatTenses(question: EnrichedQuestion): FormattedTensesQuestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Sub-questions for tenses practice
      subQuestions:
        question.subQuestions
          ?.map((sq) => this.formatQuestion(sq))
          .filter((q): q is FormattedQuestion => q !== null) || [],
      // Configuration
      totalQuestions: question.subQuestions?.length || 0,
      configurations: question.configurations || {},
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  // ==================== DEFAULT FORMATTER ====================

  private formatDefault(question: EnrichedQuestion): FormattedDefaultQuestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      phase: question.phase,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      content: question.content,
      options: question.options,
      answer: question.answer,
      media: question.media || [],
      configurations: question.configurations || {},
      subQuestions:
        question.subQuestions
          ?.map((sq) => this.formatQuestion(sq))
          .filter((q): q is FormattedQuestion => q !== null) || [],
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }
}
