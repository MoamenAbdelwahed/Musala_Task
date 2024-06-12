import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { InvalidCredentialsFilter } from './utils/filters/auth.filter';
import { EventModule } from './event/event.module';
import { ScheduledTask } from './notification/scheduledTask.controller';
import { NotificationService } from './notification/notification.service';
import { AuditLogService } from './notification/auditLog.service';
import { UserService } from './user/user.service';
import { User, UserSchema } from './user/user.model';
import { EventSchema } from './event/event.model';
import { AuditLog, AuditLogSchema } from './notification/auditLog.model';
import { EventService } from './event/event.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: User.name, schema: UserSchema },
      { name: AuditLog.name, schema: AuditLogSchema }
    ]),
    UserModule,
    AuthModule,
    EventModule
  ],
  controllers: [AppController],
  providers: [AppService, NotificationService, AuditLogService, UserService, EventService, InvalidCredentialsFilter, ScheduledTask],
})
export class AppModule {}
