import { PrismaService } from '../database/prisma.service';
import { CryptoService } from '../auth/services/crypto.service';
import { CreateCoordinatorDto } from './dto/create-coordinator.dto';
import { UpdateCoordinatorDto } from './dto/update-coordinator.dto';
import { QueryCoordinatorDto } from './dto/query-coordinator.dto';
import { Coordinator } from './entities/coordinator.entity';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { ImportResult } from '../common/interfaces/import-result.interface';
export declare class CoordinatorsService {
    private readonly prisma;
    private readonly cryptoService;
    private readonly logger;
    constructor(prisma: PrismaService, cryptoService: CryptoService);
    create(dto: CreateCoordinatorDto): Promise<Coordinator>;
    findAll(): Promise<Coordinator[]>;
    findAllPaginated(query: QueryCoordinatorDto): Promise<PaginatedResponseDto<Coordinator>>;
    findOne(id: string): Promise<Coordinator>;
    update(id: string, dto: UpdateCoordinatorDto): Promise<Coordinator>;
    remove(id: string): Promise<Coordinator>;
    findBySchool(schoolId: string): Promise<Coordinator[]>;
    findActive(): Promise<Coordinator[]>;
    importFromFile(file: FileSystemStoredFile): Promise<ImportResult>;
}
