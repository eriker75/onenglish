import { PaginationDto } from '../../common/dtos/pagination.dto';
export declare class QueryStudentDto extends PaginationDto {
    schoolId?: string;
    isActive?: boolean;
    search?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
}
