import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CryptoService } from '../auth/services/crypto.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
  ) {}

  async create(dto: CreateAdminDto): Promise<Admin> {
    try {
      // Check if email already exists
      const existingAdmin = await this.prisma.admin.findUnique({
        where: { email: dto.email },
      });

      if (existingAdmin) {
        throw new ConflictException(
          `Admin with email ${dto.email} already exists`,
        );
      }

      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${dto.userId} not found`);
      }

      // Check if user already has an admin profile
      const existingAdminByUser = await this.prisma.admin.findUnique({
        where: { id: dto.userId },
      });

      if (existingAdminByUser) {
        throw new ConflictException('User already has an admin profile');
      }

      // Get or create admin role
      let adminRole = await this.prisma.role.findUnique({
        where: { name: 'admin' },
      });

      if (!adminRole) {
        adminRole = await this.prisma.role.create({
          data: {
            name: 'admin',
            description: 'Admin role',
          },
        });
      }

      // Update user with admin role and optional credentials
      const updateData: any = {};

      if (dto.username) {
        // Check username uniqueness
        const existingUsername = await this.prisma.user.findUnique({
          where: { username: dto.username },
        });
        if (existingUsername && existingUsername.id !== dto.userId) {
          throw new ConflictException(
            `Username ${dto.username} is already taken`,
          );
        }
        updateData.username = dto.username;
      }

      if (dto.password) {
        updateData.password = this.cryptoService.hashDataForStorage(
          dto.password,
        );
      }

      if (Object.keys(updateData).length > 0) {
        await this.prisma.user.update({
          where: { id: dto.userId },
          data: updateData,
        });
      }

      // Assign admin role to user
      const existingRole = await this.prisma.userRole.findFirst({
        where: {
          userId: dto.userId,
          roleId: adminRole.id,
        },
      });

      if (!existingRole) {
        await this.prisma.userRole.create({
          data: {
            userId: dto.userId,
            roleId: adminRole.id,
          },
        });
      }

      // Create admin profile
      const admin = await this.prisma.admin.create({
        data: {
          id: dto.userId,
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          phone: dto.phone,
          avatar: dto.avatar,
          bio: dto.bio,
          isActive: dto.isActive ?? true,
          userId: dto.userId,
        },
      });

      return admin;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(`Failed to create admin: ${error.message}`);
    }
  }

  async findAll(): Promise<Admin[]> {
    try {
      const admins = await this.prisma.admin.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return admins;
    } catch (error) {
      throw new BadRequestException(`Failed to fetch admins: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<Admin> {
    try {
      const admin = await this.prisma.admin.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              email: true,
              username: true,
              isActive: true,
              isOnline: true,
              lastLoginAt: true,
            },
          },
        },
      });

      if (!admin) {
        throw new NotFoundException(`Admin with ID ${id} not found`);
      }

      return admin;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to fetch admin: ${error.message}`);
    }
  }

  async update(id: string, dto: UpdateAdminDto): Promise<Admin> {
    try {
      // Check if admin exists
      await this.findOne(id);

      // Check if email is being changed and if it already exists
      if (dto.email) {
        const existingAdmin = await this.prisma.admin.findUnique({
          where: { email: dto.email },
        });

        if (existingAdmin && existingAdmin.id !== id) {
          throw new ConflictException(
            `Admin with email ${dto.email} already exists`,
          );
        }
      }

      const admin = await this.prisma.admin.update({
        where: { id },
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          phone: dto.phone,
          avatar: dto.avatar,
          bio: dto.bio,
          isActive: dto.isActive,
        },
      });

      return admin;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(`Failed to update admin: ${error.message}`);
    }
  }

  async remove(id: string): Promise<Admin> {
    try {
      // Check if admin exists
      const admin = await this.prisma.admin.findUnique({
        where: { id },
      });

      if (!admin) {
        throw new NotFoundException(`Admin with ID ${id} not found`);
      }

      const deletedAdmin = await this.prisma.admin.delete({
        where: { id },
      });

      return deletedAdmin;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to delete admin: ${error.message}`);
    }
  }

  async findActive(): Promise<Admin[]> {
    try {
      const admins = await this.prisma.admin.findMany({
        where: { isActive: true },
        orderBy: {
          lastName: 'asc',
        },
      });

      return admins;
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch active admins: ${error.message}`,
      );
    }
  }
}
