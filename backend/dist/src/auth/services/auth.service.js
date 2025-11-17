"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const crypto_service_1 = require("./crypto.service");
const jwt_service_1 = require("./jwt.service");
let AuthService = class AuthService {
    prisma;
    cryptoService;
    jwtService;
    constructor(prisma, cryptoService, jwtService) {
        this.prisma = prisma;
        this.cryptoService = cryptoService;
        this.jwtService = jwtService;
    }
    testPasswordHashing(password) {
        function isHashResult(obj) {
            if (typeof obj === 'object' &&
                obj !== null &&
                'hashed' in obj &&
                'isValid' in obj) {
                const hashed = obj.hashed;
                const isValid = obj.isValid;
                return typeof hashed === 'string' && typeof isValid === 'boolean';
            }
            return false;
        }
        try {
            const result = this.cryptoService.testHashing(password);
            if (isHashResult(result)) {
                return {
                    hashed: result.hashed,
                    isValid: result.isValid,
                };
            }
            throw new common_1.BadRequestException('Unexpected result from hashing function');
        }
        catch (error) {
            throw new common_1.BadRequestException(error instanceof Error ? error.message : 'Invalid password input');
        }
    }
    async register(registerDto) {
        const { email, password, firstName, lastName, username, phone, bio, acceptTerms, } = registerDto;
        if (!acceptTerms) {
            throw new common_1.BadRequestException('You must accept the terms and conditions to register');
        }
        const existingUserByEmail = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUserByEmail) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        if (username) {
            const existingUserByUsername = await this.prisma.user.findUnique({
                where: { username },
            });
            if (existingUserByUsername) {
                throw new common_1.ConflictException('Username already taken');
            }
        }
        const hashedPassword = this.cryptoService.hashDataForStorage(password);
        const newUser = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                username,
                phone,
                bio,
                isActive: true,
                isVerified: false,
                isOnline: false,
            },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        const { password: pass, roles: userRoles, ...userWithoutPassword } = newUser;
        console.log(pass);
        const roleHierarchy = ['admin', 'coordinator', 'teacher', 'employee', 'student'];
        const sortedRoles = userRoles
            .map(ur => ur.role.name.toLowerCase())
            .sort((a, b) => {
            const indexA = roleHierarchy.indexOf(a);
            const indexB = roleHierarchy.indexOf(b);
            return indexA - indexB;
        });
        const rolesString = sortedRoles.join(',');
        const tokens = this.jwtService.generateTokenPair({
            sub: newUser.id,
            email: newUser.email,
            username: newUser.username ?? '',
        });
        const response = {
            success: true,
            message: 'User registered successfully',
            user: {
                ...userWithoutPassword,
                roles: rolesString,
            },
            ...tokens,
        };
        console.log('Register response:', JSON.stringify(response, null, 2));
        return response;
    }
    async registerStudent(registerStudentDto) {
        const { email, password, firstName, lastName, username, phone, bio, acceptTerms, } = registerStudentDto;
        if (!acceptTerms) {
            throw new common_1.BadRequestException('You must accept the terms and conditions to register');
        }
        const existingUserByEmail = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUserByEmail) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        if (username) {
            const existingUserByUsername = await this.prisma.user.findUnique({
                where: { username },
            });
            if (existingUserByUsername) {
                throw new common_1.ConflictException('Username already taken');
            }
        }
        const hashedPassword = this.cryptoService.hashDataForStorage(password);
        try {
            let studentRole = await this.prisma.role.findUnique({
                where: { name: 'student' },
            });
            if (!studentRole) {
                studentRole = await this.prisma.role.create({
                    data: {
                        name: 'student',
                        description: 'Student role',
                        isActive: true,
                    },
                });
            }
            if (!studentRole) {
                throw new common_1.BadRequestException('Failed to get or create student role');
            }
            const studentRoleId = studentRole.id;
            const result = await this.prisma.$transaction(async (tx) => {
                const newUser = await tx.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        firstName,
                        lastName,
                        username,
                        phone,
                        bio,
                        isActive: true,
                        isVerified: false,
                        isOnline: false,
                    },
                });
                await tx.userRole.create({
                    data: {
                        userId: newUser.id,
                        roleId: studentRoleId,
                    },
                });
                await tx.student.create({
                    data: {
                        id: newUser.id,
                        firstName,
                        lastName,
                        email,
                        phone,
                        bio,
                        userId: newUser.id,
                        isActive: true,
                    },
                });
                const userWithRoles = await tx.user.findUnique({
                    where: { id: newUser.id },
                    include: {
                        roles: {
                            include: {
                                role: true,
                            },
                        },
                        student: true,
                    },
                });
                return userWithRoles;
            });
            if (!result) {
                throw new common_1.BadRequestException('Failed to create student user');
            }
            const { password: _, roles: userRoles, ...userWithoutPassword } = result;
            const roleHierarchy = ['admin', 'coordinator', 'teacher', 'employee', 'student'];
            const sortedRoles = userRoles
                .map(ur => ur.role.name.toLowerCase())
                .sort((a, b) => {
                const indexA = roleHierarchy.indexOf(a);
                const indexB = roleHierarchy.indexOf(b);
                return indexA - indexB;
            });
            const rolesString = sortedRoles.join(',');
            const tokens = this.jwtService.generateTokenPair({
                sub: result.id,
                email: result.email,
                username: result.username ?? '',
            });
            const response = {
                success: true,
                message: 'Student registered successfully',
                user: {
                    ...userWithoutPassword,
                    roles: rolesString,
                },
                ...tokens,
            };
            console.log('Register Student response:', JSON.stringify(response, null, 2));
            return response;
        }
        catch (error) {
            if (error instanceof common_1.ConflictException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to register student: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async registerAdmin(registerAdminDto) {
        const { email, password, firstName, lastName, username, phone, bio, acceptTerms, } = registerAdminDto;
        if (!acceptTerms) {
            throw new common_1.BadRequestException('You must accept the terms and conditions to register');
        }
        const existingUserByEmail = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUserByEmail) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        if (username) {
            const existingUserByUsername = await this.prisma.user.findUnique({
                where: { username },
            });
            if (existingUserByUsername) {
                throw new common_1.ConflictException('Username already taken');
            }
        }
        const hashedPassword = this.cryptoService.hashDataForStorage(password);
        try {
            let adminRole = await this.prisma.role.findUnique({
                where: { name: 'admin' },
            });
            if (!adminRole) {
                adminRole = await this.prisma.role.create({
                    data: {
                        name: 'admin',
                        description: 'Admin role',
                        isActive: true,
                    },
                });
            }
            if (!adminRole) {
                throw new common_1.BadRequestException('Failed to get or create admin role');
            }
            const adminRoleId = adminRole.id;
            const result = await this.prisma.$transaction(async (tx) => {
                const newUser = await tx.user.create({
                    data: {
                        email,
                        password: hashedPassword,
                        firstName,
                        lastName,
                        username,
                        phone,
                        bio,
                        isActive: true,
                        isVerified: true,
                        isOnline: false,
                    },
                });
                await tx.userRole.create({
                    data: {
                        userId: newUser.id,
                        roleId: adminRoleId,
                    },
                });
                await tx.admin.create({
                    data: {
                        id: newUser.id,
                        firstName,
                        lastName,
                        email,
                        phone,
                        bio,
                        userId: newUser.id,
                        isActive: true,
                    },
                });
                const userWithRoles = await tx.user.findUnique({
                    where: { id: newUser.id },
                    include: {
                        roles: {
                            include: {
                                role: true,
                            },
                        },
                        admin: true,
                    },
                });
                return userWithRoles;
            });
            if (!result) {
                throw new common_1.BadRequestException('Failed to create admin user');
            }
            const { password: _, roles: userRoles, ...userWithoutPassword } = result;
            const roleHierarchy = ['admin', 'coordinator', 'teacher', 'employee', 'student'];
            const sortedRoles = userRoles
                .map(ur => ur.role.name.toLowerCase())
                .sort((a, b) => {
                const indexA = roleHierarchy.indexOf(a);
                const indexB = roleHierarchy.indexOf(b);
                return indexA - indexB;
            });
            const rolesString = sortedRoles.join(',');
            const tokens = this.jwtService.generateTokenPair({
                sub: result.id,
                email: result.email,
                username: result.username ?? '',
            });
            const response = {
                success: true,
                message: 'Admin registered successfully',
                user: {
                    ...userWithoutPassword,
                    roles: rolesString,
                },
                ...tokens,
            };
            console.log('Register Admin response:', JSON.stringify(response, null, 2));
            return response;
        }
        catch (error) {
            if (error instanceof common_1.ConflictException || error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to register admin: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async login(loginDto) {
        const { email, username, password } = loginDto;
        if (!email && !username) {
            throw new common_1.BadRequestException('Email or username are required for login');
        }
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [email ? { email } : {}, username ? { username } : {}].filter((condition) => Object.keys(condition).length > 0),
            },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('User is inactive, contact administrator');
        }
        if (!user.password) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = this.cryptoService.verifyStoredHash(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                lastLoginAt: new Date(),
                isOnline: true,
            },
        });
        const { password: _, roles: userRoles, ...userWithoutPassword } = user;
        const roleHierarchy = ['admin', 'coordinator', 'teacher', 'employee', 'student'];
        const sortedRoles = userRoles
            .map(ur => ur.role.name.toLowerCase())
            .sort((a, b) => {
            const indexA = roleHierarchy.indexOf(a);
            const indexB = roleHierarchy.indexOf(b);
            return indexA - indexB;
        });
        const rolesString = sortedRoles.join(',');
        const tokens = this.jwtService.generateTokenPair({
            sub: user.id,
            email: user.email,
            username: user.username ?? '',
        });
        const response = {
            success: true,
            message: 'Login successful',
            user: {
                ...userWithoutPassword,
                roles: rolesString,
            },
            ...tokens,
        };
        console.log('Login response:', JSON.stringify(response, null, 2));
        return response;
    }
    async logout(userId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                isOnline: false,
            },
        });
        return {
            success: true,
            message: 'Logout successful',
        };
    }
    async validateToken(token) {
        const payload = this.jwtService.verifyAccessToken(token);
        if (!payload) {
            throw new common_1.BadRequestException('Invalid or expired token');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });
        if (!user || !user.isActive) {
            throw new common_1.BadRequestException('User not found or inactive');
        }
        return {
            success: true,
            message: 'Token is valid',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                isActive: user.isActive,
                isVerified: user.isVerified,
            },
            payload,
        };
    }
    refreshToken(refreshToken) {
        const newAccessToken = this.jwtService.refreshAccessToken(refreshToken);
        if (!newAccessToken) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        const expiresIn = this.jwtService['getAccessTokenExpiry']
            ? this.jwtService['getAccessTokenExpiry']()
            : 3600;
        const refreshExpiresIn = this.jwtService['getRefreshTokenExpiry']
            ? this.jwtService['getRefreshTokenExpiry']()
            : 604800;
        return {
            success: true,
            message: 'Token refreshed successfully',
            accessToken: newAccessToken,
            refreshToken: refreshToken,
            expiresIn,
            refreshExpiresIn,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        crypto_service_1.CryptoService,
        jwt_service_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map