import { Injectable } from '@nestjs/common';
import { SprintStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { V1Sprint } from './entities/get-sprint.entity';

@Injectable()
export class SprintService {
  constructor(private prisma: PrismaService) {}

  async getSprintsInProject(projectId: number): Promise<V1Sprint[]> {
    try {
      const rawSprintData = await this.prisma.sprint.findMany({
        where: { projectId: +projectId },
      });
      const sprints: V1Sprint[] = await Promise.all(
        rawSprintData.map(async (sprint) => {
          return {
            id: sprint.id,
            name: sprint.name,
            goal: sprint.goal,
            startDate: sprint.startDate,
            endDate: sprint.endDate,
            createdAt: sprint.createdAt,
            status: sprint.status,
          };
        }),
      );
      return sprints;
    } catch (err) {
      console.log(err);
    }
  }

  async createSprint(projectId: number): Promise<any> {
    try {
      const sprintCount = await this.prisma.sprint.count({
        where: { projectId },
      });

      const defaultName = `Sprint-${sprintCount}`;

      const sprint = await this.prisma.sprint.create({
        data: {
          name: defaultName,
          projectId: projectId,
          status: SprintStatus.CREATED,
          order: sprintCount,
        },
      });

      return sprint;
    } catch (err) {
      console.error('Error creating sprint:', err);
      throw err;
    }
  }

  async updateSprint(id: number, data: any): Promise<any> {
    try {
      const sprint = await this.prisma.sprint.update({
        where: { id: +id },
        data,
      });

      return sprint;
    } catch (err) {
      console.error('Error updating sprint:', err);
      throw err;
    }
  }

  async deleteSprint(id: number): Promise<any> {
    try {
      await this.prisma.sprint.delete({
        where: { id: +id },
      });

      return { success: true };
    } catch (err) {
      console.error('Error deleting sprint:', err);
      throw err;
    }
  }
}
