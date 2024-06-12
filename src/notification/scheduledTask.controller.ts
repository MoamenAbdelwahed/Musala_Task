import { Injectable } from "@nestjs/common";
import { EventService } from "src/event/event.service";
import { NotificationService } from "./notification.service";
import { AuditLogService } from "./auditLog.service";
import { Cron } from "@nestjs/schedule";
import { UserService } from "src/user/user.service";

@Injectable()
export class ScheduledTask {
  constructor(
    private readonly eventService: EventService,
    private readonly notificationService: NotificationService,
    private readonly auditLogService: AuditLogService,
    private readonly userService: UserService
  ) {}

  @Cron('0 0 * * * *')
  async handleUpcomingEvents() {
    const upcomingEvents = await this.eventService.findUpcomingEvents();
    for (const event of upcomingEvents) {
      if (!event.notificationSent) {
        const users = await this.userService.getUsersForUpcomingEvent(event._id.toString())  
        const message = `Notification sent for event: ${event.name}`;
        users.forEach(async (user) => {
            await this.notificationService.sendNotification(user, event);
            await this.auditLogService.createLog(message, event._id.toString(), user._id.toString());
        });
        event.notificationSent = true;
        await event.save();
      }
    }
  }
}
