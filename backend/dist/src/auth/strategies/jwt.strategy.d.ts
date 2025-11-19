import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { PrismaService } from '../../database/prisma.service';
import { JwtPayload } from '../definitions/JwtPayload.interface';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    private readonly configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    validate(payload: JwtPayload): Promise<{
        roles: string;
        id: string;
        isActive: boolean;
        email: string;
        firstName: string;
        lastName: string;
        username: string | null;
        isVerified: boolean;
    }>;
}
export {};
