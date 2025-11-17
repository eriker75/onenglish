import { PrismaService } from '../database/prisma.service';
import { CryptoService } from '../auth/services/crypto.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { QueryTeacherDto } from './dto/query-teacher.dto';
import { Teacher } from './entities/teacher.entity';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { ImportResult } from '../common/interfaces/import-result.interface';
export declare class TeachersService {
    private readonly prisma;
    private readonly cryptoService;
    private readonly logger;
    constructor(prisma: PrismaService, cryptoService: CryptoService);
    create(dto: CreateTeacherDto): Promise<Teacher>;
    findAll(): Promise<Teacher[]>;
    findAllPaginated(query: QueryTeacherDto): Promise<PaginatedResponseDto<Teacher>>;
    findOne(id: string): Promise<Teacher>;
    update(id: string, dto: UpdateTeacherDto): Promise<Teacher>;
    remove(id: string): Promise<Teacher>;
    findBySchool(schoolId: string): Promise<Teacher[]>;
    findActive(): Promise<Teacher[]>;
    importFromFile(file: FileSystemStoredFile): Promise<ImportResult>;
}
