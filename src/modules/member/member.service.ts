import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetLeaderInfo } from './entities/get-leader-info.entity';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async findLeaderInfoByProjectId(
    projectId: number,
  ): Promise<GetLeaderInfo | null> {
    const leaderInfo = await this.prisma.member.findFirst({
      where: { projectId, isAdmin: true },
      include: { User: true },
    });

    if (!leaderInfo) {
      return null;
    }

    return {
      projectId: leaderInfo.projectId,
      userId: leaderInfo.userId,
      name: leaderInfo.User.name,
      email: leaderInfo.User.email,
      avatar: leaderInfo.User.avatar,
      isAdmin: leaderInfo.isAdmin,
    };
  }
}
