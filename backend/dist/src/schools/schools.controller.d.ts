import { ImportFileDto, ImportResponseDto } from '../common';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { QuerySchoolDto } from './dto/query-school.dto';
import { School } from './entities/school.entity';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';
export declare class SchoolsController {
    private readonly schoolsService;
    constructor(schoolsService: SchoolsService);
    create(createSchoolDto: CreateSchoolDto): Promise<School>;
    findAll(query: QuerySchoolDto): Promise<PaginatedResponseDto<School>>;
    findActive(): Promise<School[]>;
    findByCode(code: string): Promise<School | null>;
    findBySchoolId(schoolId: string): Promise<School | null>;
    findOne(id: string): Promise<School>;
    update(id: string, updateSchoolDto: UpdateSchoolDto): Promise<School>;
    remove(id: string): Promise<School>;
    importSchools(dto: ImportFileDto): Promise<ImportResponseDto>;
}
