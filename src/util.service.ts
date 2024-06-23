import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class UtilService {
  constructor(private readonly prisma: PrismaService) {}

  async sameContainerReorder({ id, sId, order, newOrder, type }) {
    try {
      const prisma = this.prisma;

      await prisma.$transaction(async (tx) => {
        const ste = newOrder > order;

        const toBeMoved = await tx.issue.updateMany({
          where: {
            [type === 'list' ? 'listId' : 'sprintId']: sId,
            AND: [
              {
                [type === 'list' ? 'listOrder' : 'sprintOrder']: {
                  [ste ? 'gt' : 'lt']: order,
                },
              },
              {
                [type === 'list' ? 'listOrder' : 'sprintOrder']: {
                  [ste ? 'lte' : 'gte']: newOrder,
                },
              },
            ],
          },
          data: {
            [type === 'list' ? 'listOrder' : 'sprintOrder']: {
              [ste ? 'decrement' : 'increment']: 1,
            },
          },
        });

        const dragged = await tx.issue.update({
          where: { id },
          data: { [type === 'list' ? 'listOrder' : 'sprintOrder']: newOrder },
        });
        console.log('same is running' + dragged);
        return { toBeMoved, dragged };
      });
    } catch (err) {
      console.error(err);
    }
  }

  async diffContainerReorder({
    id,
    s: { sId, order },
    d: { dId, newOrder },
    type,
  }) {
    const prisma = this.prisma;

    try {
      await prisma.$transaction(async (tx) => {
        await this.updateOrder({
          tx,
          id: sId,
          order,
          issueType: 'source',
          type,
        });
        await this.updateOrder({
          tx,
          id: dId,
          order: newOrder,
          issueType: 'target',
          type,
        });
        const updatedIssue = await tx.issue.update({
          where: { id },
          data: {
            [type === 'list' ? 'listOrder' : 'sprintOrder']: newOrder,
            [type === 'list' ? 'listId' : 'sprintId']: dId,
          },
        });
      });
    } catch (err) {
      console.error(err);
    }
  }

  private async updateOrder({ tx, id, order, issueType, type }) {
    const isSource = issueType === 'source';
    return tx.issue.updateMany({
      where: {
        [type === 'list' ? 'listId' : 'sprintId']: id,
        [type === 'list' ? 'listOrder' : 'sprintOrder']: {
          [isSource ? 'gt' : 'gte']: order,
        },
      },
      data: {
        [type === 'list' ? 'listOrder' : 'sprintOrder']: {
          [isSource ? 'decrement' : 'increment']: 1,
        },
      },
    });
  }
}
