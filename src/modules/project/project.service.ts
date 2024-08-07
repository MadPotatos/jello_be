import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { MemberService } from '../member/member.service';
import { V1Project, V1ProjectsList } from './entities/get-projects-list.entity';
import { PostProjectDto } from './dto/post-project.dto';
import { V1ProjectDetail } from './entities/get-project-detail.entity';
import { SprintStatus } from '@prisma/client';
import { Cron } from '@nestjs/schedule';

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
      productGoal: rawData.productGoal,
      isDeleted: rawData.isDeleted,
      createdAt: rawData.createdAt,
      updatedAt: rawData.updatedAt,
    };
  }

  async createProject(body: PostProjectDto) {
    if (body.repo) {
      const existingProject = await this.prisma.project.findUnique({
        where: { repo: body.repo },
      });

      if (existingProject) {
        throw new ConflictException('Repository URL already exists');
      }
    }

    const project = await this.prisma.project.create({
      data: {
        name: body.name,
        descr: body.description,
        repo: body.repo,
        image: body.image,
      },
    });

    await this.member.addAdminToProject(project.id, body.userId);
    if (!project) {
      return null;
    }
    await this.prisma.list.createMany({
      data: [
        { name: 'To Do', projectId: project.id, order: 1 },
        { name: 'In Progress', projectId: project.id, order: 2 },
        { name: 'Done', projectId: project.id, order: 3 },
      ],
    });

    await this.prisma.sprint.create({
      data: {
        name: 'Backlog',
        projectId: project.id,
        status: SprintStatus.CREATED,
        order: 0,
      },
    });

    return {
      project,
      message: 'Project created successfully',
    };
  }

  async updateProject(id: number, body: any) {
    // Check if the new repository URL already exists for another project
    if (body.repo) {
      const existingProject = await this.prisma.project.findFirst({
        where: {
          repo: body.repo,
          id: { not: id },
        },
      });

      if (existingProject) {
        throw new ConflictException('Repository URL already exists');
      }
    }

    const project = await this.prisma.project.update({
      where: { id },
      data: {
        name: body.name,
        descr: body.descr,
        repo: body.repo,
        productGoal: body.productGoal,
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

  @Cron('0 0 * * *')
  async cleanUpProjects() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 30); // Delete projects in trash older than 30 days

      await this.prisma.project.deleteMany({
        where: { updatedAt: { lt: cutoffDate }, isDeleted: true },
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
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
