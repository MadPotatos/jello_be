import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MemberService } from '../member/member.service';
import { V1Project, V1ProjectsList } from './entities/get-projects-list.entity';

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private member: MemberService,
  ) {}

  async findByUserId(userId: number): Promise<V1ProjectsList> {
    const projectsRaw = await this.prisma.project.findMany({
      where: { members: { some: { userId } } },
      orderBy: { createdAt: 'desc' },
    });
    const projects: V1Project[] = await Promise.all(
      projectsRaw.map(async (project) => {
        const leaderInfo = await this.member.findLeaderInfoByProjectId(
          project.id,
        );
        return {
          id: project.id,
          name: project.name,
          description: project.descr,
          image: project.image,
          leaderId: leaderInfo.userId,
          leaderName: leaderInfo.name,
          leaderAvatar: leaderInfo.avatar,
        };
      }),
    );
    return {
      projects,
      total: projects.length,
    };
  }

  async findById(id: number) {
    return await this.prisma.project.findUnique({
      where: { id },
    });
  }
}
