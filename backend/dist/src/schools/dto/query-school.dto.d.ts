import { PaginationDto } from '../../common/dtos/pagination.dto';
export declare class QuerySchoolDto extends PaginationDto {
    isActive?: boolean;
    search?: string;
    name?: string;
    code?: string;
    schoolId?: number;
    city?: string;
    state?: string;
    country?: string;
}
