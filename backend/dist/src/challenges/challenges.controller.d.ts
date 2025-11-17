import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { QueryChallengeDto } from './dto/query-challenge.dto';
import { Challenge } from './entities/challenge.entity';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';
export declare class ChallengesController {
    private readonly challengesService;
    constructor(challengesService: ChallengesService);
    create(createChallengeDto: CreateChallengeDto): Promise<Challenge>;
    findAll(query: QueryChallengeDto): Promise<PaginatedResponseDto<Challenge>>;
    findPublished(): Promise<Challenge[]>;
    findByCategory(category: string): Promise<Challenge[]>;
    findByLevel(level: string): Promise<Challenge[]>;
    findOne(id: string): Promise<Challenge>;
    update(id: string, updateChallengeDto: UpdateChallengeDto): Promise<Challenge>;
    remove(id: string): Promise<Challenge>;
}
