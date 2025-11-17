import { PrismaService } from '../database/prisma.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { QueryChallengeDto } from './dto/query-challenge.dto';
import { Challenge } from './entities/challenge.entity';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';
export declare class ChallengesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateChallengeDto): Promise<Challenge>;
    findAll(): Promise<Challenge[]>;
    findAllPaginated(query: QueryChallengeDto): Promise<PaginatedResponseDto<Challenge>>;
    findOne(id: string): Promise<Challenge>;
    update(id: string, dto: UpdateChallengeDto): Promise<Challenge>;
    remove(id: string): Promise<Challenge>;
    findByCategory(category: string): Promise<Challenge[]>;
    findByLevel(level: string): Promise<Challenge[]>;
    findPublished(): Promise<Challenge[]>;
}
