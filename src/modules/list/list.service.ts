import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UtilService } from 'src/util.service';

@Injectable()
export class ListService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly util: UtilService,
  ) {}

  async getListsInProject(projectId: number) {
    try {
      const lists = await this.prisma.list.findMany({
        where: { projectId: +projectId },
        orderBy: { order: 'asc' },
      });
      return lists;
    } catch (err) {
      console.log(err);
    }
  }

  async createList(projectId: number) {
    try {
      const { _count: order } = await this.prisma.list.aggregate({
        where: { projectId },
        _count: true,
      });
      const list = await this.prisma.list.create({
        data: { projectId, order: order + 1 },
      });
      return list;
    } catch (err) {
      console.log(err);
    }
  }

  async updateList(id: number, data: any) {
    try {
      const list = await this.prisma.list.update({ where: { id: +id }, data });
      return list;
    } catch (err) {
      console.log(err);
    }
  }

  async deleteList(id: number) {
    try {
      const listToDelete = await this.prisma.list.findUnique({
        where: { id: +id },
        select: { order: true },
      });

      if (!listToDelete) {
        throw new Error('List not found');
      }

      const orderToDelete = listToDelete.order;

      await this.prisma.list.delete({ where: { id: +id } });
      await this.prisma.list.updateMany({
        where: {
          order: {
            gte: orderToDelete,
          },
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
      return { success: false, error: 'Failed to delete list' };
    }
  }

  async reorderLists(body: any) {
    try {
      const { id, order, newOrder, projectId } = body;
      await this.util.sameContainerReorder(
        { id, order, newOrder },
        { projectId },
        this.prisma.list,
      );
      return 'Successfully reordered lists';
    } catch (err) {
      console.log(err);
    }
  }
}
