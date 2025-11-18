import { PaginationDto } from '../../common/dtos/pagination.dto';
export declare class QueryChallengeDto extends PaginationDto {
    grade?: string;
    type?: string;
    stage?: string;
    isDemo?: boolean;
    isActive?: boolean;
    year?: number;
    exactDate?: string;
    search?: string;
    name?: string;
}
