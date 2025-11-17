import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Global Database Module
 * Provides access to both databases:
 * - PrismaService: PostgreSQL (structured data - users, challenges, progress)
 * - MongooseModule: MongoDB (flexible data - questions, chat, analytics)
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
