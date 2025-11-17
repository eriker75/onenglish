import { Test, TestingModule } from '@nestjs/testing';
import { CoordinatorsController } from './coordinators.controller';
import { CoordinatorsService } from './coordinators.service';
import { CreateCoordinatorDto } from './dto/create-coordinator.dto';
import { UpdateCoordinatorDto } from './dto/update-coordinator.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../auth/guards/role.guard';
import { SchoolOwnershipGuard } from '../auth/guards/school-ownership.guard';
import { SchoolReadGuard } from '../auth/guards/school-read.guard';
import { NestjsFormDataModule } from 'nestjs-form-data';

describe('CoordinatorsController', () => {
  let controller: CoordinatorsController;
  let service: CoordinatorsService;

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

  const mockCoordinatorsService = {
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
      controllers: [CoordinatorsController],
      providers: [
        {
          provide: CoordinatorsService,
          useValue: mockCoordinatorsService,
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

    controller = module.get<CoordinatorsController>(CoordinatorsController);
    service = module.get<CoordinatorsService>(CoordinatorsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a coordinator', async () => {
      const createCoordinatorDto: CreateCoordinatorDto = {
        firstName: 'Maria',
        lastName: 'Rodriguez',
        email: 'maria.rodriguez@example.com',
        userId: '123e4567-e89b-12d3-a456-426614174000',
        schoolId: '456e4567-e89b-12d3-a456-426614174000',
      };

      mockCoordinatorsService.create.mockResolvedValue(mockCoordinator);

      const result = await controller.create(createCoordinatorDto);

      expect(result).toEqual(mockCoordinator);
      expect(service.create).toHaveBeenCalledWith(createCoordinatorDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of coordinators', async () => {
      const coordinators = [mockCoordinator];
      mockCoordinatorsService.findAllPaginated.mockResolvedValue(coordinators);

      const result = await controller.findAll();

      expect(result).toEqual(coordinators);
      expect(service.findAllPaginated).toHaveBeenCalled();
    });
  });

  describe('findActive', () => {
    it('should return an array of active coordinators', async () => {
      const coordinators = [mockCoordinator];
      mockCoordinatorsService.findActive.mockResolvedValue(coordinators);

      const result = await controller.findActive();

      expect(result).toEqual(coordinators);
      expect(service.findActive).toHaveBeenCalled();
    });
  });

  describe('findBySchool', () => {
    it('should return coordinators by school', async () => {
      const coordinators = [mockCoordinator];
      const schoolId = '456e4567-e89b-12d3-a456-426614174000';
      mockCoordinatorsService.findBySchool.mockResolvedValue(coordinators);

      const result = await controller.findBySchool(schoolId);

      expect(result).toEqual(coordinators);
      expect(service.findBySchool).toHaveBeenCalledWith(schoolId);
    });
  });

  describe('findOne', () => {
    it('should return a coordinator by id', async () => {
      mockCoordinatorsService.findOne.mockResolvedValue(mockCoordinator);

      const result = await controller.findOne(mockCoordinator.id);

      expect(result).toEqual(mockCoordinator);
      expect(service.findOne).toHaveBeenCalledWith(mockCoordinator.id);
    });
  });

  describe('update', () => {
    it('should update a coordinator', async () => {
      const updateCoordinatorDto: UpdateCoordinatorDto = {
        firstName: 'Mary',
      };

      const updatedCoordinator = {
        ...mockCoordinator,
        ...updateCoordinatorDto,
      };
      mockCoordinatorsService.update.mockResolvedValue(updatedCoordinator);

      const result = await controller.update(
        mockCoordinator.id,
        updateCoordinatorDto,
      );

      expect(result).toEqual(updatedCoordinator);
      expect(service.update).toHaveBeenCalledWith(
        mockCoordinator.id,
        updateCoordinatorDto,
      );
    });
  });

  describe('remove', () => {
    it('should delete a coordinator', async () => {
      mockCoordinatorsService.remove.mockResolvedValue(mockCoordinator);

      const result = await controller.remove(mockCoordinator.id);

      expect(result).toEqual(mockCoordinator);
      expect(service.remove).toHaveBeenCalledWith(mockCoordinator.id);
    });
  });
});
