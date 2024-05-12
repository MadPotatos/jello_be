import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { NotificationGateway } from './notification.gateway';

@Module({
  controllers: [NotificationController],
  providers: [
    NotificationService,
    PrismaService,
    JwtService,
    NotificationGateway,
  ],
})
export class NotificationModule {}
