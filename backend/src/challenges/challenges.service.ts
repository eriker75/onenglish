import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { QueryChallengeDto } from './dto/query-challenge.dto';
import { Challenge } from './entities/challenge.entity';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChallengesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateChallengeDto): Promise<Challenge> {
    try {
      // Check if slug already exists
      const existingChallenge = await this.prisma.challenge.findUnique({
        where: { slug: dto.slug },
      });

      if (existingChallenge) {
        throw new ConflictException(
          `Challenge with slug ${dto.slug} already exists`,
        );
      }

      const challenge = await this.prisma.challenge.create({
        data: dto,
      });

      return challenge;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create challenge: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<Challenge[]> {
    try {
      const challenges = await this.prisma.challenge.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return challenges;
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch challenges: ${error.message}`,
      );
    }
  }

  async findAllPaginated(
    query: QueryChallengeDto,
  ): Promise<PaginatedResponseDto<Challenge>> {
    try {
      const {
        limit = 10,
        offset = 0,
        search,
        category,
        level,
        difficulty,
        isPublished,
        isActive,
        title,
        slug,
      } = query;

      // Build where clause
      const where: Prisma.ChallengeWhereInput = {};

      if (category) {
        where.category = category;
      }

      if (level) {
        where.level = level;
      }

      if (difficulty) {
        where.difficulty = difficulty;
      }

      if (isPublished !== undefined) {
        where.isPublished = isPublished;
      }

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      // Build search conditions
      const searchConditions: Prisma.ChallengeWhereInput[] = [];

      if (search) {
        searchConditions.push(
          { title: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        );
      }

      if (title) {
        searchConditions.push({
          title: { contains: title, mode: 'insensitive' },
        });
      }

      if (slug) {
        searchConditions.push({
          slug: { contains: slug, mode: 'insensitive' },
        });
      }

      if (searchConditions.length > 0) {
        where.OR = searchConditions;
      }

      // Get total count
      const total = await this.prisma.challenge.count({ where });

      // Get paginated data
      const challenges = await this.prisma.challenge.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      });

      return new PaginatedResponseDto(challenges, total, limit, offset);
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch paginated challenges: ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<Challenge> {
    try {
      const challenge = await this.prisma.challenge.findUnique({
        where: { id },
        include: {
          schoolChallenges: {
            include: {
              school: true,
            },
          },
          _count: {
            select: {
              schoolChallenges: true,
              studentChallenges: true,
            },
          },
        },
      });

      if (!challenge) {
        throw new NotFoundException(`Challenge with ID ${id} not found`);
      }

      return challenge;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to fetch challenge: ${error.message}`,
      );
    }
  }

  async update(id: string, dto: UpdateChallengeDto): Promise<Challenge> {
    try {
      // Check if challenge exists
      await this.findOne(id);

      // Check if slug is being changed and if it already exists
      if (dto.slug) {
        const existingChallenge = await this.prisma.challenge.findUnique({
          where: { slug: dto.slug },
        });

        if (existingChallenge && existingChallenge.id !== id) {
          throw new ConflictException(
            `Challenge with slug ${dto.slug} already exists`,
          );
        }
      }

      const challenge = await this.prisma.challenge.update({
        where: { id },
        data: dto,
      });

      return challenge;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update challenge: ${error.message}`,
      );
    }
  }

  async remove(id: string): Promise<Challenge> {
    try {
      // Check if challenge exists
      const challenge = await this.prisma.challenge.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              schoolChallenges: true,
              studentChallenges: true,
            },
          },
        },
      });

      if (!challenge) {
        throw new NotFoundException(`Challenge with ID ${id} not found`);
      }

      const hasRelations =
        challenge._count.schoolChallenges > 0 ||
        challenge._count.studentChallenges > 0;

      if (hasRelations) {
        throw new ConflictException(
          'Cannot delete challenge with associated schools or students. Please remove them first.',
        );
      }

      const deletedChallenge = await this.prisma.challenge.delete({
        where: { id },
      });

      return deletedChallenge;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete challenge: ${error.message}`,
      );
    }
  }

  async findByCategory(category: string): Promise<Challenge[]> {
    try {
      const challenges = await this.prisma.challenge.findMany({
        where: { category },
        orderBy: {
          title: 'asc',
        },
      });

      return challenges;
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch challenges by category: ${error.message}`,
      );
    }
  }

  async findByLevel(level: string): Promise<Challenge[]> {
    try {
      const challenges = await this.prisma.challenge.findMany({
        where: { level },
        orderBy: {
          title: 'asc',
        },
      });

      return challenges;
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch challenges by level: ${error.message}`,
      );
    }
  }

  async findPublished(): Promise<Challenge[]> {
    try {
      const challenges = await this.prisma.challenge.findMany({
        where: {
          isPublished: true,
          isActive: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return challenges;
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch published challenges: ${error.message}`,
      );
    }
  }
}
