import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async getComments(issueId: number) {
    try {
      const cmts = await this.prisma.comment.findMany({
        where: { issueId: +issueId },
        include: { User: { select: { name: true } } },
      });
      const data = cmts.map(({ User, ...d }) => ({ ...d, ...User }));
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  async createComment(data: any) {
    try {
      const cmt = await this.prisma.comment.create({ data });
      return cmt;
    } catch (err) {
      console.log(err);
    }
  }

  async deleteComment(id: number) {
    try {
      await this.prisma.comment.delete({ where: { id: +id } });
      return { message: 'The comment is deleted successfully' };
    } catch (err) {
      console.log(err);
    }
  }
}
