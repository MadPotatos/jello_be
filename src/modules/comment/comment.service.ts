import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { PostCommentDto } from './dto/create-comment.dto';
import { V1Comment } from './entities/get-comments-list.entity';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async getComments(issueId: number): Promise<V1Comment[]> {
    try {
      const cmts = await this.prisma.comment.findMany({
        where: { workItemId: +issueId },
        include: { User: { select: { name: true, avatar: true } } },
      });
      const rawData = cmts.map(({ User, ...d }) => ({ ...d, ...User }));

      const comments: V1Comment[] = await Promise.all(
        rawData.map(async (cmt) => {
          return {
            id: cmt.id,
            descr: cmt.descr,
            createdAt: cmt.createdAt,
            userId: cmt.userId,
            name: cmt.name,
            avatar: cmt.avatar,
          };
        }),
      );
      return comments;
    } catch (err) {
      console.log(err);
    }
  }

  async createComment(data: PostCommentDto) {
    try {
      const { descr, issueId, userId } = data;
      const cmt = await this.prisma.comment.create({
        data: { descr, workItemId: issueId, userId },
      });
      const User = await this.prisma.user.findUnique({
        where: { id: cmt.userId },
        select: { name: true, avatar: true },
      });
      return { ...cmt, ...User };
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
