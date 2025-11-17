import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SchoolOwnershipGuard } from './school-ownership.guard';
import { PrismaService } from '../../database/prisma.service';

describe('SchoolOwnershipGuard', () => {
  let guard: SchoolOwnershipGuard;
  let _prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    coordinator: {
      findUnique: jest.fn(),
    },
  };

  const mockReflector = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolOwnershipGuard,
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

    guard = module.get<SchoolOwnershipGuard>(SchoolOwnershipGuard);
    _prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockExecutionContext = (
    user: any,
    body: any,
  ): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user,
          body,
        }),
      }),
    } as ExecutionContext;
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should allow admin to bypass school ownership check', async () => {
      const mockUser = {
        id: 'admin-id',
        email: 'admin@example.com',
      };

      const mockBody = {
        schoolId: 'any-school-id',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'admin-id',
        roles: [{ role: { name: 'admin' } }],
      });

      const context = createMockExecutionContext(mockUser, mockBody);
      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow coordinator to add to their own school', async () => {
      const mockUser = {
        id: 'coordinator-id',
        email: 'coord@example.com',
      };

      const mockBody = {
        schoolId: 'school-123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'coordinator-id',
        roles: [{ role: { name: 'coordinator' } }],
      });

      mockPrismaService.coordinator.findUnique.mockResolvedValue({
        id: 'coordinator-id',
        schoolId: 'school-123',
      });

      const context = createMockExecutionContext(mockUser, mockBody);
      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should deny coordinator adding to different school', async () => {
      const mockUser = {
        id: 'coordinator-id',
        email: 'coord@example.com',
      };

      const mockBody = {
        schoolId: 'different-school',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'coordinator-id',
        roles: [{ role: { name: 'coordinator' } }],
      });

      mockPrismaService.coordinator.findUnique.mockResolvedValue({
        id: 'coordinator-id',
        schoolId: 'my-school',
      });

      const context = createMockExecutionContext(mockUser, mockBody);

      await expect(guard.canActivate(context)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should deny non-coordinator/non-admin users', async () => {
      const mockUser = {
        id: 'teacher-id',
        email: 'teacher@example.com',
      };

      const mockBody = {
        schoolId: 'school-123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'teacher-id',
        roles: [{ role: { name: 'teacher' } }],
      });

      const context = createMockExecutionContext(mockUser, mockBody);

      await expect(guard.canActivate(context)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should deny coordinator without school assignment', async () => {
      const mockUser = {
        id: 'coordinator-id',
        email: 'coord@example.com',
      };

      const mockBody = {
        schoolId: 'school-123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'coordinator-id',
        roles: [{ role: { name: 'coordinator' } }],
      });

      mockPrismaService.coordinator.findUnique.mockResolvedValue({
        id: 'coordinator-id',
        schoolId: null,
      });

      const context = createMockExecutionContext(mockUser, mockBody);

      await expect(guard.canActivate(context)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
