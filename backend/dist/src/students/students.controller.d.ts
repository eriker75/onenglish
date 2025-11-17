import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { QueryStudentDto } from './dto/query-student.dto';
import { Student } from './entities/student.entity';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';
import { ImportResponseDto } from '../common';
import type { User } from '../common/definitions/interfaces/user.types';
import { ImportStudentsDto } from './dto/import-students.dto';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    create(createStudentDto: CreateStudentDto, user: User): Promise<Student>;
    findAll(query: QueryStudentDto): Promise<PaginatedResponseDto<Student>>;
    findActive(): Promise<Student[]>;
    findBySchool(schoolId: string): Promise<Student[]>;
    findOne(id: string): Promise<Student>;
    update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student>;
    remove(id: string): Promise<Student>;
    importStudents(dto: ImportStudentsDto, user: User): Promise<ImportResponseDto>;
}
