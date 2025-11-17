import { ImportFileDto, ImportResponseDto } from '../common';
import { CoordinatorsService } from './coordinators.service';
import { CreateCoordinatorDto } from './dto/create-coordinator.dto';
import { UpdateCoordinatorDto } from './dto/update-coordinator.dto';
import { QueryCoordinatorDto } from './dto/query-coordinator.dto';
import { Coordinator } from './entities/coordinator.entity';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';
export declare class CoordinatorsController {
    private readonly coordinatorsService;
    constructor(coordinatorsService: CoordinatorsService);
    create(createCoordinatorDto: CreateCoordinatorDto): Promise<Coordinator>;
    findAll(query: QueryCoordinatorDto): Promise<PaginatedResponseDto<Coordinator>>;
    findActive(): Promise<Coordinator[]>;
    findBySchool(schoolId: string): Promise<Coordinator[]>;
    findOne(id: string): Promise<Coordinator>;
    update(id: string, updateCoordinatorDto: UpdateCoordinatorDto): Promise<Coordinator>;
    remove(id: string): Promise<Coordinator>;
    importCoordinators(dto: ImportFileDto): Promise<ImportResponseDto>;
}
