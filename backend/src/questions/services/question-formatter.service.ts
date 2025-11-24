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
  FormattedReadItSubquestion,
  FormattedTellMeAboutItQuestion,
  FormattedReportItQuestion,
  FormattedDebateQuestion,
  FormattedFastTestQuestion,
  FormattedSuperbrainQuestion,
  FormattedTensesQuestion,
  FormattedDefaultQuestion,
  MediaFile,
} from './types';
import { FileService } from '../../files/services/file.service';

/**
 * Service to format questions based on their type
 * Each question type has specific formatting needs for optimal frontend consumption
 */
@Injectable()
export class QuestionFormatterService {
  constructor(private readonly fileService: FileService) {}

  /**
   * Helper to include configurations only if not empty
   */
  private getConfigurationsIfNotEmpty(
    configurations?: Record<string, string>,
  ): Record<string, string> | undefined {
    if (!configurations || Object.keys(configurations).length === 0) {
      return undefined;
    }
    return configurations;
  }

  /**
   * Helper to extract URL from a single media file by type
   * Converts relative paths to full URLs
   */
  private getMediaUrl(
    media: MediaFile[] | undefined,
    type: 'image' | 'audio' | 'video',
  ): string | null {
    if (!media || media.length === 0) return null;
    const file = media.find((m) => m.type === type);
    if (!file?.url) return null;
    return this.fileService.getFullUrl(file.url);
  }

  /**
   * Helper to extract URLs from multiple media files by type
   * Converts relative paths to full URLs
   */
  private getMediaUrls(
    media: MediaFile[] | undefined,
    type: 'image' | 'audio' | 'video',
  ): string[] {
    if (!media || media.length === 0) return [];
    const filteredMedia = media.filter((m) => m.type === type);
    return filteredMedia
      .map((m) => ({
        url: this.fileService.getFullUrl(m.url),
        position: m.position || 0,
      }))
      .filter((item): item is { url: string; position: number } => item.url !== null)
      .sort((a, b) => a.position - b.position)
      .map((item) => item.url);
  }

  /**
   * Helper to remove null and undefined fields from an object recursively
   * Preserves other falsy values like false, 0, empty strings, etc.
   */
  private removeNullFields(obj: any): any {
    if (obj === null || obj === undefined) {
      return undefined;
    }

    if (Array.isArray(obj)) {
      const cleaned = obj.map((item) => this.removeNullFields(item)).filter((item) => item !== undefined);
      return cleaned.length > 0 ? cleaned : undefined;
    }

    if (typeof obj === 'object' && obj.constructor === Object) {
      const cleaned: any = {};
      let hasAnyValue = false;
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = this.removeNullFields(obj[key]);
          if (value !== null && value !== undefined) {
            cleaned[key] = value;
            hasAnyValue = true;
          }
        }
      }
      return hasAnyValue ? cleaned : undefined;
    }

    return obj;
  }

  /**
   * Main formatter - routes to specific formatter based on question type
   */
  formatQuestion(question: EnrichedQuestion): FormattedQuestion | null {
    if (!question) return null;
    
    // Remove null fields from the formatted result
    const formatted = this.formatQuestionInternal(question);
    return formatted ? this.removeNullFields(formatted) : null;
  }

  /**
   * Internal formatter - routes to specific formatter based on question type
   */
  private formatQuestionInternal(question: EnrichedQuestion): FormattedQuestion | null {
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
      read_it_subquestion: this.formatReadItSubquestion.bind(this),
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
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Media handling - single image URL
      image: this.getMediaUrl(question.media, 'image'),
      // Options and answer
      options: question.options || [],
      answer: question.answer,
      // Timestamps
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
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Media handling - single image URL
      image: this.getMediaUrl(question.media, 'image'),
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
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Audio handling - URL
      audio: this.getMediaUrl(question.media, 'audio') || this.getMediaUrl(question.media, 'video'),
      // Options and answer
      options: question.options || [],
      answer: question.answer,
      // Metadata
      ...(this.getConfigurationsIfNotEmpty(question.configurations) && {
        configurations: question.configurations,
      }),
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
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Central word
      centralWord: question.content,
      // Optional reference image URL
      image: this.getMediaUrl(question.media, 'image'),
      // Maximum number of associations for scoring
      maxAssociations: parseInt(question.configurations?.maxAssociations || '10'),
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
      // Optional reference image URL
      image: this.getMediaUrl(question.media, 'image'),
      // Metadata
      ...(this.getConfigurationsIfNotEmpty(question.configurations) && {
        configurations: question.configurations,
      }),
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
      ...(this.getConfigurationsIfNotEmpty(question.configurations) && {
        configurations: question.configurations,
      }),
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
      ...(this.getConfigurationsIfNotEmpty(question.configurations) && {
        configurations: question.configurations,
      }),
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
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Media handling - audio URL
      audio: this.getMediaUrl(question.media, 'audio'),
      // Expected transcription
      answer: question.answer,
      // Metadata
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
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Media handling - audio URL
      audio: this.getMediaUrl(question.media, 'audio'),
      // Sub-questions
      subQuestions:
        question.subQuestions
          ?.map((sq) => this.formatQuestion(sq))
          .filter((q): q is FormattedQuestion => q !== null) || [],
      // Metadata
      ...(this.getConfigurationsIfNotEmpty(question.configurations) && {
        configurations: question.configurations,
      }),
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
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Video handling - URL
      video: this.getMediaUrl(question.media, 'video'),
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
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Media handling - image URLs array
      images: this.getMediaUrls(question.media, 'image'),
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
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Image handling - URL
      image: this.getMediaUrl(question.media, 'image'),
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
      // Optional reference image URL
      image: this.getMediaUrl(question.media, 'image'),
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
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Text to read
      content: question.content,
      // Optional reference image URL
      image: this.getMediaUrl(question.media, 'image'),
      // Sub-questions
      subQuestions: question.subQuestions
        ?.map((sq) => this.formatQuestion(sq))
        .filter((q): q is FormattedQuestion => q !== null) || [],
      // Metadata
      ...(this.getConfigurationsIfNotEmpty(question.configurations) && {
        configurations: question.configurations,
      }),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  private formatReadItSubquestion(
    question: EnrichedQuestion,
  ): FormattedReadItSubquestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Content is the question text
      content: question.content || '',
      // Answer options (true/false)
      options: question.options || [],
      // Correct answer (boolean)
      answer: question.answer,
      // Parent question ID
      parentQuestionId: question.parentQuestion?.id,
      // Metadata
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
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Media handling - URLs
      image: this.getMediaUrl(question.media, 'image'),
      video: this.getMediaUrl(question.media, 'video'),
      // Prompt
      prompt: question.content,
      // Speaking duration
      minDuration: parseInt(question.configurations?.minDuration || '30'),
      // Metadata
      ...(this.getConfigurationsIfNotEmpty(question.configurations) && {
        configurations: question.configurations,
      }),
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
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Direct speech to convert
      content: question.content,
      // Optional reference image URL
      image: this.getMediaUrl(question.media, 'image'),
      // Metadata
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  private formatDebate(question: EnrichedQuestion): FormattedDebateQuestion {
    return {
      id: question.id,
      type: question.type,
      stage: question.stage,
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
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Question prompt
      content: question.content,
      // Optional decorative image URL
      image: this.getMediaUrl(question.media, 'image'),
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
      position: question.position,
      points: question.points,
      timeLimit: question.timeLimit,
      maxAttempts: question.maxAttempts,
      text: question.text,
      instructions: question.instructions,
      validationMethod: question.validationMethod,
      // Sentence to identify tense from
      content: question.content || '',
      // Tense options
      options: question.options || [],
      // Correct tense
      answer: question.answer,
      // Optional reference image URL
      image: this.getMediaUrl(question.media, 'image'),
      // Metadata
      ...(this.getConfigurationsIfNotEmpty(question.configurations) && {
        configurations: question.configurations,
      }),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }

  // ==================== DEFAULT FORMATTER ====================

  private formatDefault(question: EnrichedQuestion): FormattedDefaultQuestion {
    const result: FormattedDefaultQuestion = {
      id: question.id,
      type: question.type,
      stage: question.stage,
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
      subQuestions:
        question.subQuestions
          ?.map((sq) => this.formatQuestion(sq))
          .filter((q): q is FormattedQuestion => q !== null) || [],
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };

    // Extract media URLs by type
    const imageUrl = this.getMediaUrl(question.media, 'image');
    const audioUrl = this.getMediaUrl(question.media, 'audio');
    const videoUrl = this.getMediaUrl(question.media, 'video');
    const imageUrls = this.getMediaUrls(question.media, 'image');
    const audioUrls = this.getMediaUrls(question.media, 'audio');

    if (imageUrl) result.image = imageUrl;
    if (audioUrl) result.audio = audioUrl;
    if (videoUrl) result.video = videoUrl;
    if (imageUrls.length > 0) result.images = imageUrls;
    if (audioUrls.length > 0) result.audios = audioUrls;

    if (this.getConfigurationsIfNotEmpty(question.configurations)) {
      result.configurations = question.configurations;
    }

    return result;
  }
}
