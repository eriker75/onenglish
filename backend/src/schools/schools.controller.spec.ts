import { Test, TestingModule } from '@nestjs/testing';
import { SchoolsController } from './schools.controller';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../auth/guards/role.guard';
import { NestjsFormDataModule } from 'nestjs-form-data';

describe('SchoolsController', () => {
  let controller: SchoolsController;
  let service: SchoolsService;

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

  const mockSchoolsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllPaginated: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByCode: jest.fn(),
    findActive: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NestjsFormDataModule.config({ isGlobal: true })],
      controllers: [SchoolsController],
      providers: [
        {
          provide: SchoolsService,
          useValue: mockSchoolsService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(UserRoleGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<SchoolsController>(SchoolsController);
    service = module.get<SchoolsService>(SchoolsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a school', async () => {
      const createSchoolDto: CreateSchoolDto = {
        name: 'Test School',
        code: 'TEST001',
        isActive: true,
      };

      mockSchoolsService.create.mockResolvedValue(mockSchool);

      const result = await controller.create(createSchoolDto);

      expect(result).toEqual(mockSchool);
      expect(service.create).toHaveBeenCalledWith(createSchoolDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of schools', async () => {
      const schools = [mockSchool];
      mockSchoolsService.findAllPaginated.mockResolvedValue(schools);

      const result = await controller.findAll();

      expect(result).toEqual(schools);
      expect(service.findAllPaginated).toHaveBeenCalled();
    });
  });

  describe('findActive', () => {
    it('should return an array of active schools', async () => {
      const schools = [mockSchool];
      mockSchoolsService.findActive.mockResolvedValue(schools);

      const result = await controller.findActive();

      expect(result).toEqual(schools);
      expect(service.findActive).toHaveBeenCalled();
    });
  });

  describe('findByCode', () => {
    it('should return a school by code', async () => {
      mockSchoolsService.findByCode.mockResolvedValue(mockSchool);

      const result = await controller.findByCode('TEST001');

      expect(result).toEqual(mockSchool);
      expect(service.findByCode).toHaveBeenCalledWith('TEST001');
    });
  });

  describe('findOne', () => {
    it('should return a school by id', async () => {
      mockSchoolsService.findOne.mockResolvedValue(mockSchool);

      const result = await controller.findOne(mockSchool.id);

      expect(result).toEqual(mockSchool);
      expect(service.findOne).toHaveBeenCalledWith(mockSchool.id);
    });
  });

  describe('update', () => {
    it('should update a school', async () => {
      const updateSchoolDto: UpdateSchoolDto = {
        name: 'Updated School',
      };

      const updatedSchool = { ...mockSchool, ...updateSchoolDto };
      mockSchoolsService.update.mockResolvedValue(updatedSchool);

      const result = await controller.update(mockSchool.id, updateSchoolDto);

      expect(result).toEqual(updatedSchool);
      expect(service.update).toHaveBeenCalledWith(
        mockSchool.id,
        updateSchoolDto,
      );
    });
  });

  describe('remove', () => {
    it('should delete a school', async () => {
      mockSchoolsService.remove.mockResolvedValue(mockSchool);

      const result = await controller.remove(mockSchool.id);

      expect(result).toEqual(mockSchool);
      expect(service.remove).toHaveBeenCalledWith(mockSchool.id);
    });
  });
});
