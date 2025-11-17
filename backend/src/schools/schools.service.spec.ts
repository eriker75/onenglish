import { Test, TestingModule } from '@nestjs/testing';
import { SchoolsService } from './schools.service';
import { PrismaService } from '../database/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';

describe('SchoolsService', () => {
  let service: SchoolsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    school: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockSchool = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test School',
    code: 'TEST001',
    address: '123 Test St',
    city: 'Test City',
    state: 'TS',
    country: 'Test Country',
    postalCode: '12345',
    phone: '+1234567890',
    email: 'test@school.com',
    website: 'https://test.school.com',
    description: 'Test description',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<SchoolsService>(SchoolsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a school successfully', async () => {
      const createSchoolDto: CreateSchoolDto = {
        name: 'Test School',
        isActive: true,
      };

      // Mock findMany for code generation
      mockPrismaService.school.findMany.mockResolvedValue([
        { code: 'SCH0001' },
      ]);
      mockPrismaService.school.create.mockResolvedValue(mockSchool);

      const result = await service.create(createSchoolDto);

      expect(result).toEqual(mockSchool);
      expect(mockPrismaService.school.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if code already exists', async () => {
      const createSchoolDto: CreateSchoolDto = {
        name: 'Test School',
        isActive: true,
      };

      // Mock findMany for code generation
      mockPrismaService.school.findMany.mockResolvedValue([
        { code: 'SCH0001' },
      ]);
      // Simulate unique constraint error
      mockPrismaService.school.create.mockRejectedValue({
        code: 'P2002',
        message: 'Unique constraint failed',
      });

      await expect(service.create(createSchoolDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return an array of schools', async () => {
      const schools = [mockSchool];
      mockPrismaService.school.findMany.mockResolvedValue(schools);

      const result = await service.findAll();

      expect(result).toEqual(schools);
      expect(mockPrismaService.school.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a school by id', async () => {
      mockPrismaService.school.findUnique.mockResolvedValue({
        ...mockSchool,
        _count: {
          teachers: 0,
          students: 0,
          coordinators: 0,
          schoolChallenges: 0,
        },
      });

      const result = await service.findOne(mockSchool.id);

      expect(result).toBeDefined();
      expect(mockPrismaService.school.findUnique).toHaveBeenCalledWith({
        where: { id: mockSchool.id },
        include: {
          _count: {
            select: {
              teachers: true,
              students: true,
              coordinators: true,
              schoolChallenges: true,
            },
          },
        },
      });
    });

    it('should throw NotFoundException if school not found', async () => {
      mockPrismaService.school.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a school successfully', async () => {
      const updateSchoolDto: UpdateSchoolDto = {
        name: 'Updated School',
      };

      mockPrismaService.school.findUnique.mockResolvedValue({
        ...mockSchool,
        _count: {
          teachers: 0,
          students: 0,
          coordinators: 0,
          schoolChallenges: 0,
        },
      });
      mockPrismaService.school.update.mockResolvedValue({
        ...mockSchool,
        ...updateSchoolDto,
      });

      const result = await service.update(mockSchool.id, updateSchoolDto);

      expect(result).toBeDefined();
      expect(mockPrismaService.school.update).toHaveBeenCalledWith({
        where: { id: mockSchool.id },
        data: updateSchoolDto,
      });
    });
  });

  describe('remove', () => {
    it('should delete a school successfully', async () => {
      mockPrismaService.school.findUnique.mockResolvedValue({
        ...mockSchool,
        _count: {
          teachers: 0,
          students: 0,
          coordinators: 0,
          schoolChallenges: 0,
        },
      });
      mockPrismaService.school.delete.mockResolvedValue(mockSchool);

      const result = await service.remove(mockSchool.id);

      expect(result).toEqual(mockSchool);
      expect(mockPrismaService.school.delete).toHaveBeenCalledWith({
        where: { id: mockSchool.id },
      });
    });

    it('should throw ConflictException if school has related entities', async () => {
      mockPrismaService.school.findUnique.mockResolvedValue({
        ...mockSchool,
        _count: {
          teachers: 5,
          students: 10,
          coordinators: 1,
          schoolChallenges: 3,
        },
      });

      await expect(service.remove(mockSchool.id)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findByCode', () => {
    it('should return a school by code', async () => {
      mockPrismaService.school.findUnique.mockResolvedValue(mockSchool);

      const result = await service.findByCode('TEST001');

      expect(result).toEqual(mockSchool);
      expect(mockPrismaService.school.findUnique).toHaveBeenCalledWith({
        where: { code: 'TEST001' },
        include: {
          _count: {
            select: {
              teachers: true,
              students: true,
              coordinators: true,
              schoolChallenges: true,
            },
          },
        },
      });
    });
  });

  describe('findActive', () => {
    it('should return all active schools', async () => {
      const activeSchools = [mockSchool];
      mockPrismaService.school.findMany.mockResolvedValue(activeSchools);

      const result = await service.findActive();

      expect(result).toEqual(activeSchools);
      expect(mockPrismaService.school.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: {
          name: 'asc',
        },
      });
    });
  });
});
