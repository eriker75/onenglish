import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from '../services/questions.service';
import { QuestionStage } from '@prisma/client';
import { NestjsFormDataModule } from 'nestjs-form-data';

describe('QuestionsController', () => {
  let controller: QuestionsController;
  let service: QuestionsService;

  const mockQuestionsService = {
    createImageToMultipleChoices: jest.fn(),
    createWordbox: jest.fn(),
    createSpelling: jest.fn(),
    createWordAssociations: jest.fn(),
    createUnscramble: jest.fn(),
    createTenses: jest.fn(),
    createTagIt: jest.fn(),
    createReportIt: jest.fn(),
    createReadIt: jest.fn(),
    createWordMatch: jest.fn(),
    createGossip: jest.fn(),
    createTopicBasedAudio: jest.fn(),
    createLyricsTraining: jest.fn(),
    createSentenceMaker: jest.fn(),
    createFastTest: jest.fn(),
    createTales: jest.fn(),
    createSuperbrain: jest.fn(),
    createTellMeAboutIt: jest.fn(),
    createDebate: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    getSchoolStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NestjsFormDataModule.config({ isGlobal: true })],
      controllers: [QuestionsController],
      providers: [
        {
          provide: QuestionsService,
          useValue: mockQuestionsService,
        },
      ],
    }).compile();

    controller = module.get<QuestionsController>(QuestionsController);
    service = module.get<QuestionsService>(QuestionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ==================== VOCABULARY ENDPOINTS ====================

  describe('VOCABULARY Endpoints', () => {
    describe('createImageToMultipleChoices', () => {
      it('should call service method with correct DTO', async () => {
        const dto = {
          challengeId: 'test-id',
          type: 'image_to_multiple_choices',
          options: ['A', 'B', 'C'],
          answer: 'A',
        } as any;

        const expectedResult = { id: 'question-1', ...dto };
        mockQuestionsService.createImageToMultipleChoices.mockResolvedValue(
          expectedResult,
        );

        const result = await controller.createImageToMultipleChoices(dto);

        expect(service.createImageToMultipleChoices).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createWordbox', () => {
      it('should call service method with correct DTO', async () => {
        const dto = {
          challengeId: 'test-id',
          type: 'wordbox',
          content: [['A', 'B'], ['C', 'D']],
        } as any;

        const expectedResult = { id: 'question-2', ...dto };
        mockQuestionsService.createWordbox.mockResolvedValue(expectedResult);

        const result = await controller.createWordbox(dto);

        expect(service.createWordbox).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createSpelling', () => {
      it('should call service method with correct DTO', async () => {
        const dto = {
          challengeId: 'test-id',
          type: 'spelling',
          answer: 'Butterfly',
        } as any;

        const expectedResult = { id: 'question-3', ...dto };
        mockQuestionsService.createSpelling.mockResolvedValue(expectedResult);

        const result = await controller.createSpelling(dto);

        expect(service.createSpelling).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createWordAssociations', () => {
      it('should call service method with correct DTO', async () => {
        const dto = {
          challengeId: 'test-id',
          type: 'word_associations',
          content: 'Journey',
        } as any;

        const expectedResult = { id: 'question-4', ...dto };
        mockQuestionsService.createWordAssociations.mockResolvedValue(
          expectedResult,
        );

        const result = await controller.createWordAssociations(dto);

        expect(service.createWordAssociations).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  // ==================== GRAMMAR ENDPOINTS ====================

  describe('GRAMMAR Endpoints', () => {
    describe('createUnscramble', () => {
      it('should call service method with correct DTO', async () => {
        const dto = {
          challengeId: 'test-id',
          type: 'unscramble',
          content: ['word1', 'word2', 'word3'],
        } as any;

        const expectedResult = { id: 'question-5', ...dto };
        mockQuestionsService.createUnscramble.mockResolvedValue(expectedResult);

        const result = await controller.createUnscramble(dto);

        expect(service.createUnscramble).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createTenses', () => {
      it('should call service method with correct DTO', async () => {
        const dto = {
          challengeId: 'test-id',
          type: 'tenses',
          content: 'She does her homework.',
          options: ['present_simple', 'past_simple'],
        } as any;

        const expectedResult = { id: 'question-6', ...dto };
        mockQuestionsService.createTenses.mockResolvedValue(expectedResult);

        const result = await controller.createTenses(dto);

        expect(service.createTenses).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createTagIt', () => {
      it('should call service method with correct DTO', async () => {
        const dto = {
          challengeId: 'test-id',
          type: 'tag_it',
          content: ['He is responsible,', '?'],
        } as any;

        const expectedResult = { id: 'question-7', ...dto };
        mockQuestionsService.createTagIt.mockResolvedValue(expectedResult);

        const result = await controller.createTagIt(dto);

        expect(service.createTagIt).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createReportIt', () => {
      it('should call service method with correct DTO', async () => {
        const dto = {
          challengeId: 'test-id',
          type: 'report_it',
          content: '"I will call you tomorrow," she said.',
        } as any;

        const expectedResult = { id: 'question-8', ...dto };
        mockQuestionsService.createReportIt.mockResolvedValue(expectedResult);

        const result = await controller.createReportIt(dto);

        expect(service.createReportIt).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createReadIt', () => {
      it('should call service method with correct DTO', async () => {
        const dto = {
          challengeId: 'test-id',
          type: 'read_it',
          content: [{ text: 'Reading passage' }],
          subQuestions: [{ content: 'Question 1', answer: true }],
        } as any;

        const expectedResult = { id: 'question-9', ...dto };
        mockQuestionsService.createReadIt.mockResolvedValue(expectedResult);

        const result = await controller.createReadIt(dto);

        expect(service.createReadIt).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  // ==================== LISTENING ENDPOINTS ====================

  describe('LISTENING Endpoints', () => {
    describe('createWordMatch', () => {
      it('should call service method with correct DTO', async () => {
        const dto = {
          challengeId: 'test-id',
          type: 'word_match',
          options: ['Ocean', 'Mountain'],
          answer: 'Ocean',
        } as any;

        const expectedResult = { id: 'question-10', ...dto };
        mockQuestionsService.createWordMatch.mockResolvedValue(expectedResult);

        const result = await controller.createWordMatch(dto);

        expect(service.createWordMatch).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createGossip', () => {
      it('should call service method with correct DTO', async () => {
        const dto = {
          challengeId: 'test-id',
          type: 'gossip',
          answer: 'Transcription text',
        } as any;

        const expectedResult = { id: 'question-11', ...dto };
        mockQuestionsService.createGossip.mockResolvedValue(expectedResult);

        const result = await controller.createGossip(dto);

        expect(service.createGossip).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createTopicBasedAudio', () => {
      it('should call service method with correct DTO', async () => {
        const dto = {
          challengeId: 'test-id',
          type: 'topic_based_audio',
          subQuestions: [
            { text: 'Question?', options: [], answer: 'A' },
          ],
        } as any;

        const expectedResult = { id: 'question-12', ...dto };
        mockQuestionsService.createTopicBasedAudio.mockResolvedValue(
          expectedResult,
        );

        const result = await controller.createTopicBasedAudio(dto);

        expect(service.createTopicBasedAudio).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createLyricsTraining', () => {
      it('should call service method with correct DTO', async () => {
        const dto = {
          challengeId: 'test-id',
          type: 'lyrics_training',
          options: ['light', 'dark'],
          answer: 'dark',
        } as any;

        const expectedResult = { id: 'question-13', ...dto };
        mockQuestionsService.createLyricsTraining.mockResolvedValue(
          expectedResult,
        );

        const result = await controller.createLyricsTraining(dto);

        expect(service.createLyricsTraining).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  // ==================== WRITING ENDPOINTS ====================

  describe('WRITING Endpoints', () => {
    describe('createSentenceMaker', () => {
      it('should call service method with correct DTO', async () => {
        const dto = {
          challengeId: 'test-id',
          type: 'sentence_maker',
        } as any;

        const expectedResult = { id: 'question-14', ...dto };
        mockQuestionsService.createSentenceMaker.mockResolvedValue(
          expectedResult,
        );

        const result = await controller.createSentenceMaker(dto);

        expect(service.createSentenceMaker).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createFastTest', () => {
      it('should call service method with correct DTO', async () => {
        const dto = {
          challengeId: 'test-id',
          type: 'fast_test',
          content: ['I enjoy', 'to the beach'],
          options: ['going', 'go'],
          answer: 'going',
        } as any;

        const expectedResult = { id: 'question-15', ...dto };
        mockQuestionsService.createFastTest.mockResolvedValue(expectedResult);

        const result = await controller.createFastTest(dto);

        expect(service.createFastTest).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createTales', () => {
      it('should call service method with correct DTO', async () => {
        const dto = {
          challengeId: 'test-id',
          type: 'tales',
        } as any;

        const expectedResult = { id: 'question-16', ...dto };
        mockQuestionsService.createTales.mockResolvedValue(expectedResult);

        const result = await controller.createTales(dto);

        expect(service.createTales).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  // ==================== SPEAKING ENDPOINTS ====================

  describe('SPEAKING Endpoints', () => {
    describe('createSuperbrain', () => {
      it('should call service method with correct DTO', async () => {
        const dto = {
          challengeId: 'test-id',
          type: 'superbrain',
          content: 'What do bees make?',
        } as any;

        const expectedResult = { id: 'question-17', ...dto };
        mockQuestionsService.createSuperbrain.mockResolvedValue(expectedResult);

        const result = await controller.createSuperbrain(dto);

        expect(service.createSuperbrain).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createTellMeAboutIt', () => {
      it('should call service method with correct DTO', async () => {
        const dto = {
          challengeId: 'test-id',
          type: 'tell_me_about_it',
          content: 'your first toy',
        } as any;

        const expectedResult = { id: 'question-18', ...dto };
        mockQuestionsService.createTellMeAboutIt.mockResolvedValue(
          expectedResult,
        );

        const result = await controller.createTellMeAboutIt(dto);

        expect(service.createTellMeAboutIt).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
      });
    });

    describe('createDebate', () => {
      it('should call service method with correct DTO', async () => {
        const dto = {
          challengeId: 'test-id',
          type: 'debate',
          content: 'Bubble gum',
          configuration: { stanceOptions: ['support', 'oppose'] },
        } as any;

        const expectedResult = { id: 'question-19', ...dto };
        mockQuestionsService.createDebate.mockResolvedValue(expectedResult);

        const result = await controller.createDebate(dto);

        expect(service.createDebate).toHaveBeenCalledWith(dto);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  // ==================== QUERY ENDPOINTS ====================

  describe('Query Endpoints', () => {
    describe('findAll', () => {
      it('should call service findAll without filters', async () => {
        const mockQuestions = [
          { id: '1', type: 'unscramble' },
          { id: '2', type: 'wordbox' },
        ];
        mockQuestionsService.findAll.mockResolvedValue(mockQuestions);

        const result = await controller.findAll();

        expect(service.findAll).toHaveBeenCalledWith({
          challengeId: undefined,
          stage: undefined,
          phase: undefined,
        });
        expect(result).toEqual(mockQuestions);
      });

      it('should call service findAll with challengeId filter', async () => {
        const mockQuestions = [{ id: '1', challengeId: 'challenge-123' }];
        mockQuestionsService.findAll.mockResolvedValue(mockQuestions);

        const result = await controller.findAll('challenge-123');

        expect(service.findAll).toHaveBeenCalledWith({
          challengeId: 'challenge-123',
          stage: undefined,
          phase: undefined,
        });
        expect(result).toEqual(mockQuestions);
      });

      it('should call service findAll with stage filter', async () => {
        const mockQuestions = [{ id: '1', stage: 'VOCABULARY' }];
        mockQuestionsService.findAll.mockResolvedValue(mockQuestions);

        const result = await controller.findAll(
          undefined,
          QuestionStage.VOCABULARY,
        );

        expect(service.findAll).toHaveBeenCalledWith({
          challengeId: undefined,
          stage: QuestionStage.VOCABULARY,
          phase: undefined,
        });
        expect(result).toEqual(mockQuestions);
      });

      it('should call service findAll with phase filter', async () => {
        const mockQuestions = [{ id: '1', phase: 'phase_1_1' }];
        mockQuestionsService.findAll.mockResolvedValue(mockQuestions);

        const result = await controller.findAll(undefined, undefined, 'phase_1_1');

        expect(service.findAll).toHaveBeenCalledWith({
          challengeId: undefined,
          stage: undefined,
          phase: 'phase_1_1',
        });
        expect(result).toEqual(mockQuestions);
      });

      it('should call service findAll with multiple filters', async () => {
        const mockQuestions = [
          {
            id: '1',
            challengeId: 'challenge-123',
            stage: 'VOCABULARY',
            phase: 'phase_1_1',
          },
        ];
        mockQuestionsService.findAll.mockResolvedValue(mockQuestions);

        const result = await controller.findAll(
          'challenge-123',
          QuestionStage.VOCABULARY,
          'phase_1_1',
        );

        expect(service.findAll).toHaveBeenCalledWith({
          challengeId: 'challenge-123',
          stage: QuestionStage.VOCABULARY,
          phase: 'phase_1_1',
        });
        expect(result).toEqual(mockQuestions);
      });
    });

    describe('findOne', () => {
      it('should call service findOne with question ID', async () => {
        const mockQuestion = { id: 'question-123', type: 'unscramble' };
        mockQuestionsService.findOne.mockResolvedValue(mockQuestion);

        const result = await controller.findOne('question-123');

        expect(service.findOne).toHaveBeenCalledWith('question-123');
        expect(result).toEqual(mockQuestion);
      });
    });

    describe('getSchoolStats', () => {
      it('should call service getSchoolStats with school ID', async () => {
        const mockStats = [
          {
            questionId: 'q1',
            totalAttempts: 100,
            correctAnswers: 80,
            successRate: 80,
          },
        ];
        mockQuestionsService.getSchoolStats.mockResolvedValue(mockStats);

        const result = await controller.getSchoolStats('school-123');

        expect(service.getSchoolStats).toHaveBeenCalledWith(
          'school-123',
          undefined,
        );
        expect(result).toEqual(mockStats);
      });

      it('should call service getSchoolStats with school ID and question ID', async () => {
        const mockStats = [
          {
            questionId: 'q1',
            totalAttempts: 50,
            correctAnswers: 45,
            successRate: 90,
          },
        ];
        mockQuestionsService.getSchoolStats.mockResolvedValue(mockStats);

        const result = await controller.getSchoolStats('school-123', 'q1');

        expect(service.getSchoolStats).toHaveBeenCalledWith('school-123', 'q1');
        expect(result).toEqual(mockStats);
      });
    });
  });

  // ==================== ERROR HANDLING ====================

  describe('Error Handling', () => {
    it('should propagate service errors', async () => {
      const error = new Error('Service error');
      mockQuestionsService.createUnscramble.mockRejectedValue(error);

      await expect(
        controller.createUnscramble({} as any),
      ).rejects.toThrow('Service error');
    });

    it('should handle findOne not found', async () => {
      const error = new Error('Question not found');
      mockQuestionsService.findOne.mockRejectedValue(error);

      await expect(controller.findOne('non-existent')).rejects.toThrow(
        'Question not found',
      );
    });
  });
});

