import { PaginationDto } from '../../common/dtos/pagination.dto';
export declare class QueryChallengeDto extends PaginationDto {
    category?: string;
    level?: string;
    difficulty?: string;
    isPublished?: boolean;
    isActive?: boolean;
    search?: string;
    title?: string;
    slug?: string;
}
