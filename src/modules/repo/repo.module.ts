import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RepositoryController } from './repo.controller';
import { RepositoryService } from './repo.service';

@Module({
  controllers: [RepositoryController],
  providers: [RepositoryService, PrismaService],
})
export class RepositoryModule {}
