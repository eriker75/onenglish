import { Test, TestingModule } from '@nestjs/testing';
import { TeachersService } from './teachers.service';
import { PrismaService } from '../database/prisma.service';
import { CryptoService } from '../auth/services/crypto.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

describe('TeachersService', () => {
  let service: TeachersService;
  let _prismaService: PrismaService;
  let _cryptoService: CryptoService;

  const mockPrismaService = {
    teacher: {
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

  const mockTeacher = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1234567890',
    bio: 'Experienced teacher',
    avatar: 'https://example.com/avatar.jpg',
    isActive: true,
    schoolId: '456e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174000',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'jane.smith@example.com',
    username: null,
    password: null,
    firstName: 'Jane',
    lastName: 'Smith',
    isActive: true,
  };

  const mockRole = {
    id: 'role-id',
    name: 'teacher',
    description: 'Teacher role',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeachersService,
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

    service = module.get<TeachersService>(TeachersService);
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
    it('should create a teacher successfully', async () => {
      const createTeacherDto: CreateTeacherDto = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        schoolId: '456e4567-e89b-12d3-a456-426614174000',
      };

      mockPrismaService.teacher.findUnique.mockResolvedValue(null);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.school.findUnique.mockResolvedValue({
        id: createTeacherDto.schoolId,
      });
      mockPrismaService.role.findUnique.mockResolvedValue(mockRole);
      mockPrismaService.userRole.findFirst.mockResolvedValue(null);
      mockPrismaService.userRole.create.mockResolvedValue({});
      mockPrismaService.teacher.create.mockResolvedValue(mockTeacher);

      const result = await service.create(createTeacherDto);

      expect(result).toEqual(mockTeacher);
      expect(mockPrismaService.teacher.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          firstName: createTeacherDto.firstName,
          lastName: createTeacherDto.lastName,
          email: createTeacherDto.email,
        }),
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const createTeacherDto: CreateTeacherDto = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        schoolId: '456e4567-e89b-12d3-a456-426614174000',
      };

      mockPrismaService.teacher.findUnique.mockResolvedValue(mockTeacher);

      await expect(service.create(createTeacherDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      const createTeacherDto: CreateTeacherDto = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        schoolId: '456e4567-e89b-12d3-a456-426614174000',
      };

      mockPrismaService.teacher.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.create(createTeacherDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of teachers', async () => {
      const teachers = [mockTeacher];
      mockPrismaService.teacher.findMany.mockResolvedValue(teachers);

      const result = await service.findAll();

      expect(result).toEqual(teachers);
      expect(mockPrismaService.teacher.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a teacher by id', async () => {
      mockPrismaService.teacher.findUnique.mockResolvedValue({
        ...mockTeacher,
        school: {},
        user: {},
      });

      const result = await service.findOne(mockTeacher.id);

      expect(result).toBeDefined();
      expect(mockPrismaService.teacher.findUnique).toHaveBeenCalledWith({
        where: { id: mockTeacher.id },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException if teacher not found', async () => {
      mockPrismaService.teacher.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a teacher successfully', async () => {
      const updateTeacherDto: UpdateTeacherDto = {
        firstName: 'Janet',
      };

      mockPrismaService.teacher.findUnique.mockResolvedValueOnce({
        ...mockTeacher,
        school: {},
        user: {},
      });
      mockPrismaService.teacher.update.mockResolvedValue({
        ...mockTeacher,
        ...updateTeacherDto,
      });

      const result = await service.update(mockTeacher.id, updateTeacherDto);

      expect(result).toBeDefined();
      expect(mockPrismaService.teacher.update).toHaveBeenCalledWith({
        where: { id: mockTeacher.id },
        data: expect.any(Object),
      });
    });
  });

  describe('remove', () => {
    it('should delete a teacher successfully', async () => {
      mockPrismaService.teacher.findUnique.mockResolvedValue(mockTeacher);
      mockPrismaService.teacher.delete.mockResolvedValue(mockTeacher);

      const result = await service.remove(mockTeacher.id);

      expect(result).toEqual(mockTeacher);
      expect(mockPrismaService.teacher.delete).toHaveBeenCalledWith({
        where: { id: mockTeacher.id },
      });
    });

    it('should throw NotFoundException if teacher not found', async () => {
      mockPrismaService.teacher.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findBySchool', () => {
    it('should return teachers by school', async () => {
      const teachers = [mockTeacher];
      mockPrismaService.teacher.findMany.mockResolvedValue(teachers);

      const result = await service.findBySchool('school-id');

      expect(result).toEqual(teachers);
      expect(mockPrismaService.teacher.findMany).toHaveBeenCalledWith({
        where: { schoolId: 'school-id' },
        orderBy: { lastName: 'asc' },
      });
    });
  });

  describe('findActive', () => {
    it('should return all active teachers', async () => {
      const activeTeachers = [mockTeacher];
      mockPrismaService.teacher.findMany.mockResolvedValue(activeTeachers);

      const result = await service.findActive();

      expect(result).toEqual(activeTeachers);
      expect(mockPrismaService.teacher.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        include: { school: true },
        orderBy: { lastName: 'asc' },
      });
    });
  });
});
