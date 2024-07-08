import { Module } from '@nestjs/common';
import { IssueController } from './issue.controller';
import { IssueService } from './issue.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { NotificationService } from '../notification/notification.service';
import { NotificationGateway } from '../notification/notification.gateway';

@Module({
  controllers: [IssueController],
  providers: [
    IssueService,
    PrismaService,
    JwtService,
    NotificationService,
    NotificationGateway,
  ],
})
export class IssueModule {}
