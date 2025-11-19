import { ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { CryptoService } from './services/crypto.service';
import { JwtService } from './services/jwt.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterStudentDto } from './dto/register-student.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import type { User } from 'src/common/definitions/interfaces/user.types';
export declare class AuthController {
    private readonly authService;
    private readonly cryptoService;
    private readonly jwtService;
    private readonly configService;
    constructor(authService: AuthService, cryptoService: CryptoService, jwtService: JwtService, configService: ConfigService);
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
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
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
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
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
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
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
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                phone: string | null;
                firstName: string;
                lastName: string;
                bio: string | null;
                avatar: string | null;
                userId: string;
            } | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
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
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
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
    logout(user: User): Promise<{
        success: boolean;
        message: string;
    }>;
    refreshToken(body: {
        refreshToken: string;
    }): {
        success: boolean;
        message: string;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        refreshExpiresIn: number;
    };
    validateToken(user: User): {
        success: boolean;
        message: string;
        user: User;
    };
    getProfile(user: User): {
        success: boolean;
        user: User;
    };
    testPasswordHashing(body: {
        password: string;
    }): {
        hashed: string;
        isValid: boolean;
        success: boolean;
    };
    validatePasswordStrength(body: {
        password: string;
    }): {
        isValid: boolean;
        message?: string;
        success: boolean;
    };
    generateSecurePassword(): {
        success: boolean;
        password: string;
        length: number;
    };
    getAllUsers(): {
        success: boolean;
        message: string;
        users: never[];
    };
    testTokens(): {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        refreshExpiresIn: number;
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: string;
    };
}
