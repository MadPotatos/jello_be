import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaService } from './prisma.service';
import { ProjectModule } from './modules/project/project.module';
import { MemberModule } from './modules/member/member.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { ListModule } from './modules/list/list.module';

import { CommentModule } from './modules/comment/comment.module';
import { RepositoryModule } from './modules/repo/repo.module';
import { SprintModule } from './modules/sprint/sprint.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UserStoryModule } from './modules/user_story/user_story.module';
import { WorkItemModule } from './modules/work_item/work_item.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    ProjectModule,
    MemberModule,
    ListModule,
    WorkItemModule,
    CommentModule,
    AuthModule,
    CloudinaryModule,
    RepositoryModule,
    SprintModule,
    NotificationModule,
    UserStoryModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
