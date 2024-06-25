import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class UtilService {
  constructor(private readonly prisma: PrismaService) {}

  async sameContainerReorder({ id, sId, order, newOrder, type }) {
    try {
      await this.prisma.$transaction(async (tx) => {
        const isMovingDown = newOrder > order;

        await tx.issue.updateMany({
          where: {
            [type === 'list' ? 'listId' : 'sprintId']: sId,
            AND: [
              {
                [type === 'list' ? 'listOrder' : 'sprintOrder']: {
                  [isMovingDown ? 'gt' : 'lt']: order,
                },
              },
              {
                [type === 'list' ? 'listOrder' : 'sprintOrder']: {
                  [isMovingDown ? 'lte' : 'gte']: newOrder,
                },
              },
            ],
          },
          data: {
            [type === 'list' ? 'listOrder' : 'sprintOrder']: {
              [isMovingDown ? 'decrement' : 'increment']: 1,
            },
          },
        });

        await tx.issue.update({
          where: { id },
          data: { [type === 'list' ? 'listOrder' : 'sprintOrder']: newOrder },
        });
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
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.issue.updateMany({
          where: {
            [type === 'list' ? 'listId' : 'sprintId']: sId,
            [type === 'list' ? 'listOrder' : 'sprintOrder']: {
              gt: order,
            },
          },
          data: {
            [type === 'list' ? 'listOrder' : 'sprintOrder']: {
              decrement: 1,
            },
          },
        });
        await tx.issue.updateMany({
          where: {
            [type === 'list' ? 'listId' : 'sprintId']: dId,
            [type === 'list' ? 'listOrder' : 'sprintOrder']: {
              gte: newOrder,
            },
          },
          data: {
            [type === 'list' ? 'listOrder' : 'sprintOrder']: {
              increment: 1,
            },
          },
        });

        await tx.issue.update({
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
}
