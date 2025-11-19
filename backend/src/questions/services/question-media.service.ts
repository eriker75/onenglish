import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { FileService } from '../../files/services/file.service';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { QuestionWithRelations, EnrichedQuestion } from './types';

export interface MediaAttachment {
  id: string;
  context?: string;
  position?: number;
}

@Injectable()
export class QuestionMediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileService: FileService,
  ) {}

  /**
   * Upload a single file and return the saved media file
   */
  async uploadSingleFile(file: FileSystemStoredFile) {
    return this.fileService.saveFile(file);
  }

  /**
   * Upload multiple files and return array of saved media files
   */
  async uploadMultipleFiles(files: FileSystemStoredFile[]) {
    return Promise.all(files.map((file) => this.fileService.saveFile(file)));
  }

  /**
   * Attach media files to a question via the question_media pivot table
   */
  async attachMediaFiles(
    questionId: string,
    mediaIds: Array<{ id: string; context?: string; position?: number }>,
  ) {
    if (!mediaIds.length) return;

    const mediaAttachments = mediaIds.map((media, index) => ({
      questionId,
      mediaFileId: media.id,
      position: media.position ?? index,
      context: media.context ?? 'main',
    }));

    await this.prisma.questionMedia.createMany({
      data: mediaAttachments,
      skipDuplicates: true,
    });
  }

  /**
   * Detach all media files from a question
   */
  async detachAllMediaFiles(questionId: string) {
    await this.prisma.questionMedia.deleteMany({
      where: { questionId },
    });
  }

  /**
   * Replace media files for a question (detach old, attach new)
   */
  async replaceMediaFiles(
    questionId: string,
    mediaIds: Array<{ id: string; context?: string; position?: number }>,
  ) {
    await this.detachAllMediaFiles(questionId);
    await this.attachMediaFiles(questionId, mediaIds);
  }

  /**
   * Get all media files for a question
   */
  async getQuestionMedia(questionId: string) {
    return this.prisma.questionMedia.findMany({
      where: { questionId },
      include: { mediaFile: true },
      orderBy: { position: 'asc' },
    });
  }

  /**
   * Enrich a question object with formatted media and configurations
   * Transforms the complex database structure into a simplified frontend-friendly format
   */
  enrichQuestionWithMedia(question: QuestionWithRelations): EnrichedQuestion {
    if (!question) return question as EnrichedQuestion;

    const media =
      question.questionMedia?.map((qm) => ({
        id: qm.mediaFile.id,
        url: qm.mediaFile.url,
        type: qm.mediaFile.type,
        filename: qm.mediaFile.filename,
        mimeType: qm.mediaFile.mimeType,
        size: qm.mediaFile.size,
        position: qm.position,
        context: qm.context,
      })) || [];

    const configurations =
      question.configurations?.reduce((acc, config) => {
        acc[config.metaKey] = config.metaValue;
        return acc;
      }, {}) || {};

    // Recursively enrich subQuestions
    const enrichedSubQuestions =
      question.subQuestions?.map((sub) => this.enrichQuestionWithMedia(sub)) ||
      [];

    // Destructure to remove questionMedia from the spread (prefixed with _ to indicate intentionally unused)
    const { questionMedia: _questionMedia, ...questionData } = question;

    return {
      ...questionData,
      media,
      configurations,
      subQuestions: enrichedSubQuestions,
    } as EnrichedQuestion;
  }

  /**
   * Enrich multiple questions with media (useful for list queries)
   */
  enrichQuestionsWithMedia(
    questions: QuestionWithRelations[],
  ): EnrichedQuestion[] {
    return questions.map((q) => this.enrichQuestionWithMedia(q));
  }
}
