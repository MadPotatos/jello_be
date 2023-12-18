import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: number) {
    return await this.prisma.project.findMany({
      where: { members: { some: { userId } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number) {
    return await this.prisma.project.findUnique({
      where: { id },
    });
  }
}
