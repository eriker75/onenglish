import { Test, TestingModule } from '@nestjs/testing';
import { CoordinatorsService } from './coordinators.service';
import { PrismaService } from '../database/prisma.service';
import { CryptoService } from '../auth/services/crypto.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateCoordinatorDto } from './dto/create-coordinator.dto';
import { UpdateCoordinatorDto } from './dto/update-coordinator.dto';

describe('CoordinatorsService', () => {
  let service: CoordinatorsService;
  let _prismaService: PrismaService;
  let _cryptoService: CryptoService;

  const mockPrismaService = {
    coordinator: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    school: {
      findUnique: jest.fn(),
    },
    role: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    userRole: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockCryptoService = {
    hashDataForStorage: jest.fn((data) => `hashed_${data}`),
  };

  const mockCoordinator = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    email: 'maria.rodriguez@example.com',
    phone: '+1234567890',
    bio: 'Academic coordinator',
    avatar: 'https://example.com/avatar.jpg',
    isActive: true,
    schoolId: '456e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174000',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'maria.rodriguez@example.com',
    username: null,
    password: null,
    firstName: 'Maria',
    lastName: 'Rodriguez',
    isActive: true,
  };

  const mockRole = {
    id: 'role-id',
    name: 'coordinator',
    description: 'Coordinator role',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoordinatorsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: CryptoService,
          useValue: mockCryptoService,
        },
      ],
    }).compile();

    service = module.get<CoordinatorsService>(CoordinatorsService);
    _prismaService = module.get<PrismaService>(PrismaService);
    _cryptoService = module.get<CryptoService>(CryptoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a coordinator successfully', async () => {
      const createCoordinatorDto: CreateCoordinatorDto = {
        firstName: 'Maria',
        lastName: 'Rodriguez',
        email: 'maria.rodriguez@example.com',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        schoolId: '456e4567-e89b-12d3-a456-426614174000',
      };

      mockPrismaService.coordinator.findUnique.mockResolvedValue(null);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.school.findUnique.mockResolvedValue({
        id: createCoordinatorDto.schoolId,
      });
      mockPrismaService.role.findUnique.mockResolvedValue(mockRole);
      mockPrismaService.userRole.findFirst.mockResolvedValue(null);
      mockPrismaService.userRole.create.mockResolvedValue({});
      mockPrismaService.coordinator.create.mockResolvedValue(mockCoordinator);

      const result = await service.create(createCoordinatorDto);

      expect(result).toEqual(mockCoordinator);
      expect(mockPrismaService.coordinator.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          firstName: createCoordinatorDto.firstName,
          lastName: createCoordinatorDto.lastName,
          email: createCoordinatorDto.email,
        }),
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const createCoordinatorDto: CreateCoordinatorDto = {
        firstName: 'Maria',
        lastName: 'Rodriguez',
        email: 'maria.rodriguez@example.com',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        schoolId: '456e4567-e89b-12d3-a456-426614174000',
      };

      mockPrismaService.coordinator.findUnique.mockResolvedValue(mockCoordinator);

      await expect(service.create(createCoordinatorDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      const createCoordinatorDto: CreateCoordinatorDto = {
        firstName: 'Maria',
        lastName: 'Rodriguez',
        email: 'maria.rodriguez@example.com',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        schoolId: '456e4567-e89b-12d3-a456-426614174000',
      };

      mockPrismaService.coordinator.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.create(createCoordinatorDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of coordinators', async () => {
      const coordinators = [mockCoordinator];
      mockPrismaService.coordinator.findMany.mockResolvedValue(coordinators);

      const result = await service.findAll();

      expect(result).toEqual(coordinators);
      expect(mockPrismaService.coordinator.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a coordinator by id', async () => {
      mockPrismaService.coordinator.findUnique.mockResolvedValue({
        ...mockCoordinator,
        school: {},
        user: {},
      });

      const result = await service.findOne(mockCoordinator.id);

      expect(result).toBeDefined();
      expect(mockPrismaService.coordinator.findUnique).toHaveBeenCalledWith({
        where: { id: mockCoordinator.id },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException if coordinator not found', async () => {
      mockPrismaService.coordinator.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a coordinator successfully', async () => {
      const updateCoordinatorDto: UpdateCoordinatorDto = {
        firstName: 'Mary',
      };

      mockPrismaService.coordinator.findUnique.mockResolvedValueOnce({
        ...mockCoordinator,
        school: {},
        user: {},
      });
      mockPrismaService.coordinator.update.mockResolvedValue({
        ...mockCoordinator,
        ...updateCoordinatorDto,
      });

      const result = await service.update(mockCoordinator.id, updateCoordinatorDto);

      expect(result).toBeDefined();
      expect(mockPrismaService.coordinator.update).toHaveBeenCalledWith({
        where: { id: mockCoordinator.id },
        data: expect.any(Object),
      });
    });
  });

  describe('remove', () => {
    it('should delete a coordinator successfully', async () => {
      mockPrismaService.coordinator.findUnique.mockResolvedValue(mockCoordinator);
      mockPrismaService.coordinator.delete.mockResolvedValue(mockCoordinator);

      const result = await service.remove(mockCoordinator.id);

      expect(result).toEqual(mockCoordinator);
      expect(mockPrismaService.coordinator.delete).toHaveBeenCalledWith({
        where: { id: mockCoordinator.id },
      });
    });

    it('should throw NotFoundException if coordinator not found', async () => {
      mockPrismaService.coordinator.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findBySchool', () => {
    it('should return coordinators by school', async () => {
      const coordinators = [mockCoordinator];
      mockPrismaService.coordinator.findMany.mockResolvedValue(coordinators);

      const result = await service.findBySchool('school-id');

      expect(result).toEqual(coordinators);
      expect(mockPrismaService.coordinator.findMany).toHaveBeenCalledWith({
        where: { schoolId: 'school-id' },
        orderBy: { lastName: 'asc' },
      });
    });
  });

  describe('findActive', () => {
    it('should return all active coordinators', async () => {
      const activeCoordinators = [mockCoordinator];
      mockPrismaService.coordinator.findMany.mockResolvedValue(activeCoordinators);

      const result = await service.findActive();

      expect(result).toEqual(activeCoordinators);
      expect(mockPrismaService.coordinator.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        include: { school: true },
        orderBy: { lastName: 'asc' },
      });
    });
  });
});
