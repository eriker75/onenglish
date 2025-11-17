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
exports.JwtService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let JwtService = class JwtService {
    jwtService;
    configService;
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    generateTokenPair(payload) {
        const accessTokenExpiry = this.getAccessTokenExpiry();
        const refreshTokenExpiry = this.getRefreshTokenExpiry();
        const accessTokenPayload = {
            ...payload,
        };
        const refreshTokenPayload = {
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
    generateAccessToken(payload) {
        const accessTokenExpiry = this.getAccessTokenExpiry();
        const accessTokenPayload = {
            ...payload,
            exp: Math.floor(Date.now() / 1000) + accessTokenExpiry,
        };
        return this.jwtService.sign(accessTokenPayload, {
            secret: this.getAccessTokenSecret(),
            expiresIn: `${accessTokenExpiry}s`,
        });
    }
    verifyAccessToken(token) {
        try {
            return this.jwtService.verify(token, {
                secret: this.getAccessTokenSecret(),
            });
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    verifyRefreshToken(token) {
        try {
            return this.jwtService.verify(token, {
                secret: this.getRefreshTokenSecret(),
            });
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    refreshAccessToken(refreshToken) {
        const payload = this.verifyRefreshToken(refreshToken);
        if (!payload) {
            return null;
        }
        return this.generateAccessToken(payload);
    }
    getAccessTokenSecret() {
        return this.configService.get('JWT_ACCESS_SECRET');
    }
    getRefreshTokenSecret() {
        return this.configService.get('JWT_REFRESH_SECRET');
    }
    getAccessTokenExpiry() {
        const raw = this.configService.get('JWT_ACCESS_EXPIRES_IN');
        if (typeof raw === 'number')
            return raw;
        if (typeof raw === 'string') {
            const parsed = Number(raw);
            return Number.isFinite(parsed) ? parsed : 3600;
        }
        return 3600;
    }
    getRefreshTokenExpiry() {
        const raw = this.configService.get('JWT_REFRESH_EXPIRES_IN');
        if (typeof raw === 'number')
            return raw;
        if (typeof raw === 'string') {
            const parsed = Number(raw);
            return Number.isFinite(parsed) ? parsed : 604800;
        }
        return 604800;
    }
    extractTokenFromHeader(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.substring(7);
    }
    getTokenExpiration(token) {
        try {
            const decoded = this.jwtService.decode(token);
            if (decoded && typeof decoded === 'object' && 'exp' in decoded) {
                const exp = decoded.exp;
                return typeof exp === 'number' ? exp * 1000 : null;
            }
            return null;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
    isTokenExpired(token) {
        const expiration = this.getTokenExpiration(token);
        if (!expiration) {
            return true;
        }
        return Date.now() >= expiration;
    }
};
exports.JwtService = JwtService;
exports.JwtService = JwtService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], JwtService);
//# sourceMappingURL=jwt.service.js.map