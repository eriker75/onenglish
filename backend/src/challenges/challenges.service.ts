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
      // Calculate year from exactDate if provided
      const exactDate = dto.exactDate ? new Date(dto.exactDate) : null;
      const year = exactDate ? exactDate.getFullYear() : new Date().getFullYear();

      // Generate challenge name automatically
      // Format: {year} - {grade_formatted} - {type} {- Demo if isDemo}
      const gradeFormatted = dto.grade
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const typeFormatted = dto.type.charAt(0).toUpperCase() + dto.type.slice(1);
      const demoSuffix = dto.isDemo ? ' - Demo' : '';
      const name = `${year} - ${gradeFormatted} - ${typeFormatted}${demoSuffix}`;

      const challenge = await this.prisma.challenge.create({
        data: {
          name,
          grade: dto.grade,
          type: dto.type,
          isDemo: dto.isDemo ?? false,
          year,
          exactDate,
          stage: dto.stage,
          isActive: dto.isActive ?? true,
        },
        include: {
          questions: {
            select: {
              id: true,
              timeLimit: true,
            },
          },
        },
      });

      return this.addComputedFields(challenge);
    } catch (error) {
      throw new BadRequestException(
        `Failed to create challenge: ${error.message}`,
      );
    }
  }

  private addComputedFields(challenge: any): Challenge {
    const totalQuestions = challenge.questions?.length ?? 0;
    const totalTime =
      challenge.questions?.reduce(
        (sum: number, q: any) => sum + (q.timeLimit ?? 0),
        0,
      ) ?? 0;

    // Exclude questions from the response, only keep computed fields
    const { questions, ...challengeWithoutQuestions } = challenge;

    return {
      ...challengeWithoutQuestions,
      totalQuestions,
      totalTime,
    };
  }

  async findAll(): Promise<Challenge[]> {
    try {
      const challenges = await this.prisma.challenge.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          questions: {
            select: {
              id: true,
              timeLimit: true,
            },
          },
        },
      });

      return challenges.map((challenge) => this.addComputedFields(challenge));
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
        grade,
        type,
        stage,
        isDemo,
        isActive,
        year,
        exactDate,
        name,
      } = query;

      // Build where clause
      const where: Prisma.ChallengeWhereInput = {};

      if (grade) {
        where.grade = grade;
      }

      if (type) {
        where.type = type;
      }

      if (stage) {
        where.stage = stage;
      }

      if (isDemo !== undefined) {
        where.isDemo = isDemo;
      }

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      if (year !== undefined) {
        where.year = year;
      }

      if (exactDate) {
        where.exactDate = new Date(exactDate);
      }

      // Build search conditions
      const searchConditions: Prisma.ChallengeWhereInput[] = [];

      if (search) {
        searchConditions.push({
          name: { contains: search, mode: 'insensitive' },
        });
      }

      if (name) {
        searchConditions.push({
          name: { contains: name, mode: 'insensitive' },
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
        include: {
          questions: {
            select: {
              id: true,
              timeLimit: true,
            },
          },
        },
      });

      const challengesWithComputed = challenges.map((challenge) =>
        this.addComputedFields(challenge),
      );

      return new PaginatedResponseDto(
        challengesWithComputed,
        total,
        limit,
        offset,
      );
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
          questions: {
            select: {
              id: true,
              timeLimit: true,
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

      return this.addComputedFields(challenge);
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
      const existingChallenge = await this.findOne(id);

      const updateData: Prisma.ChallengeUpdateInput = {};

      // Update grade if provided
      if (dto.grade !== undefined) {
        updateData.grade = dto.grade;
      }

      // Update type if provided
      if (dto.type !== undefined) {
        updateData.type = dto.type;
      }

      // Update isDemo if provided
      if (dto.isDemo !== undefined) {
        updateData.isDemo = dto.isDemo;
      }

      // Update exactDate and recalculate year if exactDate is provided
      if (dto.exactDate !== undefined) {
        const exactDate = dto.exactDate ? new Date(dto.exactDate) : null;
        updateData.exactDate = exactDate;
        updateData.year = exactDate ? exactDate.getFullYear() : new Date().getFullYear();
      }

      // Update stage if provided
      if (dto.stage !== undefined) {
        updateData.stage = dto.stage;
      }

      // Update isActive if provided
      if (dto.isActive !== undefined) {
        updateData.isActive = dto.isActive;
      }

      // Regenerate name if any relevant field changed
      if (dto.grade !== undefined || dto.type !== undefined || dto.isDemo !== undefined || dto.exactDate !== undefined) {
        const grade = dto.grade ?? existingChallenge.grade;
        const type = dto.type ?? existingChallenge.type;
        const isDemo = dto.isDemo ?? existingChallenge.isDemo;

        let year: number;
        if (dto.exactDate !== undefined) {
          const exactDate = dto.exactDate ? new Date(dto.exactDate) : null;
          year = exactDate ? exactDate.getFullYear() : new Date().getFullYear();
        } else {
          year = existingChallenge.year ?? new Date().getFullYear();
        }

        const gradeFormatted = grade
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        const typeFormatted = type.charAt(0).toUpperCase() + type.slice(1);
        const demoSuffix = isDemo ? ' - Demo' : '';
        updateData.name = `${year} - ${gradeFormatted} - ${typeFormatted}${demoSuffix}`;
      }

      const challenge = await this.prisma.challenge.update({
        where: { id },
        data: updateData,
        include: {
          questions: {
            select: {
              id: true,
              timeLimit: true,
            },
          },
        },
      });

      return this.addComputedFields(challenge);
    } catch (error) {
      if (error instanceof NotFoundException) {
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

  async findByGrade(grade: string): Promise<Challenge[]> {
    try {
      const challenges = await this.prisma.challenge.findMany({
        where: { grade },
        orderBy: {
          name: 'asc',
        },
        include: {
          questions: {
            select: {
              id: true,
              timeLimit: true,
            },
          },
        },
      });

      return challenges.map((challenge) => this.addComputedFields(challenge));
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch challenges by grade: ${error.message}`,
      );
    }
  }

  async findByType(type: string): Promise<Challenge[]> {
    try {
      const challenges = await this.prisma.challenge.findMany({
        where: { type },
        orderBy: {
          name: 'asc',
        },
        include: {
          questions: {
            select: {
              id: true,
              timeLimit: true,
            },
          },
        },
      });

      return challenges.map((challenge) => this.addComputedFields(challenge));
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch challenges by type: ${error.message}`,
      );
    }
  }

  async findActive(): Promise<Challenge[]> {
    try {
      const challenges = await this.prisma.challenge.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          questions: {
            select: {
              id: true,
              timeLimit: true,
            },
          },
        },
      });

      return challenges.map((challenge) => this.addComputedFields(challenge));
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch active challenges: ${error.message}`,
      );
    }
  }
}
