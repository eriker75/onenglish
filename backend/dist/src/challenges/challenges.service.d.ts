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
    private addComputedFields;
    findAll(): Promise<Challenge[]>;
    findAllPaginated(query: QueryChallengeDto): Promise<PaginatedResponseDto<Challenge>>;
    findOne(id: string): Promise<Challenge>;
    update(id: string, dto: UpdateChallengeDto): Promise<Challenge>;
    remove(id: string): Promise<Challenge>;
    findByGrade(grade: string): Promise<Challenge[]>;
    findByType(type: string): Promise<Challenge[]>;
    findActive(): Promise<Challenge[]>;
}
