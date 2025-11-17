import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../definitions/JwtPayload.interface';
import { TokenPair } from '../definitions/TokenPair.interface';
export declare class JwtService {
    private readonly jwtService;
    private readonly configService;
    constructor(jwtService: NestJwtService, configService: ConfigService);
    generateTokenPair(payload: Omit<JwtPayload, 'iat' | 'exp'>): TokenPair;
    generateAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string;
    verifyAccessToken(token: string): JwtPayload | null;
    verifyRefreshToken(token: string): JwtPayload | null;
    refreshAccessToken(refreshToken: string): string | null;
    private getAccessTokenSecret;
    private getRefreshTokenSecret;
    private getAccessTokenExpiry;
    private getRefreshTokenExpiry;
    extractTokenFromHeader(authHeader: string): string | null;
    getTokenExpiration(token: string): number | null;
    isTokenExpired(token: string): boolean;
}
