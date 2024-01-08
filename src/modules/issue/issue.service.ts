import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service'; // Adjust the path accordingly
import { UtilService } from '../../util.service'; // Adjust the path accordingly

@Injectable()
export class IssueService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly util: UtilService,
  ) {}

  async getIssuesInProject(projectId: number, userId?: number) {
    try {
      const listIssues = await this.prisma.list.findMany({
        where: { projectId: +projectId },
        orderBy: { order: 'asc' },
        include: {
          issues: {
            ...(userId && {
              where: { assignees: { some: { userId: +userId } } },
            }),
            orderBy: { order: 'asc' },
            include: {
              assignees: {
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

  async createIssue(data: any) {
    try {
      const { projectId, listId, assignees, ...restData } = data;
      const { _count: order } = await this.prisma.issue.aggregate({
        where: { listId },
        _count: true,
      });
      const { id: issueId } = await this.prisma.issue.create({
        data: { ...restData, order: order + 1, listId },
      });

      await this.prisma.assignee.createMany({
        data: assignees.map((userId) => ({ issueId, userId, projectId })),
      });

      return { msg: 'issue is created' };
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
            data: { [type]: value, order: order + 1 },
          });
          break;
        case 'addAssignee':
          await Promise.all([
            this.prisma.assignee.create({
              data: { issueId: id, userId: value, projectId },
            }),
            this.updatedAt(id),
          ]);
          break;
        case 'removeAssignee':
          await Promise.all([
            this.prisma.assignee.deleteMany({
              where: { AND: { issueId: id, userId: value } },
            }),
            this.updatedAt(id),
          ]);
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

  async deleteIssue(id: number) {
    try {
      const issue = await this.prisma.issue.delete({ where: { id: +id } });
      return issue;
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
      } = body;

      await (sId === dId
        ? this.util.sameContainerReorder(
            { id, order, newOrder },
            { listId: sId },
            this.prisma.issue,
          )
        : this.util.diffContainerReorder(body, this.prisma.issue));

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
}
