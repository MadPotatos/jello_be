import { Module } from '@nestjs/common';
import { UserStoryController } from './user_story.controller';
import { UserStoryService } from './user_story.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UserStoryController],
  providers: [UserStoryService, PrismaService, JwtService],
})
export class UserStoryModule {}
