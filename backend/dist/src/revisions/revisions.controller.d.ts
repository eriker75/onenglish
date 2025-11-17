import { RevisionsService } from './revisions.service';
import { CreateRevisionDto } from './dto/create-revision.dto';
import { UpdateRevisionDto } from './dto/update-revision.dto';
export declare class RevisionsController {
    private readonly revisionsService;
    constructor(revisionsService: RevisionsService);
    create(createRevisionDto: CreateRevisionDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateRevisionDto: UpdateRevisionDto): string;
    remove(id: string): string;
}
