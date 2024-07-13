import { Module } from '@nestjs/common';
import { WorkItemController } from './work_item.controller';
import { WorkItemService } from './work_item.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { NotificationGateway } from '../notification/notification.gateway';
import { NotificationService } from '../notification/notification.service';

@Module({
  controllers: [WorkItemController],
  providers: [
    WorkItemService,
    PrismaService,
    JwtService,
    NotificationService,
    NotificationGateway,
  ],
})
export class WorkItemModule {}
