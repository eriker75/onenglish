import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../auth/guards/role.guard';
import { SchoolOwnershipGuard } from '../auth/guards/school-ownership.guard';
import { SchoolReadGuard } from '../auth/guards/school-read.guard';
import { NestjsFormDataModule } from 'nestjs-form-data';

describe('StudentsController', () => {
  let controller: StudentsController;
  let service: StudentsService;

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

  const mockStudentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllPaginated: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findBySchool: jest.fn(),
    findActive: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NestjsFormDataModule.config({ isGlobal: true })],
      controllers: [StudentsController],
      providers: [
        {
          provide: StudentsService,
          useValue: mockStudentsService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(UserRoleGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(SchoolOwnershipGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(SchoolReadGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<StudentsController>(StudentsController);
    service = module.get<StudentsService>(StudentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a student', async () => {
      const createStudentDto: CreateStudentDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        schoolId: '456e4567-e89b-12d3-a456-426614174000',
      };
      const requestUser = {
        id: 'admin-id',
        roles: 'admin',
      } as any;

      mockStudentsService.create.mockResolvedValue(mockStudent);

      const result = await controller.create(createStudentDto, requestUser);

      expect(result).toEqual(mockStudent);
      expect(service.create).toHaveBeenCalledWith(createStudentDto, {
        requesterId: requestUser.id,
        roles: requestUser.roles,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of students', async () => {
      const students = [mockStudent];
      mockStudentsService.findAllPaginated.mockResolvedValue(students);

      const result = await controller.findAll();

      expect(result).toEqual(students);
      expect(service.findAllPaginated).toHaveBeenCalled();
    });
  });

  describe('findActive', () => {
    it('should return an array of active students', async () => {
      const students = [mockStudent];
      mockStudentsService.findActive.mockResolvedValue(students);

      const result = await controller.findActive();

      expect(result).toEqual(students);
      expect(service.findActive).toHaveBeenCalled();
    });
  });

  describe('findBySchool', () => {
    it('should return students by school', async () => {
      const students = [mockStudent];
      const schoolId = '456e4567-e89b-12d3-a456-426614174000';
      mockStudentsService.findBySchool.mockResolvedValue(students);

      const result = await controller.findBySchool(schoolId);

      expect(result).toEqual(students);
      expect(service.findBySchool).toHaveBeenCalledWith(schoolId);
    });
  });

  describe('findOne', () => {
    it('should return a student by id', async () => {
      mockStudentsService.findOne.mockResolvedValue(mockStudent);

      const result = await controller.findOne(mockStudent.id);

      expect(result).toEqual(mockStudent);
      expect(service.findOne).toHaveBeenCalledWith(mockStudent.id);
    });
  });

  describe('update', () => {
    it('should update a student', async () => {
      const updateStudentDto: UpdateStudentDto = {
        firstName: 'Jane',
      };

      const updatedStudent = { ...mockStudent, ...updateStudentDto };
      mockStudentsService.update.mockResolvedValue(updatedStudent);

      const result = await controller.update(mockStudent.id, updateStudentDto);

      expect(result).toEqual(updatedStudent);
      expect(service.update).toHaveBeenCalledWith(
        mockStudent.id,
        updateStudentDto,
      );
    });
  });

  describe('remove', () => {
    it('should delete a student', async () => {
      mockStudentsService.remove.mockResolvedValue(mockStudent);

      const result = await controller.remove(mockStudent.id);

      expect(result).toEqual(mockStudent);
      expect(service.remove).toHaveBeenCalledWith(mockStudent.id);
    });
  });
});
