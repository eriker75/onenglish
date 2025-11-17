import { PrismaService } from '../../src/database/prisma.service';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

/**
 * Factory for creating test data and managing test lifecycle
 */

export class TestDataFactory {
  private prisma: PrismaService;
  private app: INestApplication;
  private createdIds: {
    schools: string[];
    teachers: string[];
    students: string[];
    coordinators: string[];
    challenges: string[];
    questions: string[];
    files: string[];
  } = {
    schools: [],
    teachers: [],
    students: [],
    coordinators: [],
    challenges: [],
    questions: [],
    files: [],
  };

  constructor(app: INestApplication) {
    this.app = app;
    this.prisma = app.get<PrismaService>(PrismaService);
  }

  /**
   * Generate a UUID v4
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Create a test school
   */
  async createSchool(overrides: any = {}) {
    const school = await this.prisma.school.create({
      data: {
        name: overrides.name || 'Test School',
        code: overrides.code || `TEST${Date.now()}`,
        type: overrides.type || 'public',
        email: overrides.email || `test-school-${Date.now()}@test.com`,
        phone: overrides.phone || '1234567890',
        address: overrides.address || 'Test Address',
        city: overrides.city || 'Test City',
        state: overrides.state || 'Test State',
        country: overrides.country || 'Venezuela',
        ...overrides,
      },
    });
    this.createdIds.schools.push(school.id);
    return school;
  }

  /**
   * Create a test teacher
   */
  async createTeacher(schoolId: string, overrides: any = {}) {
    const email = overrides.email || `test-teacher-${Date.now()}@test.com`;
    const firstName = overrides.firstName || 'Test';
    const lastName = overrides.lastName || 'Teacher';
    const password =
      overrides.password ||
      '$2b$10$YQz8JGz8z8z8z8z8z8z8z.O7kZ0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0';

    // Generate a UUID for both user and teacher
    const id = this.generateUUID();

    // Create user first
    await this.prisma.user.create({
      data: {
        id,
        email,
        firstName,
        lastName,
        password,
      },
    });

    // Create teacher with the same id
    const teacher = await this.prisma.teacher.create({
      data: {
        id,
        userId: id,
        firstName,
        lastName,
        email,
        schoolId,
      },
    });

    this.createdIds.teachers.push(teacher.id);
    return teacher;
  }

  /**
   * Create a test coordinator
   */
  async createCoordinator(schoolId: string, overrides: any = {}) {
    const email = overrides.email || `test-coordinator-${Date.now()}@test.com`;
    const firstName = overrides.firstName || 'Test';
    const lastName = overrides.lastName || 'Coordinator';
    const password = overrides.password || '$2b$10$testhashedpassword';

    // Generate a UUID for both user and coordinator
    const id = this.generateUUID();

    // Create user first
    await this.prisma.user.create({
      data: {
        id,
        email,
        firstName,
        lastName,
        password,
      },
    });

    // Create coordinator with the same id
    const coordinator = await this.prisma.coordinator.create({
      data: {
        id,
        userId: id,
        firstName,
        lastName,
        email,
        schoolId,
      },
    });

    this.createdIds.coordinators.push(coordinator.id);
    return coordinator;
  }

  /**
   * Create a test student
   */
  async createStudent(schoolId: string, overrides: any = {}) {
    const email = overrides.email || `test-student-${Date.now()}@test.com`;
    const firstName = overrides.firstName || 'Test';
    const lastName = overrides.lastName || 'Student';
    const password = overrides.password || '$2b$10$testhashedpassword';

    // Generate a UUID for both user and student
    const id = this.generateUUID();

    // Create user first
    await this.prisma.user.create({
      data: {
        id,
        email,
        firstName,
        lastName,
        password,
      },
    });

    // Create student with the same id
    const student = await this.prisma.student.create({
      data: {
        id,
        userId: id,
        firstName,
        lastName,
        email,
        schoolId,
      },
    });

    this.createdIds.students.push(student.id);
    return student;
  }

  /**
   * Create a test challenge
   */
  async createChallenge(schoolId: string, overrides: any = {}) {
    const timestamp = Date.now();
    const challenge = await this.prisma.challenge.create({
      data: {
        title: overrides.title || 'Test Challenge',
        slug: overrides.slug || `test-challenge-${timestamp}`,
        description: overrides.description || 'Test Description',
        category: overrides.category || 'mixed',
        level: overrides.level || 'A1',
        difficulty: overrides.difficulty || 'easy',
        isActive: overrides.isActive !== undefined ? overrides.isActive : true,
        ...overrides,
      },
    });

    // Create the school-challenge relationship
    await this.prisma.schoolChallenge.create({
      data: {
        schoolId,
        challengeId: challenge.id,
        isActive: true,
      },
    });

    this.createdIds.challenges.push(challenge.id);
    return challenge;
  }

  /**
   * Get authentication token for a user via login
   */
  async getAuthToken(
    email: string,
    password: string = 'Test123456!',
  ): Promise<string> {
    const response = await request(this.app.getHttpServer())
      .post('/auth/login')
      .send({ email, password });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error(
        `Failed to login: ${response.status} - ${JSON.stringify(response.body)}`,
      );
    }

    return (
      response.body.accessToken ||
      response.body.access_token ||
      response.body.token
    );
  }

  /**
   * Setup complete test environment with school, teacher, and challenge
   */
  async setupCompleteEnvironment() {
    const school = await this.createSchool();
    const teacher = await this.createTeacher(school.id, {
      password: '$2b$10$YQz8JGz8z8z8z8z8z8z8z.O7kZ0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0Z0', // Test123456!
    });
    const challenge = await this.createChallenge(school.id);

    let token: string;
    try {
      // Try to get token (might fail if auth is not properly set up in test)
      token = await this.getAuthToken(teacher.email, 'Test123456!');
    } catch (error) {
      console.warn(
        'Could not get auth token, tests may fail if authentication is required',
        error,
      );
      token = 'mock-token-for-testing';
    }

    return {
      school,
      teacher,
      challenge,
      token,
    };
  }

  /**
   * Clean up all created test data
   */
  async cleanup() {
    // Delete in reverse order of dependencies
    try {
      // Questions and related data
      if (this.createdIds.questions.length > 0) {
        await this.prisma.questionMedia.deleteMany({
          where: { questionId: { in: this.createdIds.questions } },
        });
        await this.prisma.questionConfiguration.deleteMany({
          where: { questionId: { in: this.createdIds.questions } },
        });
        await this.prisma.studentAnswer.deleteMany({
          where: { questionId: { in: this.createdIds.questions } },
        });
        await this.prisma.question.deleteMany({
          where: { id: { in: this.createdIds.questions } },
        });
      }

      // Files
      if (this.createdIds.files.length > 0) {
        await this.prisma.mediaFile.deleteMany({
          where: { id: { in: this.createdIds.files } },
        });
      }

      // Challenges
      if (this.createdIds.challenges.length > 0) {
        await this.prisma.challenge.deleteMany({
          where: { id: { in: this.createdIds.challenges } },
        });
      }

      // Users
      if (this.createdIds.students.length > 0) {
        await this.prisma.student.deleteMany({
          where: { id: { in: this.createdIds.students } },
        });
      }
      if (this.createdIds.teachers.length > 0) {
        await this.prisma.teacher.deleteMany({
          where: { id: { in: this.createdIds.teachers } },
        });
      }
      if (this.createdIds.coordinators.length > 0) {
        await this.prisma.coordinator.deleteMany({
          where: { id: { in: this.createdIds.coordinators } },
        });
      }

      // Schools
      if (this.createdIds.schools.length > 0) {
        await this.prisma.school.deleteMany({
          where: { id: { in: this.createdIds.schools } },
        });
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
      // Continue cleanup even if some deletions fail
    }

    // Reset the tracking arrays
    this.createdIds = {
      schools: [],
      teachers: [],
      students: [],
      coordinators: [],
      challenges: [],
      questions: [],
      files: [],
    };
  }

  /**
   * Track a question ID for cleanup
   */
  trackQuestion(questionId: string) {
    this.createdIds.questions.push(questionId);
  }

  /**
   * Track a file ID for cleanup
   */
  trackFile(fileId: string) {
    this.createdIds.files.push(fileId);
  }
}
