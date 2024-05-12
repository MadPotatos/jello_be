import { Module } from '@nestjs/common';
import { SprintController } from './sprint.controller';
import { SprintService } from './sprint.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { NotificationService } from '../notification/notification.service';
import { NotificationGateway } from '../notification/notification.gateway';

@Module({
  controllers: [SprintController],
  providers: [
    SprintService,
    PrismaService,
    JwtService,
    NotificationService,
    NotificationGateway,
  ],
})
export class SprintModule {}
