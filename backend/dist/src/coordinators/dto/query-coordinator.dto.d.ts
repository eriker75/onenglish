import { PaginationDto } from '../../common/dtos/pagination.dto';
export declare class QueryCoordinatorDto extends PaginationDto {
    schoolId?: string;
    isActive?: boolean;
    search?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
}
