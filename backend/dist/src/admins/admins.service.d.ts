import { PrismaService } from '../database/prisma.service';
import { CryptoService } from '../auth/services/crypto.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
export declare class AdminsService {
    private readonly prisma;
    private readonly cryptoService;
    constructor(prisma: PrismaService, cryptoService: CryptoService);
    create(dto: CreateAdminDto): Promise<Admin>;
    findAll(): Promise<Admin[]>;
    findOne(id: string): Promise<Admin>;
    update(id: string, dto: UpdateAdminDto): Promise<Admin>;
    remove(id: string): Promise<Admin>;
    findActive(): Promise<Admin[]>;
}
