import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/user.decorator';
import { AuthService } from './services/auth.service';
import { CryptoService } from './services/crypto.service';
import { JwtService } from './services/jwt.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterStudentDto } from './dto/register-student.dto';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ValidRole } from '../common/definitions/enums';
import type { User } from 'src/common/definitions/interfaces/user.types';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Endpoint to register a new user
   * POST /auth/register
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or terms not accepted',
  })
  @ApiResponse({
    status: 409,
    description: 'Email or username already exists',
  })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  /**
   * Endpoint to register a new student (public)
   * POST /auth/register/student
   * Automatically assigns STUDENT role and creates student profile
   */
  @Post('register/student')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new student (public endpoint)' })
  @ApiBody({ type: RegisterStudentDto })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or terms not accepted',
  })
  @ApiResponse({
    status: 409,
    description: 'Email or username already exists',
  })
  async registerStudent(@Body() registerStudentDto: RegisterStudentDto) {
    return await this.authService.registerStudent(registerStudentDto);
  }

  /**
   * Endpoint to register a new admin (DEVELOPMENT ONLY)
   * POST /auth/register/admin
   * Only available in development environment (NODE_ENV !== 'production')
   * Returns 404 in production
   */
  @Post('register/admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new admin (DEVELOPMENT ONLY)',
    description:
      'This endpoint is only available in development environment. Returns 404 in production.',
  })
  @ApiBody({ type: RegisterAdminDto })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or terms not accepted',
  })
  @ApiResponse({
    status: 404,
    description: 'Endpoint not available in production',
  })
  @ApiResponse({
    status: 409,
    description: 'Email or username already exists',
  })
  async registerAdmin(@Body() registerAdminDto: RegisterAdminDto) {
    // Check environment - only allow in development
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');

    if (nodeEnv === 'production') {
      throw new NotFoundException();
    }

    return await this.authService.registerAdmin(registerAdminDto);
  }

  /**
   * Endpoint to perform user login
   * POST /auth/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  async login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto);
  }

  /**
   * Endpoint to perform user logout
   * POST /auth/logout
   * Requires authentication (JWT Guard - to be implemented)
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout' })
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'Successful logout',
  })
  async logout(@GetUser() user: User) {
    return this.authService.logout(user.id);
  }

  /**
   * Endpoint to refresh token
   * POST /auth/refresh
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiBody({
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
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      example: {
        success: true,
        message: 'Token refreshed successfully',
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token',
  })
  refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  /**
   * Endpoint to validate token
   * GET /auth/validate
   * Requires authentication (JWT Guard - to be implemented)
   */
  @Get('validate')
  @ApiOperation({ summary: 'Validate JWT token' })
  @Auth()
  @ApiResponse({
    status: 200,
    description: 'Valid token',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token',
  })
  validateToken(@GetUser() user: User) {
    return {
      success: true,
      message: 'Valid token',
      user,
    };
  }

  /**
   * Endpoint to get authenticated user profile
   * GET /auth/profile
   * Requires authentication and user role
   */
  @Get('profile')
  @Auth()
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated',
  })
  @ApiResponse({
    status: 403,
    description: 'Insufficient permissions',
  })
  getProfile(@GetUser() user: User) {
    return {
      success: true,
      user,
    };
  }

  /**
   * Endpoint to test password hashing functionality
   * POST /auth/test-password
   * This endpoint should be removed in production
   */
  @Post('test-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Test password hashing (development only)' })
  @ApiBody({
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
  })
  @ApiResponse({
    status: 200,
    description: 'Password hashing test result',
    schema: {
      example: {
        success: true,
        hashed: 'salt:hash',
        isValid: true,
      },
    },
  })
  testPasswordHashing(@Body() body: { password: string }) {
    const result = this.cryptoService.testHashing(body.password);
    return {
      success: true,
      ...result,
    };
  }

  /**
   * Endpoint to validate password strength
   * POST /auth/validate-password
   */
  @Post('validate-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate password strength' })
  @ApiBody({
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
  })
  @ApiResponse({
    status: 200,
    description: 'Password validation result',
    schema: {
      example: {
        success: true,
        isValid: true,
        message: 'Password is valid',
      },
    },
  })
  validatePasswordStrength(@Body() body: { password: string }) {
    const result = this.cryptoService.validateInputStrength(body.password);
    return {
      success: true,
      ...result,
    };
  }

  /**
   * Endpoint to generate a secure password
   * GET /auth/generate-password
   */
  @Get('generate-password')
  @ApiOperation({ summary: 'Generate a secure random password' })
  @ApiResponse({
    status: 200,
    description: 'Generated secure password',
    schema: {
      example: {
        success: true,
        password: 'A1b2C3d4E5f6!',
        length: 12,
      },
    },
  })
  generateSecurePassword() {
    const password = this.cryptoService.generateSecureToken();
    return {
      success: true,
      password,
      length: password.length,
    };
  }

  /**
   * Endpoint for admin only - get all users
   * GET /auth/admin/users
   * Requires authentication and admin role
   */
  @Get('admin/users')
  @Auth(ValidRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
  })
  @ApiResponse({
    status: 401,
    description: 'Not authenticated',
  })
  @ApiResponse({
    status: 403,
    description: 'Admin access required',
  })
  getAllUsers() {
    return {
      success: true,
      message: 'Admin endpoint - get all users',
      users: [],
    };
  }

  /**
   * Endpoint to test JWT token generation
   * GET /auth/test-tokens
   * This endpoint should be removed in production
   */
  @Get('test-tokens')
  @ApiOperation({ summary: 'Test JWT token generation (development only)' })
  @ApiResponse({
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
  })
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        return {
          success: false,
          message: 'Error generating tokens',
          error: error.message,
        };
      } else {
        throw new InternalServerErrorException('Unknown error occurred');
      }
    }
  }
}
