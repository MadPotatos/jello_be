import { Module } from '@nestjs/common';
import { IssueController } from './issue.controller';
import { IssueService } from './issue.service';
import { PrismaService } from 'src/prisma.service';
import { UtilService } from 'src/util.service';

@Module({
  controllers: [IssueController],
  providers: [IssueService, PrismaService, UtilService],
})
export class IssueModule {}
