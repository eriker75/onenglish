import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import { PrismaService } from '../../database/prisma.service';
import { QuestionMediaService } from './question-media.service';
import { QuestionFormatterService } from './question-formatter.service';
import { ValidationMethod, QuestionStage } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('QuestionsService', () => {
  let service: QuestionsService;
  let prisma: PrismaService;
  let mediaService: QuestionMediaService;
  let formatterService: QuestionFormatterService;

  const mockPrismaService = {
    question: {
      create: jest.fn(),
      createMany: jest.fn().mockResolvedValue({ count: 1 }),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    challenge: {
      findUnique: jest.fn(),
    },
    questionMedia: {
      create: jest.fn().mockResolvedValue({ id: 'media-123' }),
      createMany: jest.fn(),
    },
    questionConfiguration: {
      createMany: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService)),
  };

  const mockMediaService = {
    uploadSingleFile: jest.fn(),
    uploadMultipleFiles: jest.fn(),
    attachMediaFiles: jest.fn(),
    enrichQuestionWithMedia: jest.fn((question) => question),
  };

  const mockFormatterService = {
    formatQuestion: jest.fn(),
    formatQuestions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: QuestionMediaService, useValue: mockMediaService },
        {
          provide: QuestionFormatterService,
          useValue: mockFormatterService,
        },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
    prisma = module.get<PrismaService>(PrismaService);
    mediaService = module.get<QuestionMediaService>(QuestionMediaService);
    formatterService = module.get<QuestionFormatterService>(
      QuestionFormatterService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== HELPER METHODS TESTS ====================

  describe('getDefaultValidationMethod', () => {
    it('should return AUTO for image_to_multiple_choices', () => {
      const method = service['getDefaultValidationMethod'](
        'image_to_multiple_choices',
      );
      expect(method).toBe(ValidationMethod.AUTO);
    });

    it('should return IA for wordbox', () => {
      const method = service['getDefaultValidationMethod']('wordbox');
      expect(method).toBe(ValidationMethod.IA);
    });

    it('should return IA for spelling', () => {
      const method = service['getDefaultValidationMethod']('spelling');
      expect(method).toBe(ValidationMethod.IA);
    });

    it('should return IA for word_associations', () => {
      const method = service['getDefaultValidationMethod']('word_associations');
      expect(method).toBe(ValidationMethod.IA);
    });

    it('should return AUTO for unscramble', () => {
      const method = service['getDefaultValidationMethod']('unscramble');
      expect(method).toBe(ValidationMethod.AUTO);
    });

    it('should return AUTO for tenses', () => {
      const method = service['getDefaultValidationMethod']('tenses');
      expect(method).toBe(ValidationMethod.AUTO);
    });

    it('should return AUTO for tag_it', () => {
      const method = service['getDefaultValidationMethod']('tag_it');
      expect(method).toBe(ValidationMethod.AUTO);
    });

    it('should return IA for report_it', () => {
      const method = service['getDefaultValidationMethod']('report_it');
      expect(method).toBe(ValidationMethod.IA);
    });

    it('should return AUTO for read_it', () => {
      const method = service['getDefaultValidationMethod']('read_it');
      expect(method).toBe(ValidationMethod.AUTO);
    });

    it('should return AUTO for word_match', () => {
      const method = service['getDefaultValidationMethod']('word_match');
      expect(method).toBe(ValidationMethod.AUTO);
    });

    it('should return IA for gossip', () => {
      const method = service['getDefaultValidationMethod']('gossip');
      expect(method).toBe(ValidationMethod.IA);
    });

    it('should return AUTO for topic_based_audio', () => {
      const method = service['getDefaultValidationMethod']('topic_based_audio');
      expect(method).toBe(ValidationMethod.AUTO);
    });

    it('should return AUTO for lyrics_training', () => {
      const method = service['getDefaultValidationMethod']('lyrics_training');
      expect(method).toBe(ValidationMethod.AUTO);
    });

    it('should return IA for sentence_maker', () => {
      const method = service['getDefaultValidationMethod']('sentence_maker');
      expect(method).toBe(ValidationMethod.IA);
    });

    it('should return AUTO for fast_test', () => {
      const method = service['getDefaultValidationMethod']('fast_test');
      expect(method).toBe(ValidationMethod.AUTO);
    });

    it('should return IA for tales', () => {
      const method = service['getDefaultValidationMethod']('tales');
      expect(method).toBe(ValidationMethod.IA);
    });

    it('should return IA for superbrain', () => {
      const method = service['getDefaultValidationMethod']('superbrain');
      expect(method).toBe(ValidationMethod.IA);
    });

    it('should return IA for tell_me_about_it', () => {
      const method = service['getDefaultValidationMethod']('tell_me_about_it');
      expect(method).toBe(ValidationMethod.IA);
    });

    it('should return IA for debate', () => {
      const method = service['getDefaultValidationMethod']('debate');
      expect(method).toBe(ValidationMethod.IA);
    });

    it('should return AUTO for unknown types', () => {
      const method = service['getDefaultValidationMethod']('unknown_type');
      expect(method).toBe(ValidationMethod.AUTO);
    });
  });

  // ==================== CREATE METHOD TESTS ====================

  describe('createImageToMultipleChoices', () => {
    const mockDto = {
      challengeId: 'challenge-123',
      stage: QuestionStage.VOCABULARY,
      phase: 'phase_1_1',
      position: 1,
      type: 'image_to_multiple_choices',
      points: 10,
      timeLimit: 60,
      maxAttempts: 2,
      text: 'Test question',
      instructions: 'Test instructions',
      options: ['A', 'B', 'C'],
      answer: 'A',
      media: { path: 'test.png' } as any,
    };

    beforeEach(() => {
      mockPrismaService.challenge.findUnique.mockResolvedValue({
        id: 'challenge-123',
      });
      mockMediaService.uploadSingleFile.mockResolvedValue({ id: 'file-123' });
      mockPrismaService.question.create.mockResolvedValue({
        id: 'question-123',
        ...mockDto,
      });
      mockPrismaService.question.findUnique.mockResolvedValue({
        id: 'question-123',
        ...mockDto,
      });
      mockFormatterService.formatQuestion.mockResolvedValue({
        id: 'question-123',
        ...mockDto,
      });
    });

    it('should use default AUTO validation method when not provided', async () => {
      await service.createImageToMultipleChoices(mockDto);

      expect(mockPrismaService.question.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            validationMethod: ValidationMethod.AUTO,
          }),
        }),
      );
    });

    it('should use provided validation method when specified', async () => {
      const dtoWithValidation = {
        ...mockDto,
        validationMethod: ValidationMethod.IA,
      };

      await service.createImageToMultipleChoices(dtoWithValidation);

      expect(mockPrismaService.question.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            validationMethod: ValidationMethod.IA,
          }),
        }),
      );
    });

    it('should upload media file', async () => {
      await service.createImageToMultipleChoices(mockDto);

      expect(mockMediaService.uploadSingleFile).toHaveBeenCalledWith(
        mockDto.media,
      );
    });

    it('should attach media to question', async () => {
      await service.createImageToMultipleChoices(mockDto);

      expect(mockMediaService.attachMediaFiles).toHaveBeenCalledWith(
        'question-123',
        expect.arrayContaining([
          expect.objectContaining({
            id: 'file-123',
          }),
        ]),
      );
    });

    it('should throw BadRequestException if answer not in options', async () => {
      const invalidDto = { ...mockDto, answer: 'D' };

      await expect(
        service.createImageToMultipleChoices(invalidDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error if challenge not found', async () => {
      mockPrismaService.challenge.findUnique.mockResolvedValue(null);

      await expect(
        service.createImageToMultipleChoices(mockDto),
      ).rejects.toThrow();
    });
  });

  describe('createWordbox', () => {
    const mockDto = {
      challengeId: 'challenge-123',
      stage: QuestionStage.VOCABULARY,
      phase: 'phase_1_2',
      position: 2,
      type: 'wordbox',
      points: 12,
      timeLimit: 90,
      maxAttempts: 3,
      text: 'Test question',
      instructions: 'Test instructions',
      content: [
        ['A', 'B', 'C'],
        ['D', 'E', 'F'],
        ['G', 'H', 'I'],
      ],
      configuration: { gridWidth: 3, gridHeight: 3 },
    };

    beforeEach(() => {
      mockPrismaService.challenge.findUnique.mockResolvedValue({
        id: 'challenge-123',
      });
      mockPrismaService.question.create.mockResolvedValue({
        id: 'question-123',
        ...mockDto,
      });
      mockPrismaService.question.findUnique.mockResolvedValue({
        id: 'question-123',
        ...mockDto,
      });
      mockFormatterService.formatQuestion.mockResolvedValue({
        id: 'question-123',
        ...mockDto,
      });
    });

    it('should use default IA validation method when not provided', async () => {
      await service.createWordbox(mockDto);

      expect(mockPrismaService.question.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            validationMethod: ValidationMethod.IA,
          }),
        }),
      );
    });

    it('should validate grid is non-empty', async () => {
      const invalidDto = { ...mockDto, content: [] };

      await expect(service.createWordbox(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should validate grid rows have consistent length', async () => {
      const invalidDto = {
        ...mockDto,
        content: [
          ['A', 'B', 'C'],
          ['D', 'E'], // Inconsistent
        ],
      };

      await expect(service.createWordbox(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should store configuration if provided', async () => {
      await service.createWordbox(mockDto);

      expect(mockPrismaService.question.create).toHaveBeenCalled();
    });
  });

  describe('createUnscramble', () => {
    const mockDto = {
      challengeId: 'challenge-123',
      stage: QuestionStage.GRAMMAR,
      phase: 'phase_2_1',
      position: 1,
      type: 'unscramble',
      points: 10,
      timeLimit: 60,
      maxAttempts: 3,
      text: 'Test question',
      instructions: 'Test instructions',
      content: ['word1', 'word2', 'word3'],
      answer: ['word3', 'word1', 'word2'],
    };

    beforeEach(() => {
      mockPrismaService.challenge.findUnique.mockResolvedValue({
        id: 'challenge-123',
      });
      mockPrismaService.question.create.mockResolvedValue({
        id: 'question-123',
        ...mockDto,
      });
      mockFormatterService.formatQuestion.mockResolvedValue({
        id: 'question-123',
        ...mockDto,
      });
    });

    it('should use default AUTO validation method', async () => {
      await service.createUnscramble(mockDto);

      expect(mockPrismaService.question.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            validationMethod: ValidationMethod.AUTO,
          }),
        }),
      );
    });

    it('should store content array correctly', async () => {
      await service.createUnscramble(mockDto);

      expect(mockPrismaService.question.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            content: mockDto.content,
          }),
        }),
      );
    });

    it('should allow overriding validation method', async () => {
      const dtoWithValidation = {
        ...mockDto,
        validationMethod: ValidationMethod.IA,
      };

      await service.createUnscramble(dtoWithValidation);

      expect(mockPrismaService.question.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            validationMethod: ValidationMethod.IA,
          }),
        }),
      );
    });
  });

  describe('createReadIt', () => {
    const mockDto = {
      challengeId: 'challenge-123',
      stage: QuestionStage.GRAMMAR,
      phase: 'phase_2_5',
      position: 5,
      type: 'read_it',
      points: 12,
      timeLimit: 90,
      maxAttempts: 2,
      text: 'Test question',
      instructions: 'Test instructions',
      content: [{ text: 'Reading passage' }],
      subQuestions: [
        {
          content: 'Sub-question 1',
          options: [true, false] as [boolean, boolean],
          answer: true,
          points: 6,
        },
        {
          content: 'Sub-question 2',
          options: [true, false] as [boolean, boolean],
          answer: false,
          points: 6,
        },
      ],
    };

    beforeEach(() => {
      mockPrismaService.challenge.findUnique.mockResolvedValue({
        id: 'challenge-123',
      });
      mockPrismaService.question.create.mockResolvedValue({
        id: 'question-123',
        ...mockDto,
      });
      mockFormatterService.formatQuestion.mockResolvedValue({
        id: 'question-123',
        ...mockDto,
      });
    });

    it('should use default AUTO validation method', async () => {
      await service.createReadIt(mockDto);

      expect(mockPrismaService.question.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            validationMethod: ValidationMethod.AUTO,
          }),
        }),
      );
    });

    it('should validate subQuestions array is not empty', async () => {
      const invalidDto = { ...mockDto, subQuestions: [] };

      await expect(service.createReadIt(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when parentQuestionId does not exist', async () => {
      const dtoWithInvalidParent = {
        ...mockDto,
        parentQuestionId: 'non-existent-id',
      };
      mockPrismaService.question.findUnique.mockResolvedValueOnce(null);

      await expect(service.createReadIt(dtoWithInvalidParent)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.createReadIt(dtoWithInvalidParent)).rejects.toThrow(
        'Parent question with ID non-existent-id not found',
      );
    });

    it('should allow creation when parentQuestionId exists', async () => {
      const dtoWithValidParent = {
        ...mockDto,
        parentQuestionId: 'existing-parent-id',
      };
      mockPrismaService.question.findUnique.mockResolvedValueOnce({
        id: 'existing-parent-id',
      });

      await service.createReadIt(dtoWithValidParent);

      expect(mockPrismaService.question.findUnique).toHaveBeenCalledWith({
        where: { id: 'existing-parent-id' },
      });
    });
  });

  describe('createTopicBasedAudio', () => {
    const mockDto = {
      challengeId: 'challenge-123',
      stage: QuestionStage.LISTENING,
      phase: 'phase_3_3',
      position: 3,
      type: 'topic_based_audio',
      points: 16,
      timeLimit: 180,
      maxAttempts: 3,
      text: 'Test question',
      instructions: 'Test instructions',
      media: { path: 'test.mp3' } as any,
      subQuestions: [
        {
          text: 'What is the main topic?',
          points: 8,
          options: [
            { id: 'A', text: 'Option A' },
            { id: 'B', text: 'Option B' },
          ],
          answer: 'A',
        },
      ],
    };

    beforeEach(() => {
      mockPrismaService.challenge.findUnique.mockResolvedValue({
        id: 'challenge-123',
      });
      mockMediaService.uploadSingleFile.mockResolvedValue({ id: 'file-123' });
      mockPrismaService.question.create.mockResolvedValue({
        id: 'question-123',
        ...mockDto,
      });
      mockFormatterService.formatQuestion.mockResolvedValue({
        id: 'question-123',
        ...mockDto,
      });
    });

    it('should use default AUTO validation method', async () => {
      await service.createTopicBasedAudio(mockDto);

      expect(mockPrismaService.question.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            validationMethod: ValidationMethod.AUTO,
          }),
        }),
      );
    });

    it('should upload audio file', async () => {
      await service.createTopicBasedAudio(mockDto);

      expect(mockMediaService.uploadSingleFile).toHaveBeenCalledWith(
        mockDto.media,
      );
    });

    it('should validate subQuestions are provided', async () => {
      const invalidDto = { ...mockDto, subQuestions: [] };

      await expect(service.createTopicBasedAudio(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when parentQuestionId does not exist', async () => {
      const dtoWithInvalidParent = {
        ...mockDto,
        parentQuestionId: 'non-existent-id',
      };
      mockPrismaService.question.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.createTopicBasedAudio(dtoWithInvalidParent),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.createTopicBasedAudio(dtoWithInvalidParent),
      ).rejects.toThrow('Parent question with ID non-existent-id not found');
    });

    it('should allow creation when parentQuestionId exists', async () => {
      const dtoWithValidParent = {
        ...mockDto,
        parentQuestionId: 'existing-parent-id',
      };
      mockPrismaService.question.findUnique.mockResolvedValueOnce({
        id: 'existing-parent-id',
      });

      await service.createTopicBasedAudio(dtoWithValidParent);

      expect(mockPrismaService.question.findUnique).toHaveBeenCalledWith({
        where: { id: 'existing-parent-id' },
      });
    });
  });

  describe('createSentenceMaker', () => {
    const mockDto = {
      challengeId: 'challenge-123',
      stage: QuestionStage.WRITING,
      phase: 'phase_4_1',
      position: 1,
      type: 'sentence_maker',
      points: 18,
      timeLimit: 180,
      maxAttempts: 2,
      text: 'Test question',
      instructions: 'Test instructions',
      media: [{ path: 'test1.png' } as any, { path: 'test2.png' } as any],
    };

    beforeEach(() => {
      mockPrismaService.challenge.findUnique.mockResolvedValue({
        id: 'challenge-123',
      });
      mockMediaService.uploadSingleFile.mockResolvedValue({
        id: 'file-1',
        path: 'uploads/test.png',
      });
      mockPrismaService.question.create.mockResolvedValue({
        id: 'question-123',
        ...mockDto,
      });
      mockFormatterService.formatQuestion.mockResolvedValue({
        id: 'question-123',
        ...mockDto,
      });
      mockPrismaService.question.findUnique.mockResolvedValue({
        id: 'question-123',
        ...mockDto,
      });
    });

    it('should use default IA validation method', async () => {
      await service.createSentenceMaker(mockDto);

      expect(mockPrismaService.question.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            validationMethod: ValidationMethod.IA,
          }),
        }),
      );
    });

    it('should handle multiple image uploads', async () => {
      await service.createSentenceMaker(mockDto);

      expect(mockMediaService.uploadSingleFile).toHaveBeenCalledTimes(2);
    });
  });

  // ==================== QUERY METHOD TESTS ====================

  describe('findAll', () => {
    it('should return all questions without filters', async () => {
      const mockQuestions = [
        { id: '1', type: 'unscramble' },
        { id: '2', type: 'wordbox' },
      ];
      mockPrismaService.question.findMany.mockResolvedValue(mockQuestions);
      mockFormatterService.formatQuestions.mockResolvedValue(mockQuestions);

      const result = await service.findAll({});

      expect(mockPrismaService.question.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            parentQuestionId: null,
          }),
        }),
      );
      expect(result).toEqual(mockQuestions);
    });

    it('should filter by challengeId', async () => {
      const mockQuestions = [{ id: '1', challengeId: 'challenge-123' }];
      mockPrismaService.question.findMany.mockResolvedValue(mockQuestions);
      mockFormatterService.formatQuestions.mockResolvedValue(mockQuestions);

      await service.findAll({ challengeId: 'challenge-123' });

      expect(mockPrismaService.question.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            challengeId: 'challenge-123',
          }),
        }),
      );
    });

    it('should filter by stage', async () => {
      const mockQuestions = [{ id: '1', stage: 'VOCABULARY' }];
      mockPrismaService.question.findMany.mockResolvedValue(mockQuestions);
      mockFormatterService.formatQuestions.mockResolvedValue(mockQuestions);

      await service.findAll({ stage: QuestionStage.VOCABULARY });

      expect(mockPrismaService.question.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            stage: QuestionStage.VOCABULARY,
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a question by id', async () => {
      const mockQuestion = { id: 'question-123', type: 'unscramble' };
      mockPrismaService.question.findUnique.mockResolvedValue(mockQuestion);
      mockFormatterService.formatQuestion.mockResolvedValue(mockQuestion);

      const result = await service.findOne('question-123');

      expect(mockPrismaService.question.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'question-123' },
        }),
      );
      expect(result).toEqual(mockQuestion);
    });

    it('should throw NotFoundException if question not found', async () => {
      mockPrismaService.question.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
