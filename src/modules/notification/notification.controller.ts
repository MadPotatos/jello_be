import { Controller, Get, Sse } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Observable } from 'rxjs';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationSseService: NotificationService) {}
}
