import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterDto } from '../dto/register.dto';
import { RegisterStudentDto } from '../dto/register-student.dto';
import { RegisterAdminDto } from '../dto/register-admin.dto';
import { CryptoService } from './crypto.service';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Test method to verify password hashing works correctly
   * This method should be removed in production
   * @param password - Password to test
   * @returns Object with hashed password and validation result
   */
  testPasswordHashing(password: string): { hashed: string; isValid: boolean } {
    function isHashResult(
      obj: unknown,
    ): obj is { hashed: string; isValid: boolean } {
      if (
        typeof obj === 'object' &&
        obj !== null &&
        'hashed' in obj &&
        'isValid' in obj
      ) {
        const hashed = (obj as Record<string, unknown>).hashed;
        const isValid = (obj as Record<string, unknown>).isValid;
        return typeof hashed === 'string' && typeof isValid === 'boolean';
      }
      return false;
    }
    try {
      const result = this.cryptoService.testHashing(password);
      if (isHashResult(result)) {
        return {
          hashed: (result as { hashed: string }).hashed,
          isValid: (result as { isValid: boolean }).isValid,
        };
      }
      throw new BadRequestException('Unexpected result from hashing function');
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Invalid password input',
      );
    }
  }

  /**
   * Method to register a new user
   * @param registerDto - Registration data (email, password, firstName, lastName, etc.)
   * @returns Created user without password
   */
  async register(registerDto: RegisterDto) {
    const {
      email,
      password,
      firstName,
      lastName,
      username,
      phone,
      bio,
      acceptTerms,
    } = registerDto;

    // Validate terms acceptance
    if (!acceptTerms) {
      throw new BadRequestException(
        'You must accept the terms and conditions to register',
      );
    }

    // Check if user with email already exists
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if username is provided and if it already exists
    if (username) {
      const existingUserByUsername = await this.prisma.user.findUnique({
        where: { username },
      });

      if (existingUserByUsername) {
        throw new ConflictException('Username already taken');
      }
    }

    // Hash password using CryptoService
    const hashedPassword = this.cryptoService.hashDataForStorage(password);

    // Create new user
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
        isVerified: false, // Email verification will be implemented later
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

    // Remove password from response
    const { password: pass, roles: userRoles, ...userWithoutPassword } = newUser;
    console.log(pass);

    // Sort roles by hierarchy and format as comma-separated string
    const roleHierarchy = ['admin', 'coordinator', 'teacher', 'employee', 'student'];
    const sortedRoles = userRoles
      .map(ur => ur.role.name.toLowerCase())
      .sort((a, b) => {
        const indexA = roleHierarchy.indexOf(a);
        const indexB = roleHierarchy.indexOf(b);
        return indexA - indexB;
      });
    
    const rolesString = sortedRoles.join(',');

    // Generate JWT tokens
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

  /**
   * Method to register a new student user (public endpoint)
   * Creates a User, assigns STUDENT role, and creates Student profile
   * @param registerStudentDto - Student registration data
   * @returns Created user with student profile and JWT tokens
   */
  async registerStudent(registerStudentDto: RegisterStudentDto) {
    const {
      email,
      password,
      firstName,
      lastName,
      username,
      phone,
      bio,
      acceptTerms,
    } = registerStudentDto;

    // Validate terms acceptance
    if (!acceptTerms) {
      throw new BadRequestException(
        'You must accept the terms and conditions to register',
      );
    }

    // Check if user with email already exists
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if username is provided and if it already exists
    if (username) {
      const existingUserByUsername = await this.prisma.user.findUnique({
        where: { username },
      });

      if (existingUserByUsername) {
        throw new ConflictException('Username already taken');
      }
    }

    // Hash password using CryptoService
    const hashedPassword = this.cryptoService.hashDataForStorage(password);

    try {
      // Get or create student role
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

      // Ensure studentRole exists before proceeding
      if (!studentRole) {
        throw new BadRequestException('Failed to get or create student role');
      }

      const studentRoleId = studentRole.id;

      // Create new user with student role and student profile in a transaction
      const result = await this.prisma.$transaction(async (tx) => {
        // Create user
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

        // Assign student role to user
        await tx.userRole.create({
          data: {
            userId: newUser.id,
            roleId: studentRoleId,
          },
        });

        // Create student profile
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
            // schoolId is null by default - students can register without a school
          },
        });

        // Fetch complete user with roles
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
        throw new BadRequestException('Failed to create student user');
      }

      // Remove password from response
      const { password: _, roles: userRoles, ...userWithoutPassword } = result;

      // Format roles as comma-separated string
      const roleHierarchy = ['admin', 'coordinator', 'teacher', 'employee', 'student'];
      const sortedRoles = userRoles
        .map(ur => ur.role.name.toLowerCase())
        .sort((a, b) => {
          const indexA = roleHierarchy.indexOf(a);
          const indexB = roleHierarchy.indexOf(b);
          return indexA - indexB;
        });
      
      const rolesString = sortedRoles.join(',');

      // Generate JWT tokens
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
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to register student: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Method to register a new admin user (DEVELOPMENT ONLY)
   * Creates a User, assigns ADMIN role, and creates Admin profile
   * @param registerAdminDto - Admin registration data
   * @returns Created user with admin profile and JWT tokens
   */
  async registerAdmin(registerAdminDto: RegisterAdminDto) {
    const {
      email,
      password,
      firstName,
      lastName,
      username,
      phone,
      bio,
      acceptTerms,
    } = registerAdminDto;

    // Validate terms acceptance
    if (!acceptTerms) {
      throw new BadRequestException(
        'You must accept the terms and conditions to register',
      );
    }

    // Check if user with email already exists
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      throw new ConflictException('User with this email already exists');
    }

    // Check if username is provided and if it already exists
    if (username) {
      const existingUserByUsername = await this.prisma.user.findUnique({
        where: { username },
      });

      if (existingUserByUsername) {
        throw new ConflictException('Username already taken');
      }
    }

    // Hash password using CryptoService
    const hashedPassword = this.cryptoService.hashDataForStorage(password);

    try {
      // Get or create admin role
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

      // Ensure adminRole exists before proceeding
      if (!adminRole) {
        throw new BadRequestException('Failed to get or create admin role');
      }

      const adminRoleId = adminRole.id;

      // Create new user with admin role and admin profile in a transaction
      const result = await this.prisma.$transaction(async (tx) => {
        // Create user
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
            isVerified: true, // Admins are verified by default
            isOnline: false,
          },
        });

        // Assign admin role to user
        await tx.userRole.create({
          data: {
            userId: newUser.id,
            roleId: adminRoleId,
          },
        });

        // Create admin profile
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

        // Fetch complete user with roles
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
        throw new BadRequestException('Failed to create admin user');
      }

      // Remove password from response
      const { password: _, roles: userRoles, ...userWithoutPassword } = result;

      // Format roles as comma-separated string
      const roleHierarchy = ['admin', 'coordinator', 'teacher', 'employee', 'student'];
      const sortedRoles = userRoles
        .map(ur => ur.role.name.toLowerCase())
        .sort((a, b) => {
          const indexA = roleHierarchy.indexOf(a);
          const indexB = roleHierarchy.indexOf(b);
          return indexA - indexB;
        });
      
      const rolesString = sortedRoles.join(',');

      // Generate JWT tokens
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
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to register admin: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Method to perform user login
   * @param loginDto - Login data (email/username, password)
   * @returns Authenticated user and token
   */
  async login(loginDto: LoginUserDto) {
    const { email, username, password } = loginDto;

    // Validate that at least email or username are present
    if (!email && !username) {
      throw new BadRequestException('Email or username are required for login');
    }

    // Find user by email or username with roles
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [email ? { email } : {}, username ? { username } : {}].filter(
          (condition) => Object.keys(condition).length > 0,
        ),
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Validate that user exists
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate that user is active
    if (!user.isActive) {
      throw new UnauthorizedException(
        'User is inactive, contact administrator',
      );
    }

    // Verify password using CryptoService
    if (!user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = this.cryptoService.verifyStoredHash(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        isOnline: true,
      },
    });

    // TODO: Implement JWT token generation
    // const token = this.jwtService.sign({ id: user.id, email: user.email, role });

    // Remove password from response
    const { password: _, roles: userRoles, ...userWithoutPassword } = user;

    // Sort roles by hierarchy and format as comma-separated string
    const roleHierarchy = ['admin', 'coordinator', 'teacher', 'employee', 'student'];
    const sortedRoles = userRoles
      .map(ur => ur.role.name.toLowerCase())
      .sort((a, b) => {
        const indexA = roleHierarchy.indexOf(a);
        const indexB = roleHierarchy.indexOf(b);
        return indexA - indexB;
      });
    
    const rolesString = sortedRoles.join(',');

    // Generate JWT tokens
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

  /**
   * Method to perform user logout
   * @param userId - User ID
   * @returns Logout confirmation
   */
  async logout(userId: string) {
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

  /**
   * Method to validate a JWT token
   * @param token - JWT token
   * @returns Decoded user data from token
   */
  async validateToken(token: string) {
    const payload = this.jwtService.verifyAccessToken(token);

    if (!payload) {
      throw new BadRequestException('Invalid or expired token');
    }

    // Get user from database to ensure user still exists and is active
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new BadRequestException('User not found or inactive');
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

  /**
   * Method to refresh a JWT token
   * @param refreshToken - Refresh token
   * @returns New access token
   */
  refreshToken(refreshToken: string) {
    const newAccessToken = this.jwtService.refreshAccessToken(refreshToken);

    if (!newAccessToken) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Obtener expiraciones desde el servicio JWT
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
}
