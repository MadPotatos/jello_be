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
import { IssueModule } from './modules/issue/issue.module';
import { CommentModule } from './modules/comment/comment.module';
import { RepositoryModule } from './modules/repo/repo.module';
import { SprintModule } from './modules/sprint/sprint.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    ProjectModule,
    MemberModule,
    ListModule,
    IssueModule,
    CommentModule,
    AuthModule,
    CloudinaryModule,
    RepositoryModule,
    SprintModule,
    NotificationModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
