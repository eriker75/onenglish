import { PrismaService } from '../database/prisma.service';
import { CryptoService } from '../auth/services/crypto.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { QueryStudentDto } from './dto/query-student.dto';
import { Student } from './entities/student.entity';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { ImportResult } from '../common/interfaces/import-result.interface';
import { ValidRole } from '../common/definitions/enums';
type StudentCreationContext = {
    requesterId: string;
    dominantRole?: ValidRole;
    roles?: string;
    enforcedSchoolId?: string | null;
    skipSchoolValidation?: boolean;
};
export declare class StudentsService {
    private readonly prisma;
    private readonly cryptoService;
    private readonly logger;
    constructor(prisma: PrismaService, cryptoService: CryptoService);
    create(dto: CreateStudentDto, context?: StudentCreationContext): Promise<Student>;
    private ensureStudentRole;
    private resolveSchoolId;
    private verifySchoolExists;
    private getDominantRole;
    findAll(userSchoolId?: string): Promise<Student[]>;
    findAllPaginated(query: QueryStudentDto, userSchoolId?: string): Promise<PaginatedResponseDto<Student>>;
    findOne(id: string): Promise<Student>;
    update(id: string, dto: UpdateStudentDto): Promise<Student>;
    remove(id: string): Promise<Student>;
    findBySchool(schoolId: string): Promise<Student[]>;
    findActive(userSchoolId?: string): Promise<Student[]>;
    createStudent(dto: CreateStudentDto): Promise<Student>;
    findAllStudents(): Promise<Student[]>;
    findOneStudent(id: string): Promise<Student>;
    updateStudent(id: string, dto: UpdateStudentDto): Promise<Student>;
    removeStudent(id: string): Promise<Student>;
    importFromFile(file: FileSystemStoredFile, options: {
        requesterId: string;
        roles: string;
        schoolIdFromRequest?: string;
    }): Promise<ImportResult>;
}
export {};
