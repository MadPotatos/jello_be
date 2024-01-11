import { Module } from '@nestjs/common';
import { IssueController } from './issue.controller';
import { IssueService } from './issue.service';
import { PrismaService } from 'src/prisma.service';
import { UtilService } from 'src/util.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [IssueController],
  providers: [IssueService, PrismaService, UtilService, JwtService],
})
export class IssueModule {}
