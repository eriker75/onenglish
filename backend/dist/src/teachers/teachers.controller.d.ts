import { ImportFileDto, ImportResponseDto } from '../common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { QueryTeacherDto } from './dto/query-teacher.dto';
import { Teacher } from './entities/teacher.entity';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';
export declare class TeachersController {
    private readonly teachersService;
    constructor(teachersService: TeachersService);
    create(createTeacherDto: CreateTeacherDto): Promise<Teacher>;
    findAll(query: QueryTeacherDto): Promise<PaginatedResponseDto<Teacher>>;
    findActive(): Promise<Teacher[]>;
    findBySchool(schoolId: string): Promise<Teacher[]>;
    findOne(id: string): Promise<Teacher>;
    update(id: string, updateTeacherDto: UpdateTeacherDto): Promise<Teacher>;
    remove(id: string): Promise<Teacher>;
    importTeachers(dto: ImportFileDto): Promise<ImportResponseDto>;
}
