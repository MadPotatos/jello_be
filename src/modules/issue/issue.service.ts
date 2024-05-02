import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UtilService } from '../../util.service';
import { PostIssueDto } from './dto/create-issue.dto';
import { SprintStatus } from '@prisma/client';

@Injectable()
export class IssueService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly util: UtilService,
  ) {}

  async getIssuesByListInProject(projectId: number, userId?: number) {
    try {
      const listIssues = await this.prisma.list.findMany({
        where: { projectId: +projectId },
        orderBy: { order: 'asc' },
        include: {
          issues: {
            ...(userId && {
              where: { assignees: { some: { userId: +userId } } },
            }),
            where: { Sprint: { status: SprintStatus.IN_PROGRESS } },
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
                select: { comments: true },
              },
            },
          },
        },
      });
      const issues = listIssues.reduce(
        (p, { id, issues }) => ({
          ...p,
          [id]: issues.map(({ _count, ...issue }) => ({ ...issue, ..._count })),
        }),
        {},
      );
      return issues;
    } catch (err) {
      console.log(err);
    }
  }

  async getIssuesBySprintInProject(projectId: number, userId?: number) {
    try {
      const listIssues = await this.prisma.sprint.findMany({
        where: { projectId: +projectId },
        include: {
          issues: {
            ...(userId && {
              where: { assignees: { some: { userId: +userId } } },
            }),
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
                select: { comments: true },
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

  async createIssue(body: PostIssueDto) {
    const { listId, sprintId } = body;
    let listOrder = 0;
    let sprintOrder = 0;
    try {
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
      const issue = await this.prisma.issue.create({
        data: {
          ...body,
          ...(listId && { listOrder: Number(listOrder) }),
          ...(sprintId && { sprintOrder: Number(sprintOrder) }),
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
          await Promise.all([
            this.prisma.assignee.deleteMany({ where: { issueId: id } }), // Remove all existing assignees
            this.prisma.assignee.createMany({
              data: value.map((userId) => ({ issueId: id, userId, projectId })), // Create new assignees based on the provided array
            }),
          ]);
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

      await (sId === dId
        ? this.util.sameContainerReorder({ id, sId, order, newOrder, type })
        : this.util.diffContainerReorder(body));
      return;
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
}
