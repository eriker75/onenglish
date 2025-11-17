import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { CryptoService } from './services/crypto.service';
import { JwtService } from './services/jwt.service';
import { UserRoleGuard } from './guards/role.guard';
import { DatabaseModule } from '../database/database.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET')!,
        signOptions: {
          expiresIn: parseInt(
            configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '3600',
          ),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    CryptoService,
    JwtService,
    UserRoleGuard,
    JwtStrategy,
  ],
  exports: [
    AuthService,
    CryptoService,
    JwtService,
    UserRoleGuard,
    PassportModule,
  ],
})
export class AuthModule {}
