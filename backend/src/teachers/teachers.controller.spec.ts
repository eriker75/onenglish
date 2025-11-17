import { Test, TestingModule } from '@nestjs/testing';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../auth/guards/role.guard';
import { SchoolOwnershipGuard } from '../auth/guards/school-ownership.guard';
import { SchoolReadGuard } from '../auth/guards/school-read.guard';
import { NestjsFormDataModule } from 'nestjs-form-data';

describe('TeachersController', () => {
  let controller: TeachersController;
  let service: TeachersService;

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

  const mockTeachersService = {
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
      controllers: [TeachersController],
      providers: [
        {
          provide: TeachersService,
          useValue: mockTeachersService,
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

    controller = module.get<TeachersController>(TeachersController);
    service = module.get<TeachersService>(TeachersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a teacher', async () => {
      const createTeacherDto: CreateTeacherDto = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        schoolId: '456e4567-e89b-12d3-a456-426614174000',
      };

      mockTeachersService.create.mockResolvedValue(mockTeacher);

      const result = await controller.create(createTeacherDto);

      expect(result).toEqual(mockTeacher);
      expect(service.create).toHaveBeenCalledWith(createTeacherDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of teachers', async () => {
      const teachers = [mockTeacher];
      mockTeachersService.findAllPaginated.mockResolvedValue(teachers);

      const result = await controller.findAll();

      expect(result).toEqual(teachers);
      expect(service.findAllPaginated).toHaveBeenCalled();
    });
  });

  describe('findActive', () => {
    it('should return an array of active teachers', async () => {
      const teachers = [mockTeacher];
      mockTeachersService.findActive.mockResolvedValue(teachers);

      const result = await controller.findActive();

      expect(result).toEqual(teachers);
      expect(service.findActive).toHaveBeenCalled();
    });
  });

  describe('findBySchool', () => {
    it('should return teachers by school', async () => {
      const teachers = [mockTeacher];
      const schoolId = '456e4567-e89b-12d3-a456-426614174000';
      mockTeachersService.findBySchool.mockResolvedValue(teachers);

      const result = await controller.findBySchool(schoolId);

      expect(result).toEqual(teachers);
      expect(service.findBySchool).toHaveBeenCalledWith(schoolId);
    });
  });

  describe('findOne', () => {
    it('should return a teacher by id', async () => {
      mockTeachersService.findOne.mockResolvedValue(mockTeacher);

      const result = await controller.findOne(mockTeacher.id);

      expect(result).toEqual(mockTeacher);
      expect(service.findOne).toHaveBeenCalledWith(mockTeacher.id);
    });
  });

  describe('update', () => {
    it('should update a teacher', async () => {
      const updateTeacherDto: UpdateTeacherDto = {
        firstName: 'Janet',
      };

      const updatedTeacher = { ...mockTeacher, ...updateTeacherDto };
      mockTeachersService.update.mockResolvedValue(updatedTeacher);

      const result = await controller.update(mockTeacher.id, updateTeacherDto);

      expect(result).toEqual(updatedTeacher);
      expect(service.update).toHaveBeenCalledWith(
        mockTeacher.id,
        updateTeacherDto,
      );
    });
  });

  describe('remove', () => {
    it('should delete a teacher', async () => {
      mockTeachersService.remove.mockResolvedValue(mockTeacher);

      const result = await controller.remove(mockTeacher.id);

      expect(result).toEqual(mockTeacher);
      expect(service.remove).toHaveBeenCalledWith(mockTeacher.id);
    });
  });
});
