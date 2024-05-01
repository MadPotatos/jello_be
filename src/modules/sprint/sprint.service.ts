import { ConflictException, Injectable } from '@nestjs/common';
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
            order: sprint.order,
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
    const statusUpdate = data.status;

    if (statusUpdate && statusUpdate !== SprintStatus.CREATED) {
      if (statusUpdate === SprintStatus.IN_PROGRESS) {
        const ongoingSprintsCount = await this.prisma.sprint.count({
          where: {
            projectId: data.projectId,
            status: SprintStatus.IN_PROGRESS,
          },
        });

        if (ongoingSprintsCount > 0) {
          throw new ConflictException("There's already an ongoing sprint");
        }
      }
    }

    const sprint = await this.prisma.sprint.update({
      where: { id: +id },
      data,
    });

    return sprint;
  }

  async deleteSprint(id: number): Promise<any> {
    try {
      const sprintToDelete = await this.prisma.sprint.findUnique({
        where: { id: +id },
        select: { order: true, projectId: true },
      });

      if (!sprintToDelete) {
        throw new Error('Sprint not found');
      }

      const orderToDelete = sprintToDelete.order;
      const projectId = sprintToDelete.projectId;

      await this.prisma.sprint.delete({ where: { id: +id } });
      await this.prisma.sprint.updateMany({
        where: {
          order: {
            gte: orderToDelete,
          },
          projectId: projectId,
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      });

      return { success: true };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
