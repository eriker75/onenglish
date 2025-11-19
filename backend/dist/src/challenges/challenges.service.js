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
            const exactDate = dto.exactDate ? new Date(dto.exactDate) : null;
            const year = exactDate ? exactDate.getFullYear() : new Date().getFullYear();
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
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to create challenge: ${error.message}`);
        }
    }
    addComputedFields(challenge) {
        const totalQuestions = challenge.questions?.length ?? 0;
        const totalTime = challenge.questions?.reduce((sum, q) => sum + (q.timeLimit ?? 0), 0) ?? 0;
        const { questions, ...challengeWithoutQuestions } = challenge;
        return {
            ...challengeWithoutQuestions,
            totalQuestions,
            totalTime,
        };
    }
    async findAll() {
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
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch challenges: ${error.message}`);
        }
    }
    async findAllPaginated(query) {
        try {
            const { limit = 10, offset = 0, search, grade, type, stage, isDemo, isActive, year, exactDate, name, } = query;
            const where = {};
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
            const searchConditions = [];
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
            const total = await this.prisma.challenge.count({ where });
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
            const challengesWithComputed = challenges.map((challenge) => this.addComputedFields(challenge));
            return new pagination_dto_1.PaginatedResponseDto(challengesWithComputed, total, limit, offset);
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
                throw new common_1.NotFoundException(`Challenge with ID ${id} not found`);
            }
            return this.addComputedFields(challenge);
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
            const existingChallenge = await this.findOne(id);
            const updateData = {};
            if (dto.grade !== undefined) {
                updateData.grade = dto.grade;
            }
            if (dto.type !== undefined) {
                updateData.type = dto.type;
            }
            if (dto.isDemo !== undefined) {
                updateData.isDemo = dto.isDemo;
            }
            if (dto.exactDate !== undefined) {
                const exactDate = dto.exactDate ? new Date(dto.exactDate) : null;
                updateData.exactDate = exactDate;
                updateData.year = exactDate ? exactDate.getFullYear() : new Date().getFullYear();
            }
            if (dto.stage !== undefined) {
                updateData.stage = dto.stage;
            }
            if (dto.isActive !== undefined) {
                updateData.isActive = dto.isActive;
            }
            if (dto.grade !== undefined || dto.type !== undefined || dto.isDemo !== undefined || dto.exactDate !== undefined) {
                const grade = dto.grade ?? existingChallenge.grade;
                const type = dto.type ?? existingChallenge.type;
                const isDemo = dto.isDemo ?? existingChallenge.isDemo;
                let year;
                if (dto.exactDate !== undefined) {
                    const exactDate = dto.exactDate ? new Date(dto.exactDate) : null;
                    year = exactDate ? exactDate.getFullYear() : new Date().getFullYear();
                }
                else {
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
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
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
    async findByGrade(grade) {
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
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch challenges by grade: ${error.message}`);
        }
    }
    async findByType(type) {
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
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch challenges by type: ${error.message}`);
        }
    }
    async findActive() {
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
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to fetch active challenges: ${error.message}`);
        }
    }
};
exports.ChallengesService = ChallengesService;
exports.ChallengesService = ChallengesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChallengesService);
//# sourceMappingURL=challenges.service.js.map