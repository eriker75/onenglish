import { PrismaService } from '../database/prisma.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { QuerySchoolDto } from './dto/query-school.dto';
import { School } from './entities/school.entity';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { ImportResult } from '../common/interfaces/import-result.interface';
export declare class SchoolsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private generateSchoolCode;
    create(createSchoolDto: CreateSchoolDto): Promise<School>;
    findAll(): Promise<School[]>;
    findAllPaginated(query: QuerySchoolDto): Promise<PaginatedResponseDto<School>>;
    findOne(id: string): Promise<School>;
    update(id: string, updateSchoolDto: UpdateSchoolDto): Promise<School>;
    remove(id: string): Promise<School>;
    findByCode(code: string): Promise<School | null>;
    findBySchoolId(schoolId: number): Promise<School | null>;
    findActive(): Promise<School[]>;
    importFromFile(file: FileSystemStoredFile): Promise<ImportResult>;
}
