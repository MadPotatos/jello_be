import { Module } from '@nestjs/common';
import { PullRequestController } from './pull-request.controller';
import { PullRequestService } from './pull-request.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PullRequestController],
  providers: [PullRequestService, PrismaService],
})
export class PullRequestModule {}
