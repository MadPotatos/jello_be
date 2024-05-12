import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private notificationGateway: NotificationGateway,
  ) {}

  async createNotification(notificationData: any) {
    try {
      if (notificationData.userIds) {
        const userIds = notificationData.userIds;
        await Promise.all(
          userIds.map(async (userId) => {
            await this.prisma.notification.create({
              data: {
                message: notificationData.message,
                type: notificationData.type,
                projectId: notificationData.projectId,
                userId: userId,
              },
            });
          }),
        );
        this.notificationGateway.notifyNewNotification(userIds);
      } else {
        const newNotification = await this.prisma.notification.create({
          data: notificationData,
        });

        this.notificationGateway.notifyNewNotification([
          notificationData.userId,
        ]);

        return newNotification;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getNotifications(userId: number) {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: {
          userId: userId,
        },
        orderBy: { createdAt: 'desc' },
        include: {
          Project: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });

      const unreadNotificationsCount = notifications.filter(
        (notification) => !notification.isRead,
      ).length;

      return {
        notifications,
        unreadNotificationsCount,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async markNotificationAsRead(notificationId: number) {
    try {
      await this.prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async markAllNotificationsAsRead(userId: number) {
    try {
      await this.prisma.notification.updateMany({
        where: { userId: userId },
        data: { isRead: true },
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @Cron('0 0 * * *')
  async cleanUpNotifications() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 7); // Delete notifications older than 7 days

      await this.prisma.notification.deleteMany({
        where: { createdAt: { lt: cutoffDate } },
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
