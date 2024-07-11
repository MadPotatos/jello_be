import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { PostIssueDto } from './dto/create-issue.dto';
import {
  IssueType,
  NotificationType,
  SprintStatus,
  StatusInSprint,
} from '@prisma/client';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class IssueService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notification: NotificationService,
  ) {}

  async getAllIssuesByProject(projectId: number) {
    try {
      const issues = await this.prisma.issue.findMany({
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
          User: {
            select: { name: true, avatar: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      });
      return issues;
    } catch (err) {
      console.log(err);
    }
  }

  async getIssuesByListInProject(projectId: number) {
    try {
      const issueWhereClause = {
        Sprint: { status: SprintStatus.IN_PROGRESS },
      };

      const listIssues = await this.prisma.list.findMany({
        where: { projectId: +projectId },
        orderBy: { order: 'asc' },
        include: {
          issues: {
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

      const issues = listIssues.reduce(
        (acc, { id, issues }) => ({
          ...acc,
          [id]: issues.map(({ _count, ...issue }) => ({ ...issue, ..._count })),
        }),
        {},
      );

      return issues;
    } catch (err) {
      console.error('Error fetching issues:', err);
      throw new Error('Failed to fetch issues');
    }
  }

  async getIssuesBySprintInProject(projectId: number) {
    try {
      const listIssues = await this.prisma.sprint.findMany({
        where: {
          projectId: +projectId,
          NOT: { status: SprintStatus.COMPLETED },
        },
        include: {
          issues: {
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
      const issues = listIssues.reduce(
        (p, { id, issues }) => ({
          ...p,
          [id]: issues.map(({ _count, ...issue }) => ({
            ...issue,
            ..._count,
          })),
        }),
        {},
      );
      return issues;
    } catch (err) {
      console.log(err);
    }
  }

  async getSubIssuesByIssue(issueId: number) {
    try {
      const subIssues = await this.prisma.issue.findMany({
        where: { parentId: +issueId },
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
      return subIssues;
    } catch (err) {
      console.log(err);
    }
  }

  async createIssue(body: PostIssueDto) {
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
        const { _count: order } = await this.prisma.issue.aggregate({
          where: { listId: body.listId },
          _count: true,
        });
        listOrder = Number(order);
      }
      if (sprintId) {
        const { _count: order } = await this.prisma.issue.aggregate({
          where: { sprintId: body.sprintId },
          _count: true,
        });
        sprintOrder = Number(order);
      }
      let issueStatus: StatusInSprint = StatusInSprint.IN_SPRINT_PLANNING;

      if (sprintStatus === SprintStatus.IN_PROGRESS) {
        issueStatus = StatusInSprint.IN_SPRINT;
      }
      const issue = await this.prisma.issue.create({
        data: {
          ...body,
          ...(listId && { listOrder: Number(listOrder) }),
          ...(sprintId && {
            sprintOrder: Number(sprintOrder),
            statusInSprint: issueStatus,
          }),
        },
      });
      return { ...issue, assignees: [], comments: 0 };
    } catch (err) {
      console.log(err);
    }
  }

  async updateIssue(id: number, body: any) {
    try {
      const { type, value, projectId } = body;
      const issue = await this.prisma.issue.findUnique({
        where: { id: +id },
      });

      switch (type) {
        case 'listId':
          const { _count: order } = await this.prisma.issue.aggregate({
            where: { listId: value },
            _count: true,
          });
          await this.prisma.issue.update({
            where: { id },
            data: { [type]: value, listOrder: Number(order) + 1 },
          });
          break;
        case 'addAssignee':
          const existingAssigneesBeforeDelete =
            await this.prisma.assignee.findMany({
              where: { issueId: id },
              select: { userId: true },
            });
          await this.prisma.assignee.deleteMany({ where: { issueId: id } });

          await this.prisma.assignee.createMany({
            data: value.map((userId) => ({ issueId: id, userId })),
          });

          const existingAssigneesAfterAdd = await this.prisma.assignee.findMany(
            {
              where: { issueId: id },
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
                issueId: id,
                type: NotificationType.ASSIGNED_TO_ISSUE,
              });
            }),
          );
          await this.updatedAt(id);
          break;

        default:
          await this.prisma.issue.update({
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

  async reorderIssues(body: any) {
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

          await tx.issue.updateMany({
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

          await tx.issue.update({
            where: { id },
            data: { [field]: newOrder },
          });
        } else {
          // Different container reordering
          await tx.issue.updateMany({
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

          await tx.issue.updateMany({
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

          await tx.issue.update({
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
    return this.prisma.issue.update({
      where: { id },
      data: { updatedAt: new Date(Date.now()).toISOString() },
    });
  }

  async deleteIssue(id: number) {
    try {
      const issueToDelete = await this.prisma.issue.findUnique({
        where: { id: +id },
        select: { listOrder: true, listId: true },
      });

      if (!issueToDelete) {
        throw new Error('Issue not found');
      }

      const orderToDelete = issueToDelete.listOrder;
      const listId = issueToDelete.listId;

      await this.prisma.notification.deleteMany({
        where: {
          issueId: +id,
        },
      });

      await this.prisma.issue.delete({ where: { id: +id } });
      await this.prisma.issue.updateMany({
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
      return { success: false, error: 'Failed to delete issue' };
    }
  }

  async createTask(data: any) {
    return await this.prisma.issue.create({ data });
  }

  async getTaskByUserStorythatNotHaveSprint(userStoryId: number) {
    return await this.prisma.issue.findMany({
      where: {
        userStoryId,
        sprintId: null,
      },
    });
  }

  async addTaskInUserStorytoSprint(id: number, sprintId: number) {
    let sprintOrder = 0;
    const { _count: order } = await this.prisma.issue.aggregate({
      where: { sprintId },
      _count: true,
    });
    sprintOrder = Number(order);

    return await this.prisma.issue.update({
      where: { id },
      data: {
        sprintId,
        sprintOrder,
        statusInSprint: StatusInSprint.IN_SPRINT_PLANNING,
      },
    });
  }

  async findAssignedIssuesInProject(projectId: number, userId: number) {
    const issues = await this.prisma.issue.findMany({
      where: { projectId, assignees: { some: { userId } } },
    });

    const todoCount = issues.filter((issue) => issue.progress === 0).length;
    const inProgressCount = issues.filter(
      (issue) => issue.progress > 0 && issue.progress < 100,
    ).length;
    const doneCount = issues.filter((issue) => issue.progress === 100).length;

    return {
      todo: todoCount,
      inProgress: inProgressCount,
      done: doneCount,
    };
  }
  async getAllIssuesAndUserStories(projectId: number) {
    try {
      const issues = await this.prisma.issue.findMany({
        where: { projectId },
      });

      const userStories = await this.prisma.userStory.findMany({
        where: { projectId },
      });
      const issueCounts = {
        total: issues.length + userStories.length,
        totalBugs: issues.filter((issue) => issue.type === IssueType.BUG)
          .length,
        totalReviews: issues.filter((issue) => issue.type === IssueType.REVIEW)
          .length,
        totalTasks: issues.filter((issue) => issue.type === IssueType.TASK)
          .length,
        totalSubtasks: issues.filter(
          (issue) => issue.type === IssueType.SUBISSUE,
        ).length,
        totalUserStories: userStories.length,
      };

      return issueCounts;
    } catch (err) {
      console.error('Error fetching issues and user stories:', err);
      throw new Error('Failed to fetch issues and user stories');
    }
  }
}
