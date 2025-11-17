import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SchoolReadGuard } from './school-read.guard';
import { PrismaService } from '../../database/prisma.service';
import { SKIP_SCHOOL_READ_CHECK } from '../decorators/school-read.decorator';

describe('SchoolReadGuard', () => {
  let guard: SchoolReadGuard;
  let _prismaService: PrismaService;
  let _reflector: Reflector;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    coordinator: {
      findUnique: jest.fn(),
    },
    teacher: {
      findUnique: jest.fn(),
    },
    student: {
      findUnique: jest.fn(),
    },
  };

  const mockReflector = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolReadGuard,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<SchoolReadGuard>(SchoolReadGuard);
    _prismaService = module.get<PrismaService>(PrismaService);
    _reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockExecutionContext = (
    user: any,
    params: any = {},
    route: any = {},
  ): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user,
          params,
          route,
          url: route.path || '/students/123',
        }),
      }),
      getHandler: () => ({}),
    } as ExecutionContext;
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should skip check when @SkipSchoolReadCheck is used', async () => {
      mockReflector.get.mockReturnValue(true);

      const context = createMockExecutionContext({});
      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(mockReflector.get).toHaveBeenCalledWith(
        SKIP_SCHOOL_READ_CHECK,
        expect.any(Object),
      );
    });

    it('should allow admin to read any resource', async () => {
      mockReflector.get.mockReturnValue(false);
      const mockUser = {
        id: 'admin-id',
        email: 'admin@example.com',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'admin-id',
        roles: [{ role: { name: 'admin' } }],
      });

      const context = createMockExecutionContext(mockUser, {
        id: 'resource-id',
      });
      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow student to read any resource', async () => {
      mockReflector.get.mockReturnValue(false);
      const mockUser = {
        id: 'student-id',
        email: 'student@example.com',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'student-id',
        roles: [{ role: { name: 'student' } }],
      });

      const context = createMockExecutionContext(mockUser);
      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow coordinator to read resource from their school', async () => {
      mockReflector.get.mockReturnValue(false);
      const mockUser = {
        id: 'coordinator-id',
        email: 'coord@example.com',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'coordinator-id',
        roles: [{ role: { name: 'coordinator' } }],
      });

      mockPrismaService.coordinator.findUnique.mockResolvedValue({
        id: 'coordinator-id',
        schoolId: 'school-123',
      });

      mockPrismaService.student.findUnique.mockResolvedValue({
        id: 'student-id',
        schoolId: 'school-123',
      });

      const context = createMockExecutionContext(
        mockUser,
        { id: 'student-id' },
        { path: '/students/:id' },
      );
      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should deny coordinator reading resource from different school', async () => {
      mockReflector.get.mockReturnValue(false);
      const mockUser = {
        id: 'coordinator-id',
        email: 'coord@example.com',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'coordinator-id',
        roles: [{ role: { name: 'coordinator' } }],
      });

      mockPrismaService.coordinator.findUnique.mockResolvedValue({
        id: 'coordinator-id',
        schoolId: 'school-123',
      });

      mockPrismaService.student.findUnique.mockResolvedValue({
        id: 'student-id',
        schoolId: 'different-school',
      });

      const context = createMockExecutionContext(
        mockUser,
        { id: 'student-id' },
        { path: '/students/:id' },
      );

      await expect(guard.canActivate(context)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should allow teacher to read resource from their school', async () => {
      mockReflector.get.mockReturnValue(false);
      const mockUser = {
        id: 'teacher-id',
        email: 'teacher@example.com',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'teacher-id',
        roles: [{ role: { name: 'teacher' } }],
      });

      mockPrismaService.teacher.findUnique.mockResolvedValue({
        id: 'teacher-id',
        schoolId: 'school-123',
      });

      mockPrismaService.student.findUnique.mockResolvedValue({
        id: 'student-id',
        schoolId: 'school-123',
      });

      const context = createMockExecutionContext(
        mockUser,
        { id: 'student-id' },
        { path: '/students/:id' },
      );
      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should deny teacher reading resource from different school', async () => {
      mockReflector.get.mockReturnValue(false);
      const mockUser = {
        id: 'teacher-id',
        email: 'teacher@example.com',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'teacher-id',
        roles: [{ role: { name: 'teacher' } }],
      });

      mockPrismaService.teacher.findUnique.mockResolvedValue({
        id: 'teacher-id',
        schoolId: 'school-123',
      });

      mockPrismaService.student.findUnique.mockResolvedValue({
        id: 'student-id',
        schoolId: 'different-school',
      });

      const context = createMockExecutionContext(
        mockUser,
        { id: 'student-id' },
        { path: '/students/:id' },
      );

      await expect(guard.canActivate(context)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should allow list endpoints and store userSchoolId in request', async () => {
      mockReflector.get.mockReturnValue(false);
      const mockUser = {
        id: 'coordinator-id',
        email: 'coord@example.com',
      };

      const mockRequest: any = {
        user: mockUser,
        params: {},
        route: { path: '/students' },
        url: '/students',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'coordinator-id',
        roles: [{ role: { name: 'coordinator' } }],
      });

      mockPrismaService.coordinator.findUnique.mockResolvedValue({
        id: 'coordinator-id',
        schoolId: 'school-123',
      });

      const context = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
        getHandler: () => ({}),
      } as ExecutionContext;

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(mockRequest.userSchoolId).toBe('school-123');
    });
  });
});
