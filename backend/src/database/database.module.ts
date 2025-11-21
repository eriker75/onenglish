import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Global Database Module
 * Provides access to PostgreSQL database:
 * - PrismaService: PostgreSQL (structured data - users, challenges, progress, questions)
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
