import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { PrismaService } from 'src/prisma.service';
import { MemberService } from '../member/member.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, PrismaService, MemberService],
})
export class ProjectModule {}
