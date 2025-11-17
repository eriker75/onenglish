import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { PrismaService } from '../database/prisma.service';
import { CryptoService } from '../auth/services/crypto.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

describe('StudentsService', () => {
  let service: StudentsService;
  let _prismaService: PrismaService;
  let _cryptoService: CryptoService;

  const mockPrismaService = {
    student: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    school: {
      findUnique: jest.fn(),
    },
    role: {
      upsert: jest.fn(),
    },
    userRole: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockCryptoService = {
    hashDataForStorage: jest.fn((data) => `hashed_${data}`),
  };

  const mockStudent = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    bio: 'Student bio',
    avatar: 'https://example.com/avatar.jpg',
    isActive: true,
    schoolId: '456e4567-e89b-12d3-a456-426614174000',
    userId: '123e4567-e89b-12d3-a456-426614174000',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'john.doe@example.com',
    username: null,
    password: null,
    firstName: 'John',
    lastName: 'Doe',
    isActive: true,
  };

  const mockRole = {
    id: 'role-id',
    name: 'student',
    description: 'Student role',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
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

    service = module.get<StudentsService>(StudentsService);
    _prismaService = module.get<PrismaService>(PrismaService);
    _cryptoService = module.get<CryptoService>(CryptoService);

    mockPrismaService.$transaction.mockImplementation(async (cb) =>
      cb({
        user: mockPrismaService.user,
        userRole: mockPrismaService.userRole,
        student: mockPrismaService.student,
      }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a student successfully', async () => {
      const createStudentDto: CreateStudentDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        schoolId: '456e4567-e89b-12d3-a456-426614174000',
      };

      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.school.findUnique.mockResolvedValueOnce({
        id: createStudentDto.schoolId,
      });
      mockPrismaService.role.upsert.mockResolvedValue(mockRole);
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockPrismaService.userRole.create.mockResolvedValue({});
      mockPrismaService.student.create.mockResolvedValue(mockStudent);

      const result = await service.create(createStudentDto);

      expect(result).toEqual(mockStudent);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: createStudentDto.email,
          firstName: createStudentDto.firstName,
          lastName: createStudentDto.lastName,
        }),
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const createStudentDto: CreateStudentDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        schoolId: '456e4567-e89b-12d3-a456-426614174000',
      };

      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockUser);

      await expect(service.create(createStudentDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException if school not found', async () => {
      const createStudentDto: CreateStudentDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        schoolId: '456e4567-e89b-12d3-a456-426614174000',
      };

      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.school.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createStudentDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of students', async () => {
      const students = [mockStudent];
      mockPrismaService.student.findMany.mockResolvedValue(students);

      const result = await service.findAll();

      expect(result).toEqual(students);
      expect(mockPrismaService.student.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a student by id', async () => {
      mockPrismaService.student.findUnique.mockResolvedValue({
        ...mockStudent,
        school: {},
        user: {},
        _count: { studentChallenges: 0 },
      });

      const result = await service.findOne(mockStudent.id);

      expect(result).toBeDefined();
      expect(mockPrismaService.student.findUnique).toHaveBeenCalledWith({
        where: { id: mockStudent.id },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException if student not found', async () => {
      mockPrismaService.student.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a student successfully', async () => {
      const updateStudentDto: UpdateStudentDto = {
        firstName: 'Jane',
      };

      mockPrismaService.student.findUnique.mockResolvedValueOnce({
        ...mockStudent,
        school: {},
        user: {},
        _count: { studentChallenges: 0 },
      });
      mockPrismaService.student.update.mockResolvedValue({
        ...mockStudent,
        ...updateStudentDto,
      });

      const result = await service.update(mockStudent.id, updateStudentDto);

      expect(result).toBeDefined();
      expect(mockPrismaService.student.update).toHaveBeenCalledWith({
        where: { id: mockStudent.id },
        data: expect.any(Object),
      });
    });
  });

  describe('remove', () => {
    it('should delete a student successfully', async () => {
      mockPrismaService.student.findUnique.mockResolvedValue({
        ...mockStudent,
        _count: { studentChallenges: 0 },
      });
      mockPrismaService.student.delete.mockResolvedValue(mockStudent);

      const result = await service.remove(mockStudent.id);

      expect(result).toEqual(mockStudent);
      expect(mockPrismaService.student.delete).toHaveBeenCalledWith({
        where: { id: mockStudent.id },
      });
    });

    it('should throw ConflictException if student has active challenges', async () => {
      mockPrismaService.student.findUnique.mockResolvedValue({
        ...mockStudent,
        _count: { studentChallenges: 5 },
      });

      await expect(service.remove(mockStudent.id)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findBySchool', () => {
    it('should return students by school', async () => {
      const students = [mockStudent];
      mockPrismaService.student.findMany.mockResolvedValue(students);

      const result = await service.findBySchool('school-id');

      expect(result).toEqual(students);
      expect(mockPrismaService.student.findMany).toHaveBeenCalledWith({
        where: { schoolId: 'school-id' },
        include: expect.any(Object),
        orderBy: { lastName: 'asc' },
      });
    });
  });

  describe('findActive', () => {
    it('should return all active students', async () => {
      const activeStudents = [mockStudent];
      mockPrismaService.student.findMany.mockResolvedValue(activeStudents);

      const result = await service.findActive();

      expect(result).toEqual(activeStudents);
      expect(mockPrismaService.student.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        include: { school: true },
        orderBy: { lastName: 'asc' },
      });
    });
  });
});
