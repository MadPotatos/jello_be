import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { PrismaService } from 'src/prisma.service';
import { MemberService } from '../member/member.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, PrismaService, MemberService, JwtService],
})
export class ProjectModule {}
