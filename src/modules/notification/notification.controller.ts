import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/:userId')
  @UseGuards(JwtGuard)
  async getNotifications(@Param('userId') userId: number) {
    return this.notificationService.getNotifications(userId);
  }

  @Put('mark-as-read/:notificationId')
  @UseGuards(JwtGuard)
  async markNotificationAsRead(
    @Param('notificationId') notificationId: number,
  ) {
    return this.notificationService.markNotificationAsRead(notificationId);
  }
}