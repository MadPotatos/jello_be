import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  NotificationType,
  SprintStatus,
  StatusInSprint,
  UserStoryStatus,
} from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { V1Sprint } from './entities/get-sprint.entity';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class SprintService {
  constructor(
    private prisma: PrismaService,
    private notification: NotificationService,
  ) {}

  async getSprintsInProject(projectId: number) {
    try {
      const rawSprintData = await this.prisma.sprint.findMany({
        where: {
          projectId: +projectId,
          NOT: { status: SprintStatus.COMPLETED },
        },
        include: {
          userStories: {
            select: {
              id: true,
              title: true,
              point: true,
            },
          },
        },
      });

      const sprints = rawSprintData.map((sprint) => {
        const totalPoints = sprint.userStories.reduce(
          (acc, userStory) => acc + (userStory.point || 0),
          0,
        );

        return {
          id: sprint.id,
          name: sprint.name,
          goal: sprint.goal,
          order: sprint.order,
          startDate: sprint.startDate,
          endDate: sprint.endDate,
          createdAt: sprint.createdAt,
          status: sprint.status,
          userStories: sprint.userStories,
          totalUserStoryPoints: totalPoints,
        };
      });

      return sprints;
    } catch (err) {
      console.log(err);
    }
  }

  async getNotInProgressSprints(projectId: number) {
    try {
      const sprints = await this.prisma.sprint.findMany({
        where: {
          projectId: projectId,
          status: SprintStatus.CREATED,
        },
        select: {
          id: true,
          name: true,
        },
      });

      return sprints;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getCurrentSprint(projectId: number) {
    try {
      const sprint = await this.prisma.sprint.findFirst({
        where: {
          projectId: projectId,
          status: SprintStatus.IN_PROGRESS,
        },
        include: {
          userStories: {
            select: {
              id: true,
              title: true,
              point: true,
            },
          },
        },
      });
      const totalPoints = sprint.userStories.reduce(
        (acc, userStory) => acc + (userStory.point || 0),
        0,
      );

      return {
        id: sprint.id,
        name: sprint.name,
        goal: sprint.goal,
        order: sprint.order,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        createdAt: sprint.createdAt,
        status: sprint.status,
        userStories: sprint.userStories || [],
        totalUserStoryPoints: totalPoints,
      };
    } catch (err) {
      console.error(err);
      throw err;
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
    const sprint = await this.prisma.sprint.findUnique({
      where: { id: +id },
      include: { userStories: true },
    });

    if (statusUpdate && statusUpdate !== SprintStatus.CREATED) {
      if (statusUpdate === SprintStatus.IN_PROGRESS) {
        const ongoingSprintsCount = await this.prisma.sprint.count({
          where: {
            projectId: sprint.projectId,
            status: SprintStatus.IN_PROGRESS,
          },
        });

        if (ongoingSprintsCount > 0) {
          throw new ConflictException("There's already an ongoing sprint");
        }

        const firstList = await this.prisma.list.findFirst({
          where: { projectId: sprint.projectId },
          orderBy: { id: 'asc' },
        });

        const maxListOrderResult = await this.prisma.workItem.aggregate({
          where: {
            listId: firstList.id,
            sprintId: id,
          },
          _max: {
            listOrder: true,
          },
        });

        const maxListOrder = maxListOrderResult._max.listOrder ?? -1;

        const workItems = await this.prisma.workItem.findMany({
          where: {
            sprintId: id,
          },
        });

        for (let i = 0; i < workItems.length; i++) {
          await this.prisma.workItem.update({
            where: { id: workItems[i].id },
            data: {
              statusInSprint: StatusInSprint.IN_SPRINT,
              listId: firstList.id,
              listOrder: maxListOrder + i + 1,
            },
          });
        }

        await this.prisma.userStory.updateMany({
          where: {
            id: {
              in: sprint.userStories.map((userStory) => userStory.id),
            },
          },
          data: {
            status: SprintStatus.IN_PROGRESS,
          },
        });

        const members = await this.prisma.member.findMany({
          where: { projectId: sprint.projectId },
        });

        await this.notification.createNotification({
          type: NotificationType.SPRINT_STARTED,
          projectId: sprint.projectId,
          userIds: members.map((member) => member.userId),
        });
      }
    }

    const updateSprint = await this.prisma.sprint.update({
      where: { id: +id },
      data,
    });

    return updateSprint;
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

  async completeSprint(id: number, body: any): Promise<any> {
    try {
      const dId = body.destinationId;
      const sprint = await this.prisma.sprint.update({
        where: { id: +id },
        data: {
          status: SprintStatus.COMPLETED,
        },
      });

      const maxOrder = await this.prisma.workItem.aggregate({
        where: { sprintId: dId },
        _max: {
          sprintOrder: true,
        },
      });

      const initialOrder = maxOrder._max.sprintOrder ?? -1;

      const issues = await this.prisma.workItem.updateMany({
        where: {
          sprintId: +id,
        },
        data: {
          sprintId: dId,
          listId: null,
          listOrder: null,
          statusInSprint: null,
          sprintOrder: { increment: initialOrder + 1 },
        },
      });

      const projectId = sprint.projectId;
      const members = await this.prisma.member.findMany({
        where: { projectId },
      });
      const userStories = await this.prisma.userStory.updateMany({
        where: {
          sprintId: +id,
        },
        data: {
          status: UserStoryStatus.DONE,
        },
      });
      await this.notification.createNotification({
        type: NotificationType.SPRINT_COMPLETED,
        projectId: projectId,
        userIds: members.map((member) => member.userId),
      });

      return sprint;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
