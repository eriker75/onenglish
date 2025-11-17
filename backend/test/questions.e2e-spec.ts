import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { TestDataFactory } from './utils/test-data-factory';
import { QuestionDtoFactory, loadFixture } from './utils/test-helpers';

describe('Questions (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let testFactory: TestDataFactory;
  let authToken: string;
  let challengeId: string;
  let schoolId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    testFactory = new TestDataFactory(app);

    // Setup test data
    const env = await testFactory.setupCompleteEnvironment();
    authToken = env.token;
    challengeId = env.challenge.id;
    schoolId = env.school.id;

    console.log('✅ Test environment setup complete');
  });

  afterAll(async () => {
    await testFactory.cleanup();
    await app.close();
    console.log('✅ Test cleanup complete');
  });

  // ==================== VOCABULARY QUESTIONS TESTS ====================

  describe('VOCABULARY Questions', () => {
    describe('POST /questions/create/image_to_multiple_choices', () => {
      it('should create question with default AUTO validation method', async () => {
        const dto = QuestionDtoFactory.imageToMultipleChoices({ challengeId });
        const mediaFile = loadFixture('test-image.png');

        const response = await request(app.getHttpServer())
          .post('/questions/create/image_to_multiple_choices')
          .set('Authorization', `Bearer ${authToken}`)
          .field('challengeId', dto.challengeId)
          .field('stage', dto.stage)
          .field('phase', dto.phase)
          .field('position', dto.position)
          .field('type', dto.type)
          .field('points', dto.points)
          .field('timeLimit', dto.timeLimit)
          .field('maxAttempts', dto.maxAttempts)
          .field('text', dto.text)
          .field('instructions', dto.instructions)
          .field('options', dto.options)
          .field('answer', dto.answer)
          .attach('media', mediaFile);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.type).toBe('image_to_multiple_choices');
        expect(response.body.validationMethod).toBe('AUTO');
        expect(response.body.points).toBe(dto.points);

        // Verify in database
        const questionInDb = await prisma.question.findUnique({
          where: { id: response.body.id },
          include: { questionMedia: true },
        });

        expect(questionInDb).toBeDefined();
        expect(questionInDb!.validationMethod).toBe('AUTO');
        expect(questionInDb!.questionMedia).toHaveLength(1);

        testFactory.trackQuestion(response.body.id);
      });

      it('should allow overriding validation method to IA', async () => {
        const dto = QuestionDtoFactory.imageToMultipleChoices({
          challengeId,
          position: 2,
        });
        const mediaFile = loadFixture('test-image.png');

        const response = await request(app.getHttpServer())
          .post('/questions/create/image_to_multiple_choices')
          .set('Authorization', `Bearer ${authToken}`)
          .field('challengeId', dto.challengeId)
          .field('stage', dto.stage)
          .field('phase', dto.phase)
          .field('position', dto.position)
          .field('type', dto.type)
          .field('points', dto.points)
          .field('validationMethod', 'IA')
          .field('text', dto.text)
          .field('instructions', dto.instructions)
          .field('options', dto.options)
          .field('answer', dto.answer)
          .attach('media', mediaFile);

        expect(response.status).toBe(201);
        expect(response.body.validationMethod).toBe('IA');

        testFactory.trackQuestion(response.body.id);
      });

      it('should fail with invalid answer not in options', async () => {
        const dto = QuestionDtoFactory.imageToMultipleChoices({
          challengeId,
          position: 3,
          answer: 'InvalidAnswer',
        });
        const mediaFile = loadFixture('test-image.png');

        const response = await request(app.getHttpServer())
          .post('/questions/create/image_to_multiple_choices')
          .set('Authorization', `Bearer ${authToken}`)
          .field('challengeId', dto.challengeId)
          .field('stage', dto.stage)
          .field('phase', dto.phase)
          .field('position', dto.position)
          .field('type', dto.type)
          .field('points', dto.points)
          .field('text', dto.text)
          .field('instructions', dto.instructions)
          .field('options', dto.options)
          .field('answer', dto.answer)
          .attach('media', mediaFile);

        expect(response.status).toBe(400);
      });

      it('should fail without authentication', async () => {
        const dto = QuestionDtoFactory.imageToMultipleChoices({ challengeId });
        const mediaFile = loadFixture('test-image.png');

        const response = await request(app.getHttpServer())
          .post('/questions/create/image_to_multiple_choices')
          .field('challengeId', dto.challengeId)
          .field('type', dto.type)
          .attach('media', mediaFile);

        expect([401, 403]).toContain(response.status);
      });
    });

    describe('POST /questions/create/wordbox', () => {
      it('should create question with default IA validation method', async () => {
        const dto = QuestionDtoFactory.wordbox({ challengeId, position: 10 });

        const response = await request(app.getHttpServer())
          .post('/questions/create/wordbox')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            ...dto,
            content: JSON.parse(dto.content),
            configuration: JSON.parse(dto.configuration),
          });

        expect(response.status).toBe(201);
        expect(response.body.type).toBe('wordbox');
        expect(response.body.validationMethod).toBe('IA');

        // Verify in database
        const questionInDb = await prisma.question.findUnique({
          where: { id: response.body.id },
        });

        expect(questionInDb).toBeDefined();
        expect(questionInDb!.validationMethod).toBe('IA');
        expect(questionInDb!.content).toBeDefined();

        testFactory.trackQuestion(response.body.id);
      });

      it('should validate grid consistency', async () => {
        const dto = QuestionDtoFactory.wordbox({ challengeId, position: 11 });

        const response = await request(app.getHttpServer())
          .post('/questions/create/wordbox')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            ...dto,
            content: [
              ['A', 'B', 'C'],
              ['D', 'E'], // Inconsistent row length
            ],
            configuration: JSON.parse(dto.configuration),
          });

        expect(response.status).toBe(400);
      });
    });

    describe('POST /questions/create/spelling', () => {
      it('should create question with image and default IA validation', async () => {
        const dto = QuestionDtoFactory.spelling({ challengeId, position: 20 });
        const mediaFile = loadFixture('test-image.png');

        const response = await request(app.getHttpServer())
          .post('/questions/create/spelling')
          .set('Authorization', `Bearer ${authToken}`)
          .field('challengeId', dto.challengeId)
          .field('stage', dto.stage)
          .field('phase', dto.phase)
          .field('position', dto.position)
          .field('type', dto.type)
          .field('points', dto.points)
          .field('text', dto.text)
          .field('instructions', dto.instructions)
          .field('answer', dto.answer)
          .attach('media', mediaFile);

        expect(response.status).toBe(201);
        expect(response.body.validationMethod).toBe('IA');
        expect(response.body.answer).toBe(dto.answer);

        // Verify media uploaded
        const questionInDb = await prisma.question.findUnique({
          where: { id: response.body.id },
          include: { questionMedia: true },
        });

        expect(questionInDb!.questionMedia).toHaveLength(1);

        testFactory.trackQuestion(response.body.id);
      });
    });

    describe('POST /questions/create/word_associations', () => {
      it('should create question with configuration and default IA validation', async () => {
        const dto = QuestionDtoFactory.wordAssociations({
          challengeId,
          position: 30,
        });

        const response = await request(app.getHttpServer())
          .post('/questions/create/word_associations')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            ...dto,
            configuration: JSON.parse(dto.configuration),
          });

        expect(response.status).toBe(201);
        expect(response.body.validationMethod).toBe('IA');

        // Verify content and configuration in database
        const questionInDb = await prisma.question.findUnique({
          where: { id: response.body.id },
          include: { configurations: true },
        });

        expect(questionInDb).toBeDefined();
        expect(questionInDb!.validationMethod).toBe('IA');
        expect(questionInDb!.content).toBe(dto.content);

        testFactory.trackQuestion(response.body.id);
      });
    });
  });

  // ==================== GRAMMAR QUESTIONS TESTS ====================

  describe('GRAMMAR Questions', () => {
    describe('POST /questions/create/unscramble', () => {
      it('should create question with default AUTO validation method', async () => {
        const dto = QuestionDtoFactory.unscramble({
          challengeId,
          position: 40,
        });

        const response = await request(app.getHttpServer())
          .post('/questions/create/unscramble')
          .set('Authorization', `Bearer ${authToken}`)
          .send(dto);

        expect(response.status).toBe(201);
        expect(response.body.type).toBe('unscramble');
        expect(response.body.validationMethod).toBe('AUTO');

        testFactory.trackQuestion(response.body.id);
      });

      it('should store content array correctly', async () => {
        const dto = QuestionDtoFactory.unscramble({
          challengeId,
          position: 41,
        });

        const response = await request(app.getHttpServer())
          .post('/questions/create/unscramble')
          .set('Authorization', `Bearer ${authToken}`)
          .send(dto);

        expect(response.status).toBe(201);
        expect(response.body.content).toEqual(dto.content);

        testFactory.trackQuestion(response.body.id);
      });
    });

    describe('POST /questions/create/tenses', () => {
      it('should create question with tense options and default AUTO validation', async () => {
        const dto = QuestionDtoFactory.tenses({ challengeId, position: 50 });

        const response = await request(app.getHttpServer())
          .post('/questions/create/tenses')
          .set('Authorization', `Bearer ${authToken}`)
          .send(dto);

        expect(response.status).toBe(201);
        expect(response.body.validationMethod).toBe('AUTO');
        expect(response.body.options).toEqual(dto.options);

        testFactory.trackQuestion(response.body.id);
      });
    });

    describe('POST /questions/create/tag_it', () => {
      it('should create question with content array and default AUTO validation', async () => {
        const dto = QuestionDtoFactory.tagIt({ challengeId, position: 60 });

        const response = await request(app.getHttpServer())
          .post('/questions/create/tag_it')
          .set('Authorization', `Bearer ${authToken}`)
          .send(dto);

        expect(response.status).toBe(201);
        expect(response.body.validationMethod).toBe('AUTO');
        expect(response.body.content).toEqual(dto.content);

        testFactory.trackQuestion(response.body.id);
      });
    });

    describe('POST /questions/create/report_it', () => {
      it('should create question with string content and default IA validation', async () => {
        const dto = QuestionDtoFactory.reportIt({ challengeId, position: 70 });

        const response = await request(app.getHttpServer())
          .post('/questions/create/report_it')
          .set('Authorization', `Bearer ${authToken}`)
          .send(dto);

        expect(response.status).toBe(201);
        expect(response.body.validationMethod).toBe('IA');
        expect(response.body.content).toBe(dto.content);

        testFactory.trackQuestion(response.body.id);
      });
    });

    describe('POST /questions/create/read_it', () => {
      it('should create question with sub-questions and default AUTO validation', async () => {
        const dto = QuestionDtoFactory.readIt({ challengeId, position: 80 });

        const response = await request(app.getHttpServer())
          .post('/questions/create/read_it')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            ...dto,
            content: JSON.parse(dto.content),
            subQuestions: JSON.parse(dto.subQuestions),
          });

        expect(response.status).toBe(201);
        expect(response.body.validationMethod).toBe('AUTO');

        // Verify sub-questions were created
        const questionInDb = await prisma.question.findUnique({
          where: { id: response.body.id },
          include: { subQuestions: true },
        });

        expect(questionInDb!.subQuestions.length).toBeGreaterThan(0);

        testFactory.trackQuestion(response.body.id);
      });

      it('should validate sub-questions structure', async () => {
        const dto = QuestionDtoFactory.readIt({ challengeId, position: 81 });

        const response = await request(app.getHttpServer())
          .post('/questions/create/read_it')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            ...dto,
            content: JSON.parse(dto.content),
            subQuestions: [], // Empty sub-questions should fail
          });

        expect(response.status).toBe(400);
      });
    });
  });

  // ==================== LISTENING QUESTIONS TESTS ====================

  describe('LISTENING Questions', () => {
    describe('POST /questions/create/word_match', () => {
      it('should create question with audio and default AUTO validation', async () => {
        const dto = QuestionDtoFactory.wordMatch({ challengeId, position: 90 });
        const mediaFile = loadFixture('test-audio.mp3');

        const response = await request(app.getHttpServer())
          .post('/questions/create/word_match')
          .set('Authorization', `Bearer ${authToken}`)
          .field('challengeId', dto.challengeId)
          .field('stage', dto.stage)
          .field('phase', dto.phase)
          .field('position', dto.position)
          .field('type', dto.type)
          .field('points', dto.points)
          .field('text', dto.text)
          .field('instructions', dto.instructions)
          .field('options', JSON.stringify(dto.options))
          .field('answer', dto.answer)
          .attach('media', mediaFile);

        expect(response.status).toBe(201);
        expect(response.body.validationMethod).toBe('AUTO');

        // Verify audio was uploaded
        const questionInDb = await prisma.question.findUnique({
          where: { id: response.body.id },
          include: { questionMedia: true },
        });

        expect(questionInDb!.questionMedia).toHaveLength(1);

        testFactory.trackQuestion(response.body.id);
      });
    });

    describe('POST /questions/create/gossip', () => {
      it('should create transcription question with audio and default IA validation', async () => {
        const dto = QuestionDtoFactory.gossip({ challengeId, position: 100 });
        const mediaFile = loadFixture('test-audio.mp3');

        const response = await request(app.getHttpServer())
          .post('/questions/create/gossip')
          .set('Authorization', `Bearer ${authToken}`)
          .field('challengeId', dto.challengeId)
          .field('stage', dto.stage)
          .field('phase', dto.phase)
          .field('position', dto.position)
          .field('type', dto.type)
          .field('points', dto.points)
          .field('text', dto.text)
          .field('instructions', dto.instructions)
          .field('answer', dto.answer)
          .attach('media', mediaFile);

        expect(response.status).toBe(201);
        expect(response.body.validationMethod).toBe('IA');
        expect(response.body.answer).toBe(dto.answer);

        testFactory.trackQuestion(response.body.id);
      });
    });

    describe('POST /questions/create/topic_based_audio', () => {
      it('should create question with audio and sub-questions with default AUTO validation', async () => {
        const dto = QuestionDtoFactory.topicBasedAudio({
          challengeId,
          position: 110,
        });
        const mediaFile = loadFixture('test-audio.mp3');

        const response = await request(app.getHttpServer())
          .post('/questions/create/topic_based_audio')
          .set('Authorization', `Bearer ${authToken}`)
          .field('challengeId', dto.challengeId)
          .field('stage', dto.stage)
          .field('phase', dto.phase)
          .field('position', dto.position)
          .field('type', dto.type)
          .field('points', dto.points)
          .field('text', dto.text)
          .field('instructions', dto.instructions)
          .field('subQuestions', JSON.stringify(dto.subQuestions))
          .attach('media', mediaFile);

        expect(response.status).toBe(201);
        expect(response.body.validationMethod).toBe('AUTO');

        // Verify sub-questions
        const questionInDb = await prisma.question.findUnique({
          where: { id: response.body.id },
          include: { subQuestions: true, questionMedia: true },
        });

        expect(questionInDb!.subQuestions.length).toBeGreaterThan(0);
        expect(questionInDb!.questionMedia).toHaveLength(1);

        testFactory.trackQuestion(response.body.id);
      });
    });

    describe('POST /questions/create/lyrics_training', () => {
      it('should create question with video and default AUTO validation', async () => {
        const dto = QuestionDtoFactory.lyricsTraining({
          challengeId,
          position: 120,
        });
        const mediaFile = loadFixture('test-video.mp4');

        const response = await request(app.getHttpServer())
          .post('/questions/create/lyrics_training')
          .set('Authorization', `Bearer ${authToken}`)
          .field('challengeId', dto.challengeId)
          .field('stage', dto.stage)
          .field('phase', dto.phase)
          .field('position', dto.position)
          .field('type', dto.type)
          .field('points', dto.points)
          .field('text', dto.text)
          .field('instructions', dto.instructions)
          .field('options', JSON.stringify(dto.options))
          .field('answer', dto.answer)
          .attach('media', mediaFile);

        expect(response.status).toBe(201);
        expect(response.body.validationMethod).toBe('AUTO');

        // Verify video was uploaded
        const questionInDb = await prisma.question.findUnique({
          where: { id: response.body.id },
          include: { questionMedia: true },
        });

        expect(questionInDb!.questionMedia).toHaveLength(1);

        testFactory.trackQuestion(response.body.id);
      });
    });
  });

  // ==================== WRITING QUESTIONS TESTS ====================

  describe('WRITING Questions', () => {
    describe('POST /questions/create/sentence_maker', () => {
      it('should create question with multiple images and default IA validation', async () => {
        const dto = QuestionDtoFactory.sentenceMaker({
          challengeId,
          position: 130,
        });
        const mediaFile1 = loadFixture('test-image.png');
        const mediaFile2 = loadFixture('test-image.png');

        const response = await request(app.getHttpServer())
          .post('/questions/create/sentence_maker')
          .set('Authorization', `Bearer ${authToken}`)
          .field('challengeId', dto.challengeId)
          .field('stage', dto.stage)
          .field('phase', dto.phase)
          .field('position', dto.position)
          .field('type', dto.type)
          .field('points', dto.points)
          .field('text', dto.text)
          .field('instructions', dto.instructions)
          .attach('media1', mediaFile1)
          .attach('media2', mediaFile2);

        expect(response.status).toBe(201);
        expect(response.body.validationMethod).toBe('IA');

        // Verify multiple images uploaded
        const questionInDb = await prisma.question.findUnique({
          where: { id: response.body.id },
          include: { questionMedia: true },
        });

        expect(questionInDb!.questionMedia.length).toBeGreaterThanOrEqual(2);

        testFactory.trackQuestion(response.body.id);
      });
    });

    describe('POST /questions/create/fast_test', () => {
      it('should create question with gaps and default AUTO validation', async () => {
        const dto = QuestionDtoFactory.fastTest({ challengeId, position: 140 });

        const response = await request(app.getHttpServer())
          .post('/questions/create/fast_test')
          .set('Authorization', `Bearer ${authToken}`)
          .send(dto);

        expect(response.status).toBe(201);
        expect(response.body.validationMethod).toBe('AUTO');
        expect(response.body.content).toEqual(dto.content);
        expect(response.body.options).toEqual(dto.options);

        testFactory.trackQuestion(response.body.id);
      });
    });

    describe('POST /questions/create/tales', () => {
      it('should create story writing question with image and default IA validation', async () => {
        const dto = QuestionDtoFactory.tales({ challengeId, position: 150 });
        const mediaFile = loadFixture('test-image.png');

        const response = await request(app.getHttpServer())
          .post('/questions/create/tales')
          .set('Authorization', `Bearer ${authToken}`)
          .field('challengeId', dto.challengeId)
          .field('stage', dto.stage)
          .field('phase', dto.phase)
          .field('position', dto.position)
          .field('type', dto.type)
          .field('points', dto.points)
          .field('text', dto.text)
          .field('instructions', dto.instructions)
          .attach('media', mediaFile);

        expect(response.status).toBe(201);
        expect(response.body.validationMethod).toBe('IA');

        testFactory.trackQuestion(response.body.id);
      });
    });
  });

  // ==================== SPEAKING QUESTIONS TESTS ====================

  describe('SPEAKING Questions', () => {
    describe('POST /questions/create/superbrain', () => {
      it('should create question with prompt and default IA validation', async () => {
        const dto = QuestionDtoFactory.superbrain({
          challengeId,
          position: 160,
        });

        const response = await request(app.getHttpServer())
          .post('/questions/create/superbrain')
          .set('Authorization', `Bearer ${authToken}`)
          .send(dto);

        expect(response.status).toBe(201);
        expect(response.body.validationMethod).toBe('IA');
        expect(response.body.content).toBe(dto.content);

        testFactory.trackQuestion(response.body.id);
      });
    });

    describe('POST /questions/create/tell_me_about_it', () => {
      it('should create story question with default IA validation', async () => {
        const dto = QuestionDtoFactory.tellMeAboutIt({
          challengeId,
          position: 170,
        });

        const response = await request(app.getHttpServer())
          .post('/questions/create/tell_me_about_it')
          .set('Authorization', `Bearer ${authToken}`)
          .send(dto);

        expect(response.status).toBe(201);
        expect(response.body.validationMethod).toBe('IA');
        expect(response.body.content).toBe(dto.content);

        testFactory.trackQuestion(response.body.id);
      });
    });

    describe('POST /questions/create/debate', () => {
      it('should create debate question with configuration and default IA validation', async () => {
        const dto = QuestionDtoFactory.debate({ challengeId, position: 180 });

        const response = await request(app.getHttpServer())
          .post('/questions/create/debate')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            ...dto,
            configuration: JSON.parse(dto.configuration),
          });

        expect(response.status).toBe(201);
        expect(response.body.validationMethod).toBe('IA');

        // Verify content in database
        const questionInDb = await prisma.question.findUnique({
          where: { id: response.body.id },
        });
        expect(questionInDb).toBeDefined();
        expect(questionInDb!.content).toBe(dto.content);

        testFactory.trackQuestion(response.body.id);
      });
    });
  });

  // ==================== ERROR CASES ====================

  describe('Error Handling', () => {
    it('should fail with invalid challengeId', async () => {
      const dto = QuestionDtoFactory.unscramble({
        challengeId: 'invalid-challenge-id',
        position: 200,
      });

      const response = await request(app.getHttpServer())
        .post('/questions/create/unscramble')
        .set('Authorization', `Bearer ${authToken}`)
        .send(dto);

      expect([400, 404]).toContain(response.status);
    });

    it('should fail without required fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/questions/create/unscramble')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          type: 'unscramble',
          // Missing required fields
        });

      expect(response.status).toBe(400);
    });

    it('should fail with negative points', async () => {
      const dto = QuestionDtoFactory.unscramble({
        challengeId,
        points: -10,
        position: 201,
      });

      const response = await request(app.getHttpServer())
        .post('/questions/create/unscramble')
        .set('Authorization', `Bearer ${authToken}`)
        .send(dto);

      expect(response.status).toBe(400);
    });

    it('should fail with invalid position', async () => {
      const dto = QuestionDtoFactory.unscramble({
        challengeId,
        position: 0, // Position must be >= 1
      });

      const response = await request(app.getHttpServer())
        .post('/questions/create/unscramble')
        .set('Authorization', `Bearer ${authToken}`)
        .send(dto);

      expect(response.status).toBe(400);
    });

    it('should fail with invalid stage', async () => {
      const dto = QuestionDtoFactory.unscramble({
        challengeId,
        position: 202,
      });

      const response = await request(app.getHttpServer())
        .post('/questions/create/unscramble')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          ...dto,
          stage: 'INVALID_STAGE',
        });

      expect(response.status).toBe(400);
    });
  });

  // ==================== INTEGRATION TESTS ====================

  describe('Integration Tests', () => {
    it('should retrieve created question by ID', async () => {
      const dto = QuestionDtoFactory.unscramble({ challengeId, position: 300 });

      const createResponse = await request(app.getHttpServer())
        .post('/questions/create/unscramble')
        .set('Authorization', `Bearer ${authToken}`)
        .send(dto);

      expect(createResponse.status).toBe(201);
      const questionId = createResponse.body.id;

      const getResponse = await request(app.getHttpServer())
        .get(`/questions/${questionId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.id).toBe(questionId);
      expect(getResponse.body.type).toBe('unscramble');

      testFactory.trackQuestion(questionId);
    });

    it('should filter questions by challengeId', async () => {
      const dto1 = QuestionDtoFactory.unscramble({
        challengeId,
        position: 301,
      });
      const dto2 = QuestionDtoFactory.tagIt({ challengeId, position: 302 });

      await request(app.getHttpServer())
        .post('/questions/create/unscramble')
        .set('Authorization', `Bearer ${authToken}`)
        .send(dto1);

      await request(app.getHttpServer())
        .post('/questions/create/tag_it')
        .set('Authorization', `Bearer ${authToken}`)
        .send(dto2);

      const response = await request(app.getHttpServer())
        .get(`/questions?challengeId=${challengeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it('should filter questions by stage', async () => {
      const response = await request(app.getHttpServer())
        .get(`/questions?stage=GRAMMAR`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0].stage).toBe('GRAMMAR');
      }
    });
  });
});
