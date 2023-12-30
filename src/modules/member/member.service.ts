import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetMember, GetMemberList } from './entities/get-member.entity';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async getLeaderByProjectId(projectId: number): Promise<GetMember | null> {
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

  async addAdminToProject(projectId: number, userId: number) {
    return await this.prisma.member.create({
      data: {
        projectId,
        userId,
        isAdmin: true,
      },
    });
  }

  async getMembersByProjectId(projectId: number): Promise<GetMemberList> {
    const members = await this.prisma.member.findMany({
      where: { projectId },
      include: { User: true },
    });

    return {
      members: members.map((member) => ({
        projectId: member.projectId,
        userId: member.userId,
        name: member.User.name,
        email: member.User.email,
        avatar: member.User.avatar,
        isAdmin: member.isAdmin,
      })),
      total: members.length,
    };
  }
}
