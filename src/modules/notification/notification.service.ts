import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Observable, Subject } from 'rxjs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(userId: number) {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: {
          userId: userId,
        },
      });

      return notifications;
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
