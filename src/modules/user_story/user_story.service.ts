import { Injectable } from '@nestjs/common';
import { UserStoryStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserStoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserStoriesByProjectId(projectId: number) {
    return await this.prisma.userStory.findMany({
      where: { projectId },
      include: { tasks: true },
    });
  }
  async createUserStory(body: any) {
    const { title, description, projectId, priority, point } = body;
    return await this.prisma.userStory.create({
      data: {
        projectId,
        title,
        description,
        priority,
        point,
      },
    });
  }

  async updateUserStory(id: number, data: any) {
    return await this.prisma.userStory.update({
      where: { id },
      data,
    });
  }

  async deleteUserStory(id: number) {
    return await this.prisma.userStory.delete({ where: { id } });
  }

  async getNotDoneUserStoriesByProjectId(projectId: number) {
    return await this.prisma.userStory.findMany({
      where: {
        projectId,
        status: {
          not: UserStoryStatus.DONE,
        },
      },
    });
  }

  async addUserStoryToSprint(sprintId: number, userStoryId: number) {
    return await this.prisma.userStory.update({
      where: { id: userStoryId },
      data: {
        sprintId,
      },
    });
  }
}
