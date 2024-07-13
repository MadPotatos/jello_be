import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { PostIssueDto } from './dto/create-work-item.dto';
import {
  NotificationType,
  SprintStatus,
  StatusInSprint,
  Type,
} from '@prisma/client';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class WorkItemService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notification: NotificationService,
  ) {}

  async getAllworkItemsByProject(projectId: number) {
    try {
      const workItems = await this.prisma.workItem.findMany({
        where: {
          projectId: +projectId,
        },
        include: {
          assignees: {
            select: {
              userId: true,
              User: { select: { name: true, avatar: true } },
            },
            orderBy: { createdAt: 'asc' },
          },
          List: {
            select: { name: true },
          },
          Sprint: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      });
      return workItems;
    } catch (err) {
      console.log(err);
    }
  }

  async getworkItemsByListInProject(projectId: number) {
    try {
      const workItemWhereClause = {
        Sprint: { status: SprintStatus.IN_PROGRESS },
      };

      const listworkItems = await this.prisma.list.findMany({
        where: { projectId: +projectId },
        orderBy: { order: 'asc' },
        include: {
          workitems: {
            //where: { Sprint: { status: SprintStatus.IN_PROGRESS } },
            orderBy: { listOrder: 'asc' },
            include: {
              assignees: {
                select: {
                  userId: true,
                  User: { select: { name: true, avatar: true } },
                },
                orderBy: { createdAt: 'asc' },
              },
              _count: {
                select: { comments: true, children: true },
              },
            },
          },
        },
      });

      const workitems = listworkItems.reduce(
        (acc, { id, workitems }) => ({
          ...acc,
          [id]: workitems.map(({ _count, ...workItem }) => ({
            ...workItem,
            ..._count,
          })),
        }),
        {},
      );

      return workitems;
    } catch (err) {
      console.error('Error fetching workItems:', err);
      throw new Error('Failed to fetch workItems');
    }
  }

  async getworkItemsBySprintInProject(projectId: number) {
    try {
      const listworkItems = await this.prisma.sprint.findMany({
        where: {
          projectId: +projectId,
          NOT: { status: SprintStatus.COMPLETED },
        },
        include: {
          workitems: {
            orderBy: { sprintOrder: 'asc' },
            include: {
              assignees: {
                select: {
                  userId: true,
                  User: { select: { name: true, avatar: true } },
                },
                orderBy: { createdAt: 'asc' },
              },

              _count: {
                select: { comments: true, children: true },
              },

              List: {
                select: { name: true },
              },
            },
          },
        },
      });
      const workitems = listworkItems.reduce(
        (p, { id, workitems }) => ({
          ...p,
          [id]: workitems.map(({ _count, ...workItem }) => ({
            ...workItem,
            ..._count,
          })),
        }),
        {},
      );
      return workitems;
    } catch (err) {
      console.log(err);
    }
  }

  async getSubworkItemsByworkItem(workItemId: number) {
    try {
      const subworkItems = await this.prisma.workItem.findMany({
        where: { parentId: +workItemId },
        orderBy: { createdAt: 'asc' },
        include: {
          assignees: {
            select: {
              userId: true,
              User: { select: { name: true, avatar: true } },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
      });
      return subworkItems;
    } catch (err) {
      console.log(err);
    }
  }

  async createworkItem(body: PostIssueDto) {
    const { listId, sprintId } = body;
    let listOrder = 0;
    let sprintOrder = 0;
    let sprintStatus: SprintStatus = SprintStatus.CREATED;
    try {
      if (sprintId) {
        const sprint = await this.prisma.sprint.findUnique({
          where: { id: sprintId },
          select: { status: true },
        });

        if (!sprint) {
          throw new Error(`Sprint with id ${sprintId} not found`);
        }

        sprintStatus = sprint.status;
      }
      if (listId) {
        const { _count: order } = await this.prisma.workItem.aggregate({
          where: { listId: body.listId },
          _count: true,
        });
        listOrder = Number(order);
      }
      if (sprintId) {
        const { _count: order } = await this.prisma.workItem.aggregate({
          where: { sprintId: body.sprintId },
          _count: true,
        });
        sprintOrder = Number(order);
      }
      let workItemStatus: StatusInSprint = StatusInSprint.IN_SPRINT_PLANNING;

      if (sprintStatus === SprintStatus.IN_PROGRESS) {
        workItemStatus = StatusInSprint.IN_SPRINT;
      }
      const workItem = await this.prisma.workItem.create({
        data: {
          ...body,
          ...(listId && { listOrder: Number(listOrder) }),
          ...(sprintId && {
            sprintOrder: Number(sprintOrder),
            statusInSprint: workItemStatus,
          }),
        },
      });
      return { ...workItem, assignees: [], comments: 0 };
    } catch (err) {
      console.log(err);
    }
  }

  async updateworkItem(id: number, body: any) {
    try {
      const { type, value, projectId } = body;
      const workItem = await this.prisma.workItem.findUnique({
        where: { id: +id },
      });

      switch (type) {
        case 'listId':
          const { _count: order } = await this.prisma.workItem.aggregate({
            where: { listId: value },
            _count: true,
          });
          await this.prisma.workItem.update({
            where: { id },
            data: { [type]: value, listOrder: Number(order) + 1 },
          });
          break;
        case 'addAssignee':
          const existingAssigneesBeforeDelete =
            await this.prisma.assignee.findMany({
              where: { workItemId: id },
              select: { userId: true },
            });
          await this.prisma.assignee.deleteMany({ where: { workItemId: id } });

          await this.prisma.assignee.createMany({
            data: value.map((userId) => ({ workItemId: id, userId })),
          });

          const existingAssigneesAfterAdd = await this.prisma.assignee.findMany(
            {
              where: { workItemId: id },
              select: { userId: true },
            },
          );
          const newAssignees = existingAssigneesAfterAdd.filter(
            (assignee) =>
              !existingAssigneesBeforeDelete.some(
                (existingAssignee) =>
                  existingAssignee.userId === assignee.userId,
              ),
          );
          await Promise.all(
            newAssignees.map(async (assignee) => {
              await this.notification.createNotification({
                userIds: [assignee.userId],
                projectId,
                workItemId: id,
                type: NotificationType.ASSIGNED_TO_ISSUE,
              });
            }),
          );
          await this.updatedAt(id);
          break;

        default:
          await this.prisma.workItem.update({
            where: { id },
            data: { [type]: value },
          });
          break;
      }
      return;
    } catch (err) {
      console.log(err);
    }
  }

  async reorderworkItems(body: any) {
    try {
      const {
        id,
        s: { sId, order },
        d: { dId, newOrder },
        type,
      } = body;

      const field = type === 'list' ? 'listOrder' : 'sprintOrder';
      const containerField = type === 'list' ? 'listId' : 'sprintId';

      await this.prisma.$transaction(async (tx) => {
        if (sId === dId) {
          // Same container reordering
          const isMovingDown = newOrder > order;

          await tx.workItem.updateMany({
            where: {
              [containerField]: sId,
              AND: [
                {
                  [field]: {
                    [isMovingDown ? 'gt' : 'lt']: order,
                  },
                },
                {
                  [field]: {
                    [isMovingDown ? 'lte' : 'gte']: newOrder,
                  },
                },
              ],
            },
            data: {
              [field]: {
                [isMovingDown ? 'decrement' : 'increment']: 1,
              },
            },
          });

          await tx.workItem.update({
            where: { id },
            data: { [field]: newOrder },
          });
        } else {
          // Different container reordering
          await tx.workItem.updateMany({
            where: {
              [containerField]: sId,
              [field]: {
                gt: order,
              },
            },
            data: {
              [field]: {
                decrement: 1,
              },
            },
          });

          await tx.workItem.updateMany({
            where: {
              [containerField]: dId,
              [field]: {
                gte: newOrder,
              },
            },
            data: {
              [field]: {
                increment: 1,
              },
            },
          });

          await tx.workItem.update({
            where: { id },
            data: {
              [field]: newOrder,
              [containerField]: dId,
            },
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
  async updatedAt(id: number) {
    return this.prisma.workItem.update({
      where: { id },
      data: { updatedAt: new Date(Date.now()).toISOString() },
    });
  }

  async deleteworkItem(id: number) {
    try {
      const workItemToDelete = await this.prisma.workItem.findUnique({
        where: { id: +id },
        select: { listOrder: true, listId: true },
      });

      if (!workItemToDelete) {
        throw new Error('workItem not found');
      }

      const orderToDelete = workItemToDelete.listOrder;
      const listId = workItemToDelete.listId;

      await this.prisma.notification.deleteMany({
        where: {
          workItemId: +id,
        },
      });

      await this.prisma.workItem.delete({ where: { id: +id } });
      await this.prisma.workItem.updateMany({
        where: {
          listOrder: {
            gte: orderToDelete,
          },
          listId: listId,
        },
        data: {
          listOrder: {
            decrement: 1,
          },
        },
      });

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: 'Failed to delete workItem' };
    }
  }

  async createTask(data: any) {
    return await this.prisma.workItem.create({ data });
  }

  async getTaskByUserStorythatNotHaveSprint(userStoryId: number) {
    return await this.prisma.workItem.findMany({
      where: {
        userStoryId,
        sprintId: null,
      },
    });
  }

  async addTaskInUserStorytoSprint(id: number, sprintId: number) {
    let sprintOrder = 0;
    const { _count: order } = await this.prisma.workItem.aggregate({
      where: { sprintId },
      _count: true,
    });
    sprintOrder = Number(order);

    return await this.prisma.workItem.update({
      where: { id },
      data: {
        sprintId,
        sprintOrder,
        statusInSprint: StatusInSprint.IN_SPRINT_PLANNING,
      },
    });
  }

  async findAssignedworkItemsInProject(projectId: number, userId: number) {
    const workItems = await this.prisma.workItem.findMany({
      where: { projectId, assignees: { some: { userId } } },
    });

    const todoCount = workItems.filter(
      (workItem) => workItem.progress === 0,
    ).length;
    const inProgressCount = workItems.filter(
      (workItem) => workItem.progress > 0 && workItem.progress < 100,
    ).length;
    const doneCount = workItems.filter(
      (workItem) => workItem.progress === 100,
    ).length;

    return {
      todo: todoCount,
      inProgress: inProgressCount,
      done: doneCount,
    };
  }
  async getAllworkItemsAndUserStories(projectId: number) {
    try {
      const workItems = await this.prisma.workItem.findMany({
        where: { projectId },
      });

      const userStories = await this.prisma.userStory.findMany({
        where: { projectId },
      });
      const workItemCounts = {
        total: workItems.length + userStories.length,
        totalBugs: workItems.filter((workItem) => workItem.type === Type.BUG)
          .length,
        totalReviews: workItems.filter(
          (workItem) => workItem.type === Type.REVIEW,
        ).length,
        totalTasks: workItems.filter((workItem) => workItem.type === Type.TASK)
          .length,
        totalSubtasks: workItems.filter(
          (workItem) => workItem.type === Type.SUBISSUE,
        ).length,
        totalUserStories: userStories.length,
      };

      return workItemCounts;
    } catch (err) {
      console.error('Error fetching workItems and user stories:', err);
      throw new Error('Failed to fetch workItems and user stories');
    }
  }
}
