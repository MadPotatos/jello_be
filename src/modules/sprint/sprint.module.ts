import { Module } from '@nestjs/common';
import { SprintController } from './sprint.controller';
import { SprintService } from './sprint.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SprintController],
  providers: [SprintService, PrismaService],
})
export class SprintModule {}
