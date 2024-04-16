import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class UtilService {
  constructor(private readonly prisma: PrismaService) {}

  async sameContainerReorder({ id, order, newOrder }, whereConfig, model) {
    const ste = newOrder > order;
    const toBeMoved = model.updateMany({
      where: {
        ...whereConfig,
        AND: [
          { listOrder: { [ste ? 'gt' : 'lt']: order } },
          { listOrder: { [ste ? 'lte' : 'gte']: newOrder } },
        ],
      },
      data: { listOrder: { [ste ? 'decrement' : 'increment']: 1 } },
    });
    const dragged = model.update({
      where: { id },
      data: { listOrder: newOrder },
    });
    return Promise.all([toBeMoved, dragged]);
  }

  async diffContainerReorder(
    { id, s: { sId, order }, d: { dId, newOrder } },
    model,
  ) {
    const toBeUpdatedSource = this.updateOrder({
      id: sId,
      order,
      type: 'source',
      model,
    });
    const toBeUpdatedTarget = this.updateOrder({
      id: dId,
      order: newOrder,
      type: 'target',
      model,
    });

    const [nullAssignees, nullComments] = await Promise.all([
      this.prisma.assignee.findMany({ where: { issueId: id } }),
      this.prisma.comment.findMany({ where: { issueId: id } }),
    ]);

    const toBeDeleted = await model.delete({ where: { id } });
    await model.create({
      data: { ...toBeDeleted, listOrder: newOrder, listId: dId },
    });
    const reattachAssignees = this.prisma.assignee.createMany({
      data: nullAssignees,
    });
    const reattachComments = this.prisma.comment.createMany({
      data: nullComments,
    });

    return Promise.all([
      toBeUpdatedSource,
      toBeUpdatedTarget,
      reattachAssignees,
      reattachComments,
    ]);
  }

  private async updateOrder({ id, order, type, model }) {
    const isSource = type === 'source';
    return model.updateMany({
      where: { listId: id, listOrder: { [isSource ? 'gt' : 'gte']: order } },
      data: { listOrder: { [isSource ? 'decrement' : 'increment']: 1 } },
    });
  }
}
