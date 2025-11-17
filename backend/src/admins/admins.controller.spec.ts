import { Test, TestingModule } from '@nestjs/testing';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../auth/guards/role.guard';

describe('AdminsController', () => {
  let controller: AdminsController;
  let service: AdminsService;

  const mockAdmin = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'Carlos',
    lastName: 'Martinez',
    email: 'carlos.martinez@example.com',
    phone: '+1234567890',
    bio: 'System administrator',
    avatar: 'https://example.com/avatar.jpg',
    isActive: true,
    userId: '123e4567-e89b-12d3-a456-426614174000',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAdminsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findActive: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminsController],
      providers: [
        {
          provide: AdminsService,
          useValue: mockAdminsService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(UserRoleGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AdminsController>(AdminsController);
    service = module.get<AdminsService>(AdminsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an admin', async () => {
      const createAdminDto: CreateAdminDto = {
        firstName: 'Carlos',
        lastName: 'Martinez',
        email: 'carlos.martinez@example.com',
        userId: '123e4567-e89b-12d3-a456-426614174000',
      };

      mockAdminsService.create.mockResolvedValue(mockAdmin);

      const result = await controller.create(createAdminDto);

      expect(result).toEqual(mockAdmin);
      expect(service.create).toHaveBeenCalledWith(createAdminDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of admins', async () => {
      const admins = [mockAdmin];
      mockAdminsService.findAll.mockResolvedValue(admins);

      const result = await controller.findAll();

      expect(result).toEqual(admins);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findActive', () => {
    it('should return an array of active admins', async () => {
      const admins = [mockAdmin];
      mockAdminsService.findActive.mockResolvedValue(admins);

      const result = await controller.findActive();

      expect(result).toEqual(admins);
      expect(service.findActive).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an admin by id', async () => {
      mockAdminsService.findOne.mockResolvedValue(mockAdmin);

      const result = await controller.findOne(mockAdmin.id);

      expect(result).toEqual(mockAdmin);
      expect(service.findOne).toHaveBeenCalledWith(mockAdmin.id);
    });
  });

  describe('update', () => {
    it('should update an admin', async () => {
      const updateAdminDto: UpdateAdminDto = {
        firstName: 'Charlie',
      };

      const updatedAdmin = { ...mockAdmin, ...updateAdminDto };
      mockAdminsService.update.mockResolvedValue(updatedAdmin);

      const result = await controller.update(mockAdmin.id, updateAdminDto);

      expect(result).toEqual(updatedAdmin);
      expect(service.update).toHaveBeenCalledWith(mockAdmin.id, updateAdminDto);
    });
  });

  describe('remove', () => {
    it('should delete an admin', async () => {
      mockAdminsService.remove.mockResolvedValue(mockAdmin);

      const result = await controller.remove(mockAdmin.id);

      expect(result).toEqual(mockAdmin);
      expect(service.remove).toHaveBeenCalledWith(mockAdmin.id);
    });
  });
});
