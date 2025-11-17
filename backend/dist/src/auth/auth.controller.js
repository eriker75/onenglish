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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_decorator_1 = require("./decorators/auth.decorator");
const user_decorator_1 = require("./decorators/user.decorator");
const auth_service_1 = require("./services/auth.service");
const crypto_service_1 = require("./services/crypto.service");
const jwt_service_1 = require("./services/jwt.service");
const login_user_dto_1 = require("./dto/login-user.dto");
const register_dto_1 = require("./dto/register.dto");
const register_student_dto_1 = require("./dto/register-student.dto");
const register_admin_dto_1 = require("./dto/register-admin.dto");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../common/definitions/enums");
let AuthController = class AuthController {
    authService;
    cryptoService;
    jwtService;
    configService;
    constructor(authService, cryptoService, jwtService, configService) {
        this.authService = authService;
        this.cryptoService = cryptoService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(registerDto) {
        return await this.authService.register(registerDto);
    }
    async registerStudent(registerStudentDto) {
        return await this.authService.registerStudent(registerStudentDto);
    }
    async registerAdmin(registerAdminDto) {
        const nodeEnv = this.configService.get('NODE_ENV', 'development');
        if (nodeEnv === 'production') {
            throw new common_1.NotFoundException();
        }
        return await this.authService.registerAdmin(registerAdminDto);
    }
    async login(loginDto) {
        return this.authService.login(loginDto);
    }
    async logout(user) {
        return this.authService.logout(user.id);
    }
    refreshToken(body) {
        return this.authService.refreshToken(body.refreshToken);
    }
    validateToken(user) {
        return {
            success: true,
            message: 'Valid token',
            user,
        };
    }
    getProfile(user) {
        return {
            success: true,
            user,
        };
    }
    testPasswordHashing(body) {
        const result = this.cryptoService.testHashing(body.password);
        return {
            success: true,
            ...result,
        };
    }
    validatePasswordStrength(body) {
        const result = this.cryptoService.validateInputStrength(body.password);
        return {
            success: true,
            ...result,
        };
    }
    generateSecurePassword() {
        const password = this.cryptoService.generateSecureToken();
        return {
            success: true,
            password,
            length: password.length,
        };
    }
    getAllUsers() {
        return {
            success: true,
            message: 'Admin endpoint - get all users',
            users: [],
        };
    }
    testTokens() {
        try {
            const tokens = this.jwtService.generateTokenPair({
                sub: 'test-user-id',
                email: 'test@example.com',
                username: 'testuser',
            });
            return {
                success: true,
                message: 'Test tokens generated',
                ...tokens,
            };
        }
        catch (error) {
            if (error instanceof Error) {
                return {
                    success: false,
                    message: 'Error generating tokens',
                    error: error.message,
                };
            }
            else {
                throw new common_1.InternalServerErrorException('Unknown error occurred');
            }
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiBody)({ type: register_dto_1.RegisterDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User registered successfully',
        schema: {
            example: {
                success: true,
                message: 'User registered successfully',
                user: {
                    id: 'uuid',
                    email: 'user@example.com',
                    username: 'john_doe',
                    firstName: 'John',
                    lastName: 'Doe',
                    phone: '+1234567890',
                    bio: 'I love learning English!',
                    isOnline: false,
                    isActive: true,
                    isVerified: false,
                    roles: 'student',
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                },
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                expiresIn: 3600,
                refreshExpiresIn: 604800,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data or terms not accepted',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Email or username already exists',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('register/student'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new student (public endpoint)' }),
    (0, swagger_1.ApiBody)({ type: register_student_dto_1.RegisterStudentDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Student registered successfully',
        schema: {
            example: {
                success: true,
                message: 'Student registered successfully',
                user: {
                    id: 'uuid',
                    email: 'student@example.com',
                    username: 'student_john',
                    firstName: 'John',
                    lastName: 'Doe',
                    phone: '+1234567890',
                    bio: 'I love learning English!',
                    isOnline: false,
                    isActive: true,
                    isVerified: false,
                    roles: 'student',
                    student: {
                        id: 'uuid',
                        firstName: 'John',
                        lastName: 'Doe',
                        email: 'student@example.com',
                        phone: '+1234567890',
                        bio: 'I love learning English!',
                        isActive: true,
                        schoolId: null,
                    },
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                },
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                expiresIn: 3600,
                refreshExpiresIn: 604800,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data or terms not accepted',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Email or username already exists',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_student_dto_1.RegisterStudentDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerStudent", null);
__decorate([
    (0, common_1.Post)('register/admin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Register a new admin (DEVELOPMENT ONLY)',
        description: 'This endpoint is only available in development environment. Returns 404 in production.',
    }),
    (0, swagger_1.ApiBody)({ type: register_admin_dto_1.RegisterAdminDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Admin registered successfully (development only)',
        schema: {
            example: {
                success: true,
                message: 'Admin registered successfully',
                user: {
                    id: 'uuid',
                    email: 'admin@example.com',
                    username: 'admin_john',
                    firstName: 'John',
                    lastName: 'Doe',
                    phone: '+1234567890',
                    bio: 'System administrator',
                    isOnline: false,
                    isActive: true,
                    isVerified: true,
                    roles: 'admin',
                    admin: {
                        id: 'uuid',
                        firstName: 'John',
                        lastName: 'Doe',
                        email: 'admin@example.com',
                        phone: '+1234567890',
                        bio: 'System administrator',
                        isActive: true,
                    },
                    createdAt: '2024-01-01T00:00:00.000Z',
                    updatedAt: '2024-01-01T00:00:00.000Z',
                },
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                expiresIn: 3600,
                refreshExpiresIn: 604800,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data or terms not accepted',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Endpoint not available in production',
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'Email or username already exists',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_admin_dto_1.RegisterAdminDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerAdmin", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'User login' }),
    (0, swagger_1.ApiBody)({ type: login_user_dto_1.LoginUserDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successful login',
        schema: {
            example: {
                success: true,
                message: 'Login successful',
                user: {
                    id: 'uuid',
                    email: 'user@example.com',
                    username: 'john_doe',
                    firstName: 'John',
                    lastName: 'Doe',
                    isOnline: true,
                    isActive: true,
                    isVerified: true,
                    roles: 'admin,coordinator',
                },
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                expiresIn: 3600,
                refreshExpiresIn: 604800,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid credentials',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid input data',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'User logout' }),
    (0, auth_decorator_1.Auth)(),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successful logout',
    }),
    __param(0, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh JWT token' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                refreshToken: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    description: 'Valid refresh token',
                },
            },
            required: ['refreshToken'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token refreshed successfully',
        schema: {
            example: {
                success: true,
                message: 'Token refreshed successfully',
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid or expired refresh token',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Get)('validate'),
    (0, swagger_1.ApiOperation)({ summary: 'Validate JWT token' }),
    (0, auth_decorator_1.Auth)(),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Valid token',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid or expired token',
    }),
    __param(0, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "validateToken", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, auth_decorator_1.Auth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get authenticated user profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User profile',
        schema: {
            example: {
                success: true,
                user: {
                    id: 'uuid',
                    email: 'user@example.com',
                    username: 'john_doe',
                    firstName: 'John',
                    lastName: 'Doe',
                    isActive: true,
                    isVerified: true,
                    roles: 'admin,coordinator',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Not authenticated',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Insufficient permissions',
    }),
    __param(0, (0, user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('test-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Test password hashing (development only)' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                password: {
                    type: 'string',
                    example: 'testpassword123',
                    description: 'Password to test',
                },
            },
            required: ['password'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password hashing test result',
        schema: {
            example: {
                success: true,
                hashed: 'salt:hash',
                isValid: true,
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "testPasswordHashing", null);
__decorate([
    (0, common_1.Post)('validate-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Validate password strength' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                password: {
                    type: 'string',
                    example: 'mypassword123',
                    description: 'Password to validate',
                },
            },
            required: ['password'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password validation result',
        schema: {
            example: {
                success: true,
                isValid: true,
                message: 'Password is valid',
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "validatePasswordStrength", null);
__decorate([
    (0, common_1.Get)('generate-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a secure random password' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Generated secure password',
        schema: {
            example: {
                success: true,
                password: 'A1b2C3d4E5f6!',
                length: 12,
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "generateSecurePassword", null);
__decorate([
    (0, common_1.Get)('admin/users'),
    (0, auth_decorator_1.Auth)(enums_1.ValidRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users (admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all users',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Not authenticated',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Admin access required',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('test-tokens'),
    (0, swagger_1.ApiOperation)({ summary: 'Test JWT token generation (development only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'JWT tokens generated for testing',
        schema: {
            example: {
                success: true,
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                expiresIn: 3600,
                refreshExpiresIn: 604800,
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "testTokens", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        crypto_service_1.CryptoService,
        jwt_service_1.JwtService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map