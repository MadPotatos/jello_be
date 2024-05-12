import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { PrismaService } from 'src/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationGateway } from '../notification/notification.gateway';

@Module({
  providers: [
    MemberService,
    PrismaService,
    NotificationService,
    NotificationGateway,
  ],
  controllers: [MemberController],
})
export class MemberModule {}
