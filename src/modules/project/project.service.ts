import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MemberService } from '../member/member.service';
import { V1Project, V1ProjectsList } from './entities/get-projects-list.entity';
import { PostProjectDto } from './dto/post-project.dto';
import { V1ProjectDetail } from './entities/get-project-detail.entity';

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private member: MemberService,
  ) {}

  async getProjectsByUserId(userId: number): Promise<V1ProjectsList> {
    const projectsRaw = await this.prisma.project.findMany({
      where: { members: { some: { userId } }, isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });
    const projects: V1Project[] = await Promise.all(
      projectsRaw.map(async (project) => {
        const leader = await this.member.getLeaderByProjectId(project.id);
        return {
          id: project.id,
          name: project.name,
          description: project.descr,
          image: project.image,
          leader,
        };
      }),
    );
    return {
      projects,
      total: projects.length,
    };
  }

  async getDeletedProjectsByUserId(userId: number): Promise<V1ProjectsList> {
    const projectsRaw = await this.prisma.project.findMany({
      where: { members: { some: { userId, isAdmin: true } }, isDeleted: true },

      orderBy: { createdAt: 'desc' },
    });
    const projects: V1Project[] = await Promise.all(
      projectsRaw.map(async (project) => {
        const leader = await this.member.getLeaderByProjectId(project.id);
        return {
          id: project.id,
          name: project.name,
          description: project.descr,
          image: project.image,
          leader,
        };
      }),
    );
    return {
      projects,
      total: projects.length,
    };
  }

  async getById(id: number): Promise<V1ProjectDetail> {
    const rawData = await this.prisma.project.findUnique({
      where: { id },
    });
    if (!rawData) {
      return null;
    }
    return {
      id: rawData.id,
      name: rawData.name,
      description: rawData.descr,
      repo: rawData.repo,
      image: rawData.image,
      createdAt: rawData.createdAt,
      updatedAt: rawData.updatedAt,
    };
  }

  async createProject(body: PostProjectDto) {
    const project = await this.prisma.project.create({
      data: {
        name: body.name,
        descr: body.description,
        repo: body.repo,
        image: body.image,
        userId: body.userId,
      },
    });
    await this.member.addAdminToProject(project.id, body.userId);
    if (!project) {
      return null;
    }
    return {
      project,
      message: 'Project created successfully',
    };
  }

  async updateProject(id: number, body: any) {
    const project = await this.prisma.project.update({
      where: { id },
      data: {
        name: body.name,
        descr: body.descr,
        repo: body.repo,
      },
    });
    if (!project) {
      return null;
    }
    return {
      project,
      message: 'Project updated successfully',
    };
  }

  async updateImage(id: number, body: any) {
    const project = await this.prisma.project.update({
      where: { id },
      data: {
        image: body.image,
      },
    });
    if (!project) {
      return null;
    }
    return {
      project,
      message: 'Project updated successfully',
    };
  }

  async deleteProject(id: number) {
    // set isDeleted = true
    const project = await this.prisma.project.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
    return {
      project,
      message: 'Project deleted successfully',
    };
  }

  async restoreProject(id: number) {
    // set isDeleted = false
    const project = await this.prisma.project.update({
      where: { id },
      data: {
        isDeleted: false,
      },
    });
    return {
      project,
      message: 'Project restored successfully',
    };
  }
}
