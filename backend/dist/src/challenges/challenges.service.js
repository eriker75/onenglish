"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const pagination_dto_1 = require("../common/dtos/pagination.dto");
let ChallengesService = class ChallengesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        try {
            const existingChallenge = await this.prisma.challenge.findUnique({
                where: { slug: dto.slug },
            });
            if (existingChallenge) {
                throw new common_1.ConflictException(`Challenge with slug ${dto.slug} already exists`);
            }
            const challenge = await this.prisma.challenge.create({
                data: dto,
            });
            return challenge;
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to create challenge: ${error.message}`);
        }
    }
    async findAll() {
        try {
            const challenges = await this.prisma.challenge.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return challenges;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch challenges: ${error.message}`);
        }
    }
    async findAllPaginated(query) {
        try {
            const { limit = 10, offset = 0, search, category, level, difficulty, isPublished, isActive, title, slug, } = query;
            const where = {};
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
            const searchConditions = [];
            if (search) {
                searchConditions.push({ title: { contains: search, mode: 'insensitive' } }, { slug: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } });
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
            const total = await this.prisma.challenge.count({ where });
            const challenges = await this.prisma.challenge.findMany({
                where,
                orderBy: {
                    createdAt: 'desc',
                },
                take: limit,
                skip: offset,
            });
            return new pagination_dto_1.PaginatedResponseDto(challenges, total, limit, offset);
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch paginated challenges: ${error.message}`);
        }
    }
    async findOne(id) {
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
                throw new common_1.NotFoundException(`Challenge with ID ${id} not found`);
            }
            return challenge;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to fetch challenge: ${error.message}`);
        }
    }
    async update(id, dto) {
        try {
            await this.findOne(id);
            if (dto.slug) {
                const existingChallenge = await this.prisma.challenge.findUnique({
                    where: { slug: dto.slug },
                });
                if (existingChallenge && existingChallenge.id !== id) {
                    throw new common_1.ConflictException(`Challenge with slug ${dto.slug} already exists`);
                }
            }
            const challenge = await this.prisma.challenge.update({
                where: { id },
                data: dto,
            });
            return challenge;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to update challenge: ${error.message}`);
        }
    }
    async remove(id) {
        try {
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
                throw new common_1.NotFoundException(`Challenge with ID ${id} not found`);
            }
            const hasRelations = challenge._count.schoolChallenges > 0 ||
                challenge._count.studentChallenges > 0;
            if (hasRelations) {
                throw new common_1.ConflictException('Cannot delete challenge with associated schools or students. Please remove them first.');
            }
            const deletedChallenge = await this.prisma.challenge.delete({
                where: { id },
            });
            return deletedChallenge;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to delete challenge: ${error.message}`);
        }
    }
    async findByCategory(category) {
        try {
            const challenges = await this.prisma.challenge.findMany({
                where: { category },
                orderBy: {
                    title: 'asc',
                },
            });
            return challenges;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch challenges by category: ${error.message}`);
        }
    }
    async findByLevel(level) {
        try {
            const challenges = await this.prisma.challenge.findMany({
                where: { level },
                orderBy: {
                    title: 'asc',
                },
            });
            return challenges;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch challenges by level: ${error.message}`);
        }
    }
    async findPublished() {
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
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch published challenges: ${error.message}`);
        }
    }
};
exports.ChallengesService = ChallengesService;
exports.ChallengesService = ChallengesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChallengesService);
//# sourceMappingURL=challenges.service.js.map