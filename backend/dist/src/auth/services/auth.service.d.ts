import { PrismaService } from '../../database/prisma.service';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterDto } from '../dto/register.dto';
import { RegisterStudentDto } from '../dto/register-student.dto';
import { RegisterAdminDto } from '../dto/register-admin.dto';
import { CryptoService } from './crypto.service';
import { JwtService } from './jwt.service';
export declare class AuthService {
    private readonly prisma;
    private readonly cryptoService;
    private readonly jwtService;
    constructor(prisma: PrismaService, cryptoService: CryptoService, jwtService: JwtService);
    testPasswordHashing(password: string): {
        hashed: string;
        isValid: boolean;
    };
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        refreshExpiresIn: number;
        success: boolean;
        message: string;
        user: {
            roles: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            email: string;
            phone: string | null;
            firstName: string;
            lastName: string;
            bio: string | null;
            avatar: string | null;
            username: string | null;
            isOnline: boolean;
            isVerified: boolean;
            lastLoginAt: Date | null;
            emailVerifiedAt: Date | null;
        };
    }>;
    registerStudent(registerStudentDto: RegisterStudentDto): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        refreshExpiresIn: number;
        success: boolean;
        message: string;
        user: {
            roles: string;
            student: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                schoolId: string | null;
                email: string;
                phone: string | null;
                firstName: string;
                lastName: string;
                bio: string | null;
                avatar: string | null;
                userId: string;
            } | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            email: string;
            phone: string | null;
            firstName: string;
            lastName: string;
            bio: string | null;
            avatar: string | null;
            username: string | null;
            isOnline: boolean;
            isVerified: boolean;
            lastLoginAt: Date | null;
            emailVerifiedAt: Date | null;
        };
    }>;
    registerAdmin(registerAdminDto: RegisterAdminDto): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        refreshExpiresIn: number;
        success: boolean;
        message: string;
        user: {
            roles: string;
            admin: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isActive: boolean;
                email: string;
                phone: string | null;
                firstName: string;
                lastName: string;
                bio: string | null;
                avatar: string | null;
                userId: string;
            } | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            email: string;
            phone: string | null;
            firstName: string;
            lastName: string;
            bio: string | null;
            avatar: string | null;
            username: string | null;
            isOnline: boolean;
            isVerified: boolean;
            lastLoginAt: Date | null;
            emailVerifiedAt: Date | null;
        };
    }>;
    login(loginDto: LoginUserDto): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        refreshExpiresIn: number;
        success: boolean;
        message: string;
        user: {
            roles: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isActive: boolean;
            email: string;
            phone: string | null;
            firstName: string;
            lastName: string;
            bio: string | null;
            avatar: string | null;
            username: string | null;
            isOnline: boolean;
            isVerified: boolean;
            lastLoginAt: Date | null;
            emailVerifiedAt: Date | null;
        };
    }>;
    logout(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    validateToken(token: string): Promise<{
        success: boolean;
        message: string;
        user: {
            id: string;
            email: string;
            username: string | null;
            firstName: string;
            lastName: string;
            isActive: true;
            isVerified: boolean;
        };
        payload: import("../definitions/JwtPayload.interface").JwtPayload;
    }>;
    refreshToken(refreshToken: string): {
        success: boolean;
        message: string;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        refreshExpiresIn: number;
    };
}
