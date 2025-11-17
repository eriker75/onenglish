import { CreateRevisionDto } from './dto/create-revision.dto';
import { UpdateRevisionDto } from './dto/update-revision.dto';
export declare class RevisionsService {
    create(createRevisionDto: CreateRevisionDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateRevisionDto: UpdateRevisionDto): string;
    remove(id: number): string;
}
