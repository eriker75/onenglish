import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../definitions/JwtPayload.interface';
import { TokenPair } from '../definitions/TokenPair.interface';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Generate access token and refresh token pair
   * @param payload - JWT payload data
   * @returns Object with access token, refresh token and expiration times
   */
  generateTokenPair(payload: Omit<JwtPayload, 'iat' | 'exp'>): TokenPair {
    const accessTokenExpiry = this.getAccessTokenExpiry();
    const refreshTokenExpiry = this.getRefreshTokenExpiry();

    // No incluir 'exp' en el payload, solo usar expiresIn en sign()
    const accessTokenPayload: JwtPayload = {
      ...payload,
    };

    const refreshTokenPayload: JwtPayload = {
      ...payload,
    };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      secret: this.getAccessTokenSecret(),
      expiresIn: `${accessTokenExpiry}s`,
    });

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: this.getRefreshTokenSecret(),
      expiresIn: `${refreshTokenExpiry}s`,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: accessTokenExpiry,
      refreshExpiresIn: refreshTokenExpiry,
    };
  }

  /**
   * Generate only access token
   * @param payload - JWT payload data
   * @returns Access token string
   */
  generateAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    const accessTokenExpiry = this.getAccessTokenExpiry();

    const accessTokenPayload: JwtPayload = {
      ...payload,
      exp: Math.floor(Date.now() / 1000) + accessTokenExpiry,
    };

    return this.jwtService.sign(accessTokenPayload, {
      secret: this.getAccessTokenSecret(),
      expiresIn: `${accessTokenExpiry}s`,
    });
  }

  /**
   * Verify access token
   * @param token - Access token to verify
   * @returns Decoded JWT payload or null if invalid
   */
  verifyAccessToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: this.getAccessTokenSecret(),
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * Verify refresh token
   * @param token - Refresh token to verify
   * @returns Decoded JWT payload or null if invalid
   */
  verifyRefreshToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: this.getRefreshTokenSecret(),
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * Refresh access token using refresh token
   * @param refreshToken - Valid refresh token
   * @returns New access token or null if refresh token is invalid
   */
  refreshAccessToken(refreshToken: string): string | null {
    const payload = this.verifyRefreshToken(refreshToken);

    if (!payload) {
      return null;
    }

    return this.generateAccessToken(payload);
  }

  /**
   * Get access token secret from configuration
   * @returns Access token secret
   */
  private getAccessTokenSecret(): string {
    return this.configService.get<string>('JWT_ACCESS_SECRET')!;
  }

  /**
   * Get refresh token secret from configuration
   * @returns Refresh token secret
   */
  private getRefreshTokenSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET')!;
  }

  /**
   * Get access token expiry time in seconds
   * @returns Access token expiry in seconds
   */
  private getAccessTokenExpiry(): number {
    const raw = this.configService.get<string | number>(
      'JWT_ACCESS_EXPIRES_IN',
    );
    if (typeof raw === 'number') return raw;
    if (typeof raw === 'string') {
      const parsed = Number(raw);
      return Number.isFinite(parsed) ? parsed : 3600;
    }
    return 3600;
  }

  /**
   * Get refresh token expiry time in seconds
   * @returns Refresh token expiry in seconds
   */
  private getRefreshTokenExpiry(): number {
    const raw = this.configService.get<string | number>(
      'JWT_REFRESH_EXPIRES_IN',
    );
    if (typeof raw === 'number') return raw;
    if (typeof raw === 'string') {
      const parsed = Number(raw);
      return Number.isFinite(parsed) ? parsed : 604800;
    }
    return 604800;
  }

  /**
   * Extract token from Authorization header
   * @param authHeader - Authorization header value
   * @returns Token string or null
   */
  extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }

  /**
   * Get token expiration time in milliseconds
   * @param token - JWT token
   * @returns Expiration time in milliseconds or null
   */
  getTokenExpiration(token: string): number | null {
    try {
      const decoded = this.jwtService.decode(token);
      if (decoded && typeof decoded === 'object' && 'exp' in decoded) {
        const exp = (decoded as { exp?: number }).exp;
        return typeof exp === 'number' ? exp * 1000 : null;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  /**
   * Check if token is expired
   * @param token - JWT token
   * @returns True if token is expired, false otherwise
   */
  isTokenExpired(token: string): boolean {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) {
      return true;
    }
    return Date.now() >= expiration;
  }
}
