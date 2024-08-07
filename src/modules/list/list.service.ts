import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ListService {
  constructor(private readonly prisma: PrismaService) {}

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
        data: { projectId, order: Number(order) + 1 },
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
        select: { order: true, projectId: true },
      });

      if (!listToDelete) {
        throw new Error('List not found');
      }

      const orderToDelete = listToDelete.order;
      const projectId = listToDelete.projectId;

      await this.prisma.list.delete({ where: { id: +id } });
      await this.prisma.list.updateMany({
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
      return { success: false, error: 'Failed to delete list' };
    }
  }
}
