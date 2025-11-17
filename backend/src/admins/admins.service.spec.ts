import { Test, TestingModule } from '@nestjs/testing';
import { AdminsService } from './admins.service';
import { PrismaService } from '../database/prisma.service';
import { CryptoService } from '../auth/services/crypto.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

describe('AdminsService', () => {
  let service: AdminsService;
  let _prismaService: PrismaService;
  let _cryptoService: CryptoService;

  const mockPrismaService = {
    admin: {
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

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'carlos.martinez@example.com',
    username: null,
    password: null,
    firstName: 'Carlos',
    lastName: 'Martinez',
    isActive: true,
  };

  const mockRole = {
    id: 'role-id',
    name: 'admin',
    description: 'Admin role',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminsService,
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

    service = module.get<AdminsService>(AdminsService);
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
    it('should create an admin successfully', async () => {
      const createAdminDto: CreateAdminDto = {
        firstName: 'Carlos',
        lastName: 'Martinez',
        email: 'carlos.martinez@example.com',
        userId: '123e4567-e89b-12d3-a456-426614174000',
      };

      mockPrismaService.admin.findUnique.mockResolvedValue(null);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.role.findUnique.mockResolvedValue(mockRole);
      mockPrismaService.userRole.findFirst.mockResolvedValue(null);
      mockPrismaService.userRole.create.mockResolvedValue({});
      mockPrismaService.admin.create.mockResolvedValue(mockAdmin);

      const result = await service.create(createAdminDto);

      expect(result).toEqual(mockAdmin);
      expect(mockPrismaService.admin.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          firstName: createAdminDto.firstName,
          lastName: createAdminDto.lastName,
          email: createAdminDto.email,
        }),
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const createAdminDto: CreateAdminDto = {
        firstName: 'Carlos',
        lastName: 'Martinez',
        email: 'carlos.martinez@example.com',
        userId: '123e4567-e89b-12d3-a456-426614174000',
      };

      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);

      await expect(service.create(createAdminDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      const createAdminDto: CreateAdminDto = {
        firstName: 'Carlos',
        lastName: 'Martinez',
        email: 'carlos.martinez@example.com',
        userId: '123e4567-e89b-12d3-a456-426614174000',
      };

      mockPrismaService.admin.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.create(createAdminDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of admins', async () => {
      const admins = [mockAdmin];
      mockPrismaService.admin.findMany.mockResolvedValue(admins);

      const result = await service.findAll();

      expect(result).toEqual(admins);
      expect(mockPrismaService.admin.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an admin by id', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue({
        ...mockAdmin,
        user: {},
      });

      const result = await service.findOne(mockAdmin.id);

      expect(result).toBeDefined();
      expect(mockPrismaService.admin.findUnique).toHaveBeenCalledWith({
        where: { id: mockAdmin.id },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException if admin not found', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an admin successfully', async () => {
      const updateAdminDto: UpdateAdminDto = {
        firstName: 'Charlie',
      };

      mockPrismaService.admin.findUnique.mockResolvedValueOnce({
        ...mockAdmin,
        user: {},
      });
      mockPrismaService.admin.update.mockResolvedValue({
        ...mockAdmin,
        ...updateAdminDto,
      });

      const result = await service.update(mockAdmin.id, updateAdminDto);

      expect(result).toBeDefined();
      expect(mockPrismaService.admin.update).toHaveBeenCalledWith({
        where: { id: mockAdmin.id },
        data: expect.any(Object),
      });
    });
  });

  describe('remove', () => {
    it('should delete an admin successfully', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(mockAdmin);
      mockPrismaService.admin.delete.mockResolvedValue(mockAdmin);

      const result = await service.remove(mockAdmin.id);

      expect(result).toEqual(mockAdmin);
      expect(mockPrismaService.admin.delete).toHaveBeenCalledWith({
        where: { id: mockAdmin.id },
      });
    });

    it('should throw NotFoundException if admin not found', async () => {
      mockPrismaService.admin.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findActive', () => {
    it('should return all active admins', async () => {
      const activeAdmins = [mockAdmin];
      mockPrismaService.admin.findMany.mockResolvedValue(activeAdmins);

      const result = await service.findActive();

      expect(result).toEqual(activeAdmins);
      expect(mockPrismaService.admin.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { lastName: 'asc' },
      });
    });
  });
});
