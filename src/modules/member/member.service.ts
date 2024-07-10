import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetMember, GetMemberList } from './entities/get-member.entity';
import { NotificationType, Role } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class MemberService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notification: NotificationService,
  ) {}

  async getLeaderByProjectId(projectId: number): Promise<GetMember | null> {
    const leaderInfo = await this.prisma.member.findFirst({
      where: { projectId, isAdmin: true },
      include: { User: true },
    });

    if (!leaderInfo) {
      return null;
    }

    return {
      projectId: leaderInfo.projectId,
      userId: leaderInfo.userId,
      name: leaderInfo.User.name,
      email: leaderInfo.User.email,
      avatar: leaderInfo.User.avatar,
      isAdmin: leaderInfo.isAdmin,
      role: leaderInfo.role,
    };
  }

  async addAdminToProject(projectId: number, userId: number) {
    return await this.prisma.member.create({
      data: {
        projectId,
        userId,
        isAdmin: true,
        role: Role.SCRUM_MASTER,
      },
    });
  }

  async getMembersByProjectId(projectId: number): Promise<GetMemberList> {
    const members = await this.prisma.member.findMany({
      where: { projectId },
      include: { User: true },
    });

    return {
      members: members.map((member) => ({
        projectId: member.projectId,
        userId: member.userId,
        name: member.User.name,
        email: member.User.email,
        avatar: member.User.avatar,
        isAdmin: member.isAdmin,
        role: member.role,
      })),
      total: members.length,
    };
  }

  async checkMemberInProject(
    projectId: number,
    userId: number,
  ): Promise<boolean> {
    const member = await this.prisma.member.findFirst({
      where: { projectId, userId },
    });

    return !!member;
  }

  async addMember(projectId: number, userId: number): Promise<any> {
    try {
      const member = await this.prisma.member.create({
        data: { userId, projectId },
      });
      const project = await this.prisma.project.update({
        where: { id: projectId },
        data: { updatedAt: new Date(Date.now()).toISOString() },
      });
      await Promise.all([member, project]);
      await this.notification.createNotification({
        userId,
        projectId,
        type: NotificationType.PROJECT_INVITE,
      });
      return member;
    } catch (err) {
      console.log(err);
      throw new Error('Failed to add member');
    }
  }

  async removeMember(projectId: number, userId: number): Promise<void> {
    try {
      // Check if the member exists in the project
      const member = await this.prisma.member.findFirst({
        where: { projectId, userId },
      });

      if (!member) {
        throw new Error('Member not found in the project');
      }

      const issues = await this.prisma.issue.findMany({
        where: { projectId },
      });

      const issueIds = issues.map((issue) => issue.id);

      await this.prisma.assignee.deleteMany({
        where: {
          issueId: { in: issueIds },
          userId,
        },
      });

      await this.prisma.notification.deleteMany({
        where: {
          projectId,
          userId,
        },
      });

      await this.prisma.member.delete({
        where: { id: member.id },
      });

      await this.prisma.project.update({
        where: { id: projectId },
        data: { updatedAt: new Date(Date.now()).toISOString() },
      });
    } catch (err) {
      console.log(err);
      throw new Error('Failed to remove member');
    }
  }

  async updateRole(
    projectId: number,
    userId: number,
    role: Role,
  ): Promise<any> {
    try {
      const member = await this.prisma.member.findFirst({
        where: { projectId, userId },
      });
      if (!member) {
        throw new Error('Member not found in the project');
      }
      return await this.prisma.member.update({
        where: { id: member.id },
        data: { role },
      });
    } catch (err) {
      console.log(err);
      throw new Error('Failed to update role');
    }
  }

  async getMemberByRole(projectId: number, role: Role): Promise<GetMemberList> {
    const rawMembers = await this.prisma.member.findMany({
      where: { projectId, role },
      include: { User: true },
    });
    return {
      members: rawMembers.map((member) => ({
        projectId: member.projectId,
        userId: member.userId,
        name: member.User.name,
        email: member.User.email,
        avatar: member.User.avatar,
        isAdmin: member.isAdmin,
        role: member.role,
      })),
      total: rawMembers.length,
    };
  }

  async checkRole(projectId: number, userId: number): Promise<any> {
    const member = await this.prisma.member.findFirst({
      where: { projectId, userId },
    });
    if (!member) {
      throw new Error('Member not found in the project');
    }
    return member;
  }
}
